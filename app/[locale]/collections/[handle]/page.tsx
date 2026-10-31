import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { CollectionSubnav } from "@/components/CollectionSubnav";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionByHandleQuery } from "@/lib/shopify/queries/collection-by-handle";
import { toUiCollectionDetail } from "@/lib/shopify/mappers";
import { canonicalMetadata, storefrontUrl } from "@/lib/seo";
import type { CollectionByHandleResult, LanguageCode, ShopifyCollectionDetail } from "@/lib/shopify/types";

// Products per rendered page, and how many are fetched per Storefront request. The full
// (filtered) collection is read in batches so the count and the in-stock ordering are
// accurate; only one page worth of tiles is sent to the browser. MAX_PRODUCTS is a safety cap.
const PAGE_SIZE = 48;
const FETCH_BATCH = 100;
const MAX_PRODUCTS = 500;

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
  sort = "featured",
  { all = true }: { all?: boolean } = {}
): Promise<ShopifyCollectionDetail | null> {
  const sortOption = sortOptions[sort as keyof typeof sortOptions] ?? sortOptions.featured;
  let collection: ShopifyCollectionDetail | null = null;
  const edges: ShopifyCollectionDetail["products"]["edges"] = [];
  let after: string | null = null;
  do {
    const data: CollectionByHandleResult = await shopifyFetch<CollectionByHandleResult>({
      query: collectionByHandleQuery,
      variables: { handle, first: all ? FETCH_BATCH : 1, after, language, filters, ...sortOption },
      tags: ["collection", handle],
    });
    if (!data.collection) return null;
    collection ??= data.collection;
    edges.push(...data.collection.products.edges);
    const { hasNextPage, endCursor } = data.collection.products.pageInfo;
    after = all && hasNextPage && endCursor && endCursor !== after ? endCursor : null;
  } while (after && edges.length < MAX_PRODUCTS);
  return { ...collection, products: { ...collection.products, edges } };
}

function parsePage(value: string | string[] | undefined) {
  const page = Number.parseInt(Array.isArray(value) ? value[0] : value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const [{ locale, handle }, query] = await Promise.all([params, searchParams]);
  const language = locale.toUpperCase() as LanguageCode;
  const raw = await getCollection(handle, language, [], "featured", { all: false });
  if (!raw) return {};

  const collection = toUiCollectionDetail(raw);
  // Paginated pages (page 2+) are self-canonical; filter and sort variants keep pointing at the base URL.
  const page = parsePage(query.page);
  const canonical = page > 1
    ? { alternates: { canonical: `${storefrontUrl(locale, `/collections/${raw.handle}`)}?page=${page}` } }
    : canonicalMetadata(locale, `/collections/${raw.handle}`);
  return {
    ...canonical,
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
  searchParams: Promise<{ filter?: string | string[]; sort?: string; page?: string | string[] }>;
}) {
  const [{ locale, handle }, query] = await Promise.all([params, searchParams]);
  const language = locale.toUpperCase() as LanguageCode;
  const filters = parseFilters(query);

  const [raw, navEntries] = await Promise.all([getCollection(handle, language, filters, query.sort), getNavigationEntries(language)]);
  if (!raw) notFound();

  const collection = toUiCollectionDetail(raw);
  // Real number of products (after filters). The availability facet counts variants, which
  // double-counts products whose sizes are only partly in stock.
  const totalProductCount = collection.products.length;
  // Available products first for the relevance-style sorts; explicit price/alphabet/date
  // sorts stay strict. Sold-out products are kept, just listed after the available ones.
  const sort = query.sort ?? "featured";
  const inStockFirst = sort === "featured" || sort === "bestSelling";
  const ordered = inStockFirst
    ? [...collection.products.filter((product) => product.availableForSale), ...collection.products.filter((product) => !product.availableForSale)]
    : collection.products;
  const pageCount = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  const page = Math.min(parsePage(query.page), pageCount);
  const visibleProducts = ordered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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

        <CollectionSubnav entries={navEntries} href={`/collections/${handle}`} allLabel={t("subnavAll")} label={t("subnavLabel")} />

        <CollectionBrowser
          products={visibleProducts}
          filters={raw.products.filters ?? []}
          activeFilters={filters}
          sort={sort}
          totalCount={totalProductCount}
          page={page}
          pageCount={pageCount}
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
                {t("aboutFallback", { title: categoryLabel, count: totalProductCount })}
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
