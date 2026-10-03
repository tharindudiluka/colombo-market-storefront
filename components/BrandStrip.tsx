import { getLocale } from "next-intl/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { homepageBrandsQuery } from "@/lib/shopify/queries/homepage-brands";
import { toUiHomepageBrand, type UiHomepageBrand } from "@/lib/shopify/mappers";
import type { HomepageBrandsResult, LanguageCode } from "@/lib/shopify/types";
import { BrandStripClient } from "@/components/BrandStripClient";

export async function BrandStrip() {
  const language = (await getLocale()).toUpperCase() as LanguageCode;
  const brands: UiHomepageBrand[] = [];
  let after: string | null = null;
  try {
    do {
      const data: HomepageBrandsResult = await shopifyFetch<HomepageBrandsResult>({
        query: homepageBrandsQuery, variables: { language, after }, tags: ["homepage", "brands"],
        revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
      });
      for (const node of data.metaobjects.nodes) {
        const brand = toUiHomepageBrand(node);
        if (brand) brands.push(brand);
      }
      after = data.metaobjects.pageInfo.hasNextPage ? data.metaobjects.pageInfo.endCursor : null;
    } while (after);
  } catch (error) {
    console.error("Homepage brands could not be loaded", error);
    return null;
  }
  if (!brands.length) return null;
  return <BrandStripClient brands={brands.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))} />;
}
