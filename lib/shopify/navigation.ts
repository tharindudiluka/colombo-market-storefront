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

function mapMenuItem(item: ShopifyMenuItem, validHandles?: Set<string>, includeContentLinks = false): NavigationEntry | null {
  const href = localizeMenuUrl(item.url) ?? "";
  const children = (item.items ?? [])
    .map((child) => mapMenuItem(child, validHandles, includeContentLinks))
    .filter((child): child is NavigationEntry => child !== null);
  // Mobile retains catalog entries; desktop can also show existing store content links.
  const collectionHandle = href.match(/^\/collections\/([^/?]+)\/?$/)?.[1];
  const isCollection = collectionHandle !== undefined && (!validHandles || validHandles.has(collectionHandle));
  const isContentLink = includeContentLinks && ((href === "/" && !item.url?.includes("#")) || /^\/pages\/[^/?]+\/?$/.test(href) || href === "/contact");
  if (!isCollection && !isContentLink && children.length === 0) return null;
  return { id: item.id, title: item.title, href: isCollection || isContentLink ? (href === "/" ? href : href.replace(/\/$/, "")) : "", children };
}

export async function getNavigationEntries(language: LanguageCode, includeContentLinks = false): Promise<NavigationEntry[]> {
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
      .map((item) => mapMenuItem(item, validHandles, includeContentLinks))
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
