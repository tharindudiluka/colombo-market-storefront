import { shopifyFetch } from "@/lib/shopify/client";
import { navigationCollectionsQuery } from "@/lib/shopify/queries/navigation-collections";
import type { CollectionsIndexResult, LanguageCode, ShopifyCollection } from "@/lib/shopify/types";

export async function getNavigationCollections(language: LanguageCode): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<CollectionsIndexResult>({
      query: navigationCollectionsQuery,
      variables: { first: 100, language },
      tags: ["collection"],
    });
    return data.collections.nodes;
  } catch {
    return [];
  }
}
