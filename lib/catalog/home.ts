import { shopifyFetch } from "@/lib/shopify/client";
import { homeFamilies } from "@/config/home-families";
import type { LanguageCode } from "@/lib/shopify/types";

type Probe = { products: { nodes: { availableForSale: boolean }[] } } | null;

/** Product families whose collection exists and has at least one available product, in config order. One request. */
export async function getAvailableFamilies(language: LanguageCode) {
  const fields = homeFamilies.map((family, i) => `f${i}: collection(handle: "${family.handle}") { products(first: 20) { nodes { availableForSale } } }`);
  try {
    const data = await shopifyFetch<Record<string, Probe>>({
      query: `query HomeFamilies($language: LanguageCode) @inContext(country: DE, language: $language) { ${fields.join("\n")} }`,
      variables: { language },
      tags: ["collection", "homepage"],
    });
    return homeFamilies.filter((_, i) => data[`f${i}`]?.products.nodes.some((node) => node.availableForSale));
  } catch {
    return [];
  }
}
