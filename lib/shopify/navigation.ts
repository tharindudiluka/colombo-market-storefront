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

function localizeMenuUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, "https://shopify.local");
    return parsed.pathname.startsWith("/") ? `${parsed.pathname}${parsed.search}` : null;
  } catch {
    return null;
  }
}

function mapMenuItem(item: ShopifyMenuItem, validHandles?: Set<string>): NavigationEntry | null {
  const href = localizeMenuUrl(item.url) ?? "";
  const children = (item.items ?? [])
    .map((child) => mapMenuItem(child, validHandles))
    .filter((child): child is NavigationEntry => child !== null);
  // Keep only store-internal collection links; skip stale/external/non-catalog menu targets.
  const collectionHandle = href.match(/^\/collections\/([^/?]+)\/?$/)?.[1];
  const isCollection = collectionHandle !== undefined && (!validHandles || validHandles.has(collectionHandle));
  if (!isCollection && children.length === 0) return null;
  return { id: item.id, title: item.title, href: isCollection ? href.replace(/\/$/, "") : "", children };
}

export async function getNavigationEntries(language: LanguageCode): Promise<NavigationEntry[]> {
  const [menuResult, collectionsResult] = await Promise.allSettled([
    shopifyFetch<NavigationMenuResult>({
      query: navigationMenuQuery,
      variables: { handle: "main-menu", language },
      tags: ["navigation", "main-menu"],
    }),
    shopifyFetch<CollectionsIndexResult>({
      query: navigationCollectionsQuery,
      variables: { first: 250, language },
      tags: ["collection"],
    }),
  ]);

  if (menuResult.status === "fulfilled" && menuResult.value.menu?.items.length) {
    const validHandles = collectionsResult.status === "fulfilled"
      ? new Set(collectionsResult.value.collections.nodes.map((collection) => collection.handle))
      : undefined;
    const entries = menuResult.value.menu.items
      .map((item) => mapMenuItem(item, validHandles))
      .filter((entry): entry is NavigationEntry => entry !== null);
    if (entries.length) return entries;
  }

  // If the Storefront token can't read menus, retain live Shopify collections as a safe fallback.
  if (collectionsResult.status === "fulfilled") {
    return collectionsResult.value.collections.nodes.map((collection) => ({
      id: collection.id,
      title: collection.title,
      href: `/collections/${collection.handle}`,
      children: [],
    }));
  }
  return [];
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
