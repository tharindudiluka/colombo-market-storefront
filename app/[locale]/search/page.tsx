import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { searchProductsQuery } from "@/lib/shopify/queries/search-products";
import { toUiProduct } from "@/lib/shopify/mappers";
import { runTieredSearch, type SearchTier } from "@/lib/search/search-query";
import type { LanguageCode, SearchProductsResult, ShopifyProductNode } from "@/lib/shopify/types";

// Results are read in batches (Storefront maximum 250) up to a safety cap, then paged for display
// so every result is reachable.
const PAGE_SIZE = 48;
const MAX_RESULTS = 500;

async function fetchSearchNodes(query: string, language: LanguageCode, tier: SearchTier) {
  const nodes: ShopifyProductNode[] = [];
  let after: string | null = null;
  do {
    const data: SearchProductsResult = await shopifyFetch<SearchProductsResult>({
      query: searchProductsQuery,
      // Only the text tier needs descriptions (to verify matches); the fielded tiers do not.
      variables: { query, first: 250, language, after, withText: tier === "text" },
      tags: ["products"],
      revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
    });
    nodes.push(...data.products.edges.map(edge => edge.node));
    after = data.products.pageInfo.hasNextPage && data.products.pageInfo.endCursor !== after ? data.products.pageInfo.endCursor : null;
  } while (after && nodes.length < MAX_RESULTS);
  return nodes;
}

// Exact terms first, then controlled synonyms, then description matches; taxonomy tags never match on
// their own (see lib/search/search-query.ts).
async function searchProducts(query: string, language: LanguageCode, vendor?: string) {
  if (!query) return [];
  const nodes = await runTieredSearch(query, (tierQuery, tier) => fetchSearchNodes(tierQuery, language, tier));
  return nodes.filter(node => !vendor || node.vendor === vendor).map(toUiProduct);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; vendor?: string }>;
}): Promise<Metadata> {
  const { q, vendor: vendorParam } = await searchParams;
  const vendor = vendorParam?.trim();
  const query = vendor ? `vendor:${JSON.stringify(vendor)}` : (q ?? "").trim();
  return {
    title: vendor ? `${vendor} — Colombo Market` : query ? `${query} — Colombo Market` : "Search — Colombo Market",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; vendor?: string; page?: string | string[] }>;
}) {
  const { locale } = await params;
  const { q, vendor: vendorParam, page: pageParam } = await searchParams;
  const vendor = vendorParam?.trim();
  const query = vendor ? `vendor:${JSON.stringify(vendor)}` : (q ?? "").trim();
  const language = locale.toUpperCase() as LanguageCode;

  const products = await searchProducts(query, language, vendor);
  const t = await getTranslations("search");
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "", 10);
  const page = Math.min(Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1, pageCount);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <Breadcrumbs items={[{ label: t("title") }]} />

        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-2 pt-3">
          <h1 className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
            {vendor || (query ? t("resultsFor", { query }) : t("title"))}
          </h1>
        </div>

        {!query ? (
          <p className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 text-sm text-brand-teal-dark/60">
            {t("prompt")}
          </p>
        ) : products.length === 0 ? (
          <p className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 text-sm text-brand-teal-dark/60">
            {t("noResults", { query })}
          </p>
        ) : (
          <CollectionBrowser
            products={products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
            totalCount={products.length}
            page={page}
            pageCount={pageCount}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
