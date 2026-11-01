import { shopifyFetch } from "@/lib/shopify/client";
import { toUiProduct, type UiProduct } from "@/lib/shopify/mappers";
import { homeRows, homeRowMaxProducts, homeRowMinProducts, type HomeRowKey } from "@/config/home-rows";
import type { LanguageCode, ShopifyProductNode } from "@/lib/shopify/types";

export type HomeRow = { key: HomeRowKey; handle: string | null; products: UiProduct[] };

const productFields = `id vendor handle title availableForSale
  variants(first: 5) { nodes { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } }
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }`;

type Collection = { products: { nodes: ShopifyProductNode[] } } | null;

/**
 * All collection-backed rows in ONE Storefront request (best sellers first, available products first), then
 * merged with the verified Sri Lankan products supplied by the caller. Rows below the minimum are dropped.
 */
export async function getHomeRows(language: LanguageCode, sriLankaProducts: Promise<UiProduct[]>): Promise<HomeRow[]> {
  const sriLanka = await sriLankaProducts;
  const collections = homeRows.flatMap((row, index) => (row.handle ? [{ row, index }] : []));
  const fields = collections.map(({ row, index }) => `r${index}: collection(handle: "${row.handle}") { products(first: 24, sortKey: BEST_SELLING) { nodes { ${productFields} } } }`);
  let data: Record<string, Collection> = {};
  try {
    data = await shopifyFetch<Record<string, Collection>>({
      query: `query HomeRows($language: LanguageCode) @inContext(country: DE, language: $language) { ${fields.join("\n")} }`,
      variables: { language },
      tags: ["collection", "homepage"],
    });
  } catch {
    data = {};
  }

  return homeRows
    .map((row, index): HomeRow => {
      if (!row.handle) return { key: row.key, handle: null, products: sriLanka };
      const nodes = data[`r${index}`]?.products.nodes ?? [];
      return { key: row.key, handle: row.handle, products: nodes.filter((node) => node.availableForSale && node.featuredImage).map(toUiProduct) };
    })
    .filter((row) => row.products.length >= homeRowMinProducts)
    .map((row) => ({ ...row, products: row.products.slice(0, homeRowMaxProducts) }));
}
