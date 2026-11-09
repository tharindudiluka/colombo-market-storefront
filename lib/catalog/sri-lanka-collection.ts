import { shopifyFetch } from "@/lib/shopify/client";
import { toUiProduct, type UiProduct } from "@/lib/shopify/mappers";
import { sriLankaAllHandle, sriLankaShortcuts } from "@/config/sri-lanka";
import type { LanguageCode, ShopifyProductNode } from "@/lib/shopify/types";

export type SriLankaShortcut = { handle: string; labelKey: string; count: number };
export type SriLankaCollection = { title: string; products: UiProduct[]; total: number; shortcuts: SriLankaShortcut[] };

type Node = ShopifyProductNode & { collections: { nodes: { handle: string }[] } };

const productFields = `id vendor handle title productType tags availableForSale
  variants(first: 2) { nodes { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } }
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  collections(first: 25) { nodes { handle } }`;

/**
 * The CURRENT live Sri Lankan collection (the automated `origin:sri-lanka` collection, not a hardcoded product list),
 * in one request: available products with images in collection order, plus a shortcut per existing sub-collection
 * that really contains at least one of those products (with the count), so no shortcut leads somewhere unrelated.
 */
export async function getSriLankaCollection(language: LanguageCode, limit = 16): Promise<SriLankaCollection | null> {
  try {
    const data = await shopifyFetch<{ collection: { title: string; products: { nodes: Node[] } } | null }>({
      query: `query SriLankaCollection($handle: String!, $language: LanguageCode) @inContext(country: DE, language: $language) {
        collection(handle: $handle) { title products(first: 100) { nodes { ${productFields} } } }
      }`,
      variables: { handle: sriLankaAllHandle, language },
      tags: ["collection", "categories-page", sriLankaAllHandle],
    });
    const collection = data.collection;
    if (!collection) return null;
    const live = collection.products.nodes.filter((node) => node.availableForSale && node.featuredImage);
    if (!live.length) return null;
    const shortcuts = sriLankaShortcuts
      .map((shortcut) => ({ ...shortcut, count: live.filter((node) => node.collections.nodes.some((c) => c.handle === shortcut.handle)).length }))
      .filter((shortcut) => shortcut.count > 0);
    return { title: collection.title, products: live.slice(0, limit).map(toUiProduct), total: live.length, shortcuts };
  } catch {
    return null;
  }
}
