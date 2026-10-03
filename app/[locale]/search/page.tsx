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
import type { LanguageCode, SearchProductsResult } from "@/lib/shopify/types";

async function searchProducts(query: string, language: LanguageCode, vendor?: string) {
  if (!query) return [];
  const products = [];
  let after: string | null = null;
  do {
    const data: SearchProductsResult = await shopifyFetch<SearchProductsResult>({
      query: searchProductsQuery,
      variables: { query, first: vendor ? 250 : 48, language, after },
      tags: ["products"],
      revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
    });
    products.push(...data.products.edges.filter(edge => !vendor || edge.node.vendor === vendor).map(edge => toUiProduct(edge.node)));
    after = vendor && data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return products;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; vendor?: string }>;
}): Promise<Metadata> {
  const { q, vendor: vendorParam } = await searchParams;
  const vendor = vendorParam?.trim();
  const query = vendor ? `vendor:${JSON.stringify(vendor)}` : (q ?? "").trim();
  return { title: vendor ? `${vendor} — Colombo Market` : query ? `${query} — Colombo Market` : "Search — Colombo Market" };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; vendor?: string }>;
}) {
  const { locale } = await params;
  const { q, vendor: vendorParam } = await searchParams;
  const vendor = vendorParam?.trim();
  const query = vendor ? `vendor:${JSON.stringify(vendor)}` : (q ?? "").trim();
  const language = locale.toUpperCase() as LanguageCode;

  const products = await searchProducts(query, language, vendor);
  const t = await getTranslations("search");

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
          <CollectionBrowser products={products} />
        )}
      </main>

      <Footer />
    </div>
  );
}
