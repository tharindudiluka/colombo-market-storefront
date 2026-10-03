import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PromoTiles } from "@/components/PromoTiles";
import { BestsellerCarousel } from "@/components/BestsellerCarousel";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BrandStrip } from "@/components/BrandStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { VisitStore } from "@/components/VisitStore";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionProductsQuery } from "@/lib/shopify/queries/collection-products";
import { buildHomeCollectionsQuery } from "@/lib/shopify/queries/collections";
import { toUiCategory, toUiProduct } from "@/lib/shopify/mappers";
import type { CollectionProductsResult, LanguageCode, ShopifyCollection } from "@/lib/shopify/types";
import { categoryHandles, collectionHandles } from "@/config/collections";

async function getCollectionProducts(handle: string, language: LanguageCode, first = 6, includeQuickAdd = false) {
  const data = await shopifyFetch<CollectionProductsResult>({
    query: collectionProductsQuery,
    variables: { handle, first, language, includeQuickAdd },
    tags: ["collection", handle],
    revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
  });
  return (data.collection?.products.edges ?? []).map((edge) => toUiProduct(edge.node));
}

async function getHomeCategories(language: LanguageCode) {
  const data = await shopifyFetch<Record<string, ShopifyCollection | null>>({
    query: buildHomeCollectionsQuery(),
    variables: { language },
    tags: ["collection"],
  });
  return categoryHandles
    .map(({ labelKey }) => data[labelKey])
    .filter((collection): collection is ShopifyCollection => collection !== null)
    .map(toUiCategory);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale.toUpperCase() as LanguageCode;

  const [bestsellers, categories] = await Promise.all([
    getCollectionProducts(collectionHandles.bestsellers, language, 250, true),
    getHomeCategories(language),
  ]);

  return (
    <div className="homepage flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6">
          <div className="hero-grid grid grid-cols-1 gap-3 md:grid-cols-[3fr_2fr] md:items-start">
            <HeroCarousel />
            <PromoTiles />
          </div>
        </div>

        <BestsellerCarousel products={bestsellers} />

        <CategoryGrid categories={categories} />

        <BrandStrip />

        <FaqAccordion />
        <VisitStore />
      </main>

      <Footer />
    </div>
  );
}
