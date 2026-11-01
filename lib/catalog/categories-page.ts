import { shopifyFetch } from "@/lib/shopify/client";
import { toUiProduct, type UiProduct } from "@/lib/shopify/mappers";
import { sriLankaProducts, sriLankaShowcaseSize } from "@/config/sri-lanka";
import type { NavigationEntry } from "@/lib/shopify/navigation";
import type { LanguageCode, ShopifyProductNode } from "@/lib/shopify/types";

export type CategoryImage = { url: string; alt: string };
export type CategorySub = { id: string; title: string; handle: string };
export type CategoryCard = {
  id: string;
  title: string;
  handle: string;
  /** Exact only while the collection fits one page of the query; null otherwise. */
  productCount: number | null;
  images: CategoryImage[];
  subs: CategorySub[];
};

const handleOf = (href: string) => /^\/collections\/([a-z0-9-]+)$/.exec(href)?.[1] ?? null;
const safe = (handle: string) => /^[a-z0-9-]+$/.test(handle);

type CollectionProbe = {
  products: {
    pageInfo?: { hasNextPage: boolean };
    nodes: { id: string; availableForSale: boolean; featuredImage: { url: string; altText: string | null } | null }[];
  };
} | null;

/**
 * One Storefront request for the whole directory: the top-level departments (with enough products to count them and
 * pick images) and a 1-product probe per subcategory so empty subcategories are never promoted.
 */
export async function getCategoryDirectory(entries: NavigationEntry[], language: LanguageCode): Promise<CategoryCard[]> {
  const parents = entries.map((entry) => ({ entry, handle: handleOf(entry.href) })).filter((p): p is { entry: NavigationEntry; handle: string } => !!p.handle && safe(p.handle));
  const subs = parents.flatMap((p, pi) => p.entry.children.map((child) => ({ pi, child, handle: handleOf(child.href) })).filter((s): s is { pi: number; child: NavigationEntry; handle: string } => !!s.handle && safe(s.handle)));

  const fields = [
    ...parents.map((p, i) => `p${i}: collection(handle: "${p.handle}") { products(first: 100, sortKey: BEST_SELLING) { pageInfo { hasNextPage } nodes { id availableForSale featuredImage { url altText } } } }`),
    ...subs.map((s, i) => `s${i}: collection(handle: "${s.handle}") { products(first: 1) { nodes { id availableForSale featuredImage { url altText } } } }`),
  ];
  let data: Record<string, CollectionProbe> = {};
  if (fields.length) {
    try {
      data = await shopifyFetch<Record<string, CollectionProbe>>({
        query: `query CategoryDirectory($language: LanguageCode) @inContext(country: DE, language: $language) { ${fields.join("\n")} }`,
        variables: { language },
        tags: ["collection", "categories-page"],
      });
    } catch {
      data = {};
    }
  }

  return parents.map((p, i) => {
    const probe = data[`p${i}`];
    const nodes = probe?.products.nodes ?? [];
    const withImage = nodes.filter((n) => n.featuredImage);
    const ordered = [...withImage.filter((n) => n.availableForSale), ...withImage.filter((n) => !n.availableForSale)];
    return {
      id: p.entry.id,
      title: p.entry.title,
      handle: p.handle,
      productCount: probe && !probe.products.pageInfo?.hasNextPage ? nodes.length : null,
      images: ordered.slice(0, 3).map((n) => ({ url: n.featuredImage!.url, alt: n.featuredImage!.altText ?? "" })),
      subs: subs
        // When the probe failed (data empty) keep the menu's own links so crawl paths survive.
        .filter((s) => s.pi === i && (!Object.keys(data).length || (data[`s${subs.indexOf(s)}`]?.products.nodes.length ?? 0) > 0))
        .map((s) => ({ id: s.child.id, title: s.child.title, handle: s.handle })),
    };
  });
}

const productFields = `id vendor handle title productType tags availableForSale
  variants(first: 2) { nodes { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } }
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }`;

/** Verified Sri Lankan products (config/sri-lanka.ts) that exist and are available, in config priority order. */
export async function getSriLankaProducts(language: LanguageCode, limit: number = sriLankaShowcaseSize): Promise<UiProduct[]> {
  try {
    const data = await shopifyFetch<Record<string, ShopifyProductNode | null>>({
      query: `query SriLankaProducts($language: LanguageCode) @inContext(country: DE, language: $language) {
        ${sriLankaProducts.map((p, i) => `p${i}: product(handle: "${p.handle}") { ${productFields} }`).join("\n")}
      }`,
      variables: { language },
      tags: ["product", "categories-page"],
    });
    return sriLankaProducts
      .map((_, i) => data[`p${i}`])
      .filter((node): node is ShopifyProductNode => !!node && node.availableForSale)
      .slice(0, limit)
      .map(toUiProduct);
  } catch {
    return [];
  }
}
