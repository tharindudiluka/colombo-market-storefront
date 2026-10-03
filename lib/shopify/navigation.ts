import { site } from "@/config/site";
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

function localizeMenuUrl(url: string | null): string {
  if (!url || url === "#") return "#";
  try {
    const parsed = new URL(url, "https://shopify.local");
    const internalHosts = ["shopify.local", site.domain, process.env.SHOPIFY_STORE_DOMAIN];
    if (!internalHosts.includes(parsed.hostname)) return parsed.href;
    // Shopify resource URLs can already include a locale. Our Link applies it.
    const segments = parsed.pathname.split("/");
    if (site.locale.supported.some((locale) => locale === segments[1])) {
      segments.splice(1, 1);
    }
    const pathname = segments.join("/") || "/";
    if (pathname === "/" && url.endsWith("#")) return "#";
    return `${pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "#";
  }
}

function mapMenuItem(item: ShopifyMenuItem): NavigationEntry {
  return {
    id: item.id,
    title: item.title,
    href: localizeMenuUrl(item.url),
    children: (item.items ?? []).map(mapMenuItem),
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
  return (data.menu?.items ?? []).map(mapMenuItem);
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
