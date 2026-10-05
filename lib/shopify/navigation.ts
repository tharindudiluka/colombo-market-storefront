import { normalizeStorefrontUrl } from "@/lib/shopify/storefront-url";
import { localMenuPageHrefs } from "@/config/pages";
import { shopifyFetch } from "@/lib/shopify/client";
import { navigationCollectionsQuery } from "@/lib/shopify/queries/navigation-collections";
import { navigationMenuQuery } from "@/lib/shopify/queries/navigation-menu";
import type { CollectionsIndexResult, LanguageCode, NavigationMenuResult, ShopifyCollection, ShopifyMenuItem } from "@/lib/shopify/types";

export type NavigationEntry = {
  id: string;
  title: string;
  href: string;
  children: NavigationEntry[];
};

export function localizeMenuUrl(item: ShopifyMenuItem, primaryDomain: string): string {
  return item.url ? normalizeStorefrontUrl(item.url, primaryDomain) : "#";
}

function mapMenuItem(item: ShopifyMenuItem, primaryDomain: string): NavigationEntry {
  return {
    id: item.id,
    title: item.title,
    href: localMenuPageHrefs[item.id] ?? localizeMenuUrl(item, primaryDomain),
    children: (item.items ?? []).map(child => mapMenuItem(child, primaryDomain)),
  };
}

export async function getNavigationEntries(language: LanguageCode): Promise<NavigationEntry[]> {
  const data = await shopifyFetch<NavigationMenuResult>({
    query: navigationMenuQuery,
    variables: { handle: "main-menu", language },
    tags: ["navigation", "main-menu"],
    // Menu edits are immediately visible locally; production retains the existing cache.
    revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
  });
  return (data.menu?.items ?? []).map(item => mapMenuItem(item, data.shop.primaryDomain.url));
}
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
