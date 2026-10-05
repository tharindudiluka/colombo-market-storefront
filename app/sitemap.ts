import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { pageHandles, pageHref, policyHref } from "@/config/pages";
import { storefrontUrl } from "@/lib/seo";
import { shopifyFetch } from "@/lib/shopify/client";
import { sitemapResourcesQuery } from "@/lib/shopify/queries/sitemap";
import { shopPoliciesQuery } from "@/lib/shopify/queries/shop-policies";
import { policyFields } from "@/lib/shopify/policies";
import type { LanguageCode, ShopPoliciesResult } from "@/lib/shopify/types";

export const revalidate = 3600;
type Resource = "products" | "collections" | "pages";
type ResourceNode = { handle: string; updatedAt: string };
type Connection = { nodes: ResourceNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };

async function resources(resource: Resource, language: LanguageCode) {
  const nodes: ResourceNode[] = [];
  let after: string | null = null;
  do {
    const data: Record<Resource, Connection> = await shopifyFetch({
      query: sitemapResourcesQuery(resource), variables: { after, language }, tags: [`sitemap-${resource}`],
    });
    const connection = data[resource];
    nodes.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) break;
    if (!connection.pageInfo.endCursor || connection.pageInfo.endCursor === after) {
      throw new Error(`Shopify sitemap ${resource} pagination did not advance`);
    }
    after = connection.pageInfo.endCursor;
  } while (after);
  return nodes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await Promise.all(site.locale.supported.map(async locale => {
    const language = locale.toUpperCase() as LanguageCode;
    const [products, collections, pages, policies] = await Promise.all([
      resources("products", language), resources("collections", language), resources("pages", language),
      shopifyFetch<ShopPoliciesResult>({ query: shopPoliciesQuery, variables: { language }, tags: ["shop-policies"] }),
    ]);
    const paths: { pathname: string; updatedAt?: string }[] = [
      { pathname: "/" }, { pathname: "/collections" },
      { pathname: pageHref(pageHandles.about) }, { pathname: "/contact" },
      ...products.map(node => ({ pathname: `/products/${node.handle}`, updatedAt: node.updatedAt })),
      ...collections.filter(node => node.handle !== "all")
        .map(node => ({ pathname: `/collections/${node.handle}`, updatedAt: node.updatedAt })),
      // Invalid legacy pages and the duplicate contact alias remain excluded.
      ...pages.filter(node => ![pageHandles.contact, pageHandles.about, "produkte", "reis"].includes(node.handle))
        .map(node => ({ pathname: pageHref(node.handle), updatedAt: node.updatedAt })),
      ...Object.entries(policyFields).filter(([, field]) => policies.shop[field]?.body.trim())
        .map(([handle]) => ({ pathname: policyHref(handle) })),
    ];
    return paths.map(({ pathname, updatedAt }) => ({
      url: storefrontUrl(locale, pathname), ...(updatedAt ? { lastModified: updatedAt } : {}),
      alternates: { languages: {
        de: storefrontUrl("de", pathname), en: storefrontUrl("en", pathname),
        "x-default": storefrontUrl("de", pathname),
      } },
    }));
  }));
  const unique = [...new Map(entries.flat().map(entry => [entry.url, entry])).values()];
  if (unique.length > 50000) throw new Error("Storefront sitemap exceeds 50,000 URLs; split before publishing");
  return unique;
}
