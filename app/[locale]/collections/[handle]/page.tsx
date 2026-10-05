import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionByHandleQuery } from "@/lib/shopify/queries/collection-by-handle";
import { toUiCollectionDetail } from "@/lib/shopify/mappers";
import { canonicalMetadata } from "@/lib/seo";
import type { CollectionByHandleResult, LanguageCode } from "@/lib/shopify/types";

const sortOptions = {
  featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  bestSelling: { sortKey: "BEST_SELLING", reverse: false },
  az: { sortKey: "TITLE", reverse: false },
  za: { sortKey: "TITLE", reverse: true },
  priceAsc: { sortKey: "PRICE", reverse: false },
  priceDesc: { sortKey: "PRICE", reverse: true },
  dateAsc: { sortKey: "CREATED", reverse: false },
  dateDesc: { sortKey: "CREATED", reverse: true },
} as const;

const filterKeys = new Set([
  "available", "category", "price", "productMetafield", "productType", "productVendor",
  "tag", "taxonomyMetafield", "variantMetafield", "variantOption",
]);

function parseFilters(params: { filter?: string | string[] }) {
  const serialized = params.filter ? (Array.isArray(params.filter) ? params.filter : [params.filter]) : [];
  const parsed: Record<string, unknown>[] = [];
  for (const value of serialized.slice(0, 40)) {
    try {
      const candidate = JSON.parse(value) as unknown;
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        const filter = candidate as Record<string, unknown>;
        if (Object.keys(filter).length === 1 && Object.keys(filter).every((key) => filterKeys.has(key))) {
          parsed.push(filter);
        }
      }
    } catch {
      // Ignore malformed URL filter values.
    }
  }
  return parsed;
}

async function getCollection(
  handle: string,
  language: LanguageCode,
  filters: Record<string, unknown>[] = [],
  sort = "featured"
) {
  const sortOption = sortOptions[sort as keyof typeof sortOptions] ?? sortOptions.featured;
  const data = await shopifyFetch<CollectionByHandleResult>({
    query: collectionByHandleQuery,
    variables: { handle, first: 48, language, filters, ...sortOption },
    tags: ["collection", handle],
  });
  return data.collection;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LanguageCode;
  const raw = await getCollection(handle, language);
  if (!raw) return {};

  const collection = toUiCollectionDetail(raw);
  return {
    ...canonicalMetadata(locale, `/collections/${raw.handle}`),
    title: collection.seo.title || `${collection.title} — Colombo Market`,
    description: collection.seo.description || undefined,
    openGraph: collection.image ? { images: [collection.image.url] } : undefined,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{ filter?: string | string[]; sort?: string }>;
}) {
  const [{ locale, handle }, query] = await Promise.all([params, searchParams]);
  const language = locale.toUpperCase() as LanguageCode;
  const filters = parseFilters(query);

  const raw = await getCollection(handle, language, filters, query.sort);
  if (!raw) notFound();

  const collection = toUiCollectionDetail(raw);
  const availabilityFacet = raw.products.filters?.find((filter) => filter.id.includes("availability"));
  const totalProductCount = availabilityFacet?.values.reduce((total, value) => total + value.count, 0);
  const t = await getTranslations("collection");
  const tNav = await getTranslations("nav");
  const categoryLabel = collection.title || tNav(handle);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <Breadcrumbs currentPath={`/collections/${handle}`} items={[{ label: categoryLabel }]} />

        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-2 pt-3">
          <h1 className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
            {categoryLabel}
          </h1>
        </div>

        <CollectionBrowser
          products={collection.products}
          filters={raw.products.filters ?? []}
          activeFilters={filters}
          sort={query.sort ?? "featured"}
          totalCount={totalProductCount}
        />

        <section className="bg-brand-cream">
          <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-brand-teal-dark/80">
            <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">
              {t("aboutTitle", { title: categoryLabel })}
            </h2>
            {collection.descriptionHtml ? (
              <div
                className="prose prose-sm mt-3 max-w-none leading-relaxed [&_a]:text-brand-teal [&_li]:mt-1 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
              />
            ) : (
              <p className="mt-3 leading-relaxed">
                {t("aboutFallback", { title: categoryLabel, count: collection.products.length })}
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
