import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PromoTiles } from "@/components/PromoTiles";
import { ProductRow } from "@/components/ProductRow";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BrandStrip } from "@/components/BrandStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SeoContent } from "@/components/SeoContent";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionProductsQuery } from "@/lib/shopify/queries/collection-products";
import { buildHomeCollectionsQuery } from "@/lib/shopify/queries/collections";
import { toUiCategory, toUiProduct } from "@/lib/shopify/mappers";
import type { CollectionProductsResult, LanguageCode, ShopifyCollection } from "@/lib/shopify/types";
import { categoryHandles, collectionHandles } from "@/config/collections";

async function getCollectionProducts(handle: string, language: LanguageCode, first = 6) {
  const data = await shopifyFetch<CollectionProductsResult>({
    query: collectionProductsQuery,
    variables: { handle, first, language },
    tags: ["collection", handle],
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
  const t = await getTranslations("productRow");

  const [weeklySpecials, freshVegetables, pantryPicks, categories] = await Promise.all([
    getCollectionProducts(collectionHandles.weeklySpecials, language),
    getCollectionProducts(collectionHandles.freshVegetables, language),
    getCollectionProducts(collectionHandles.pantryPicks, language),
    getHomeCategories(language),
  ]);

  return (
    <div className="homepage flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />

      <main className="flex-1">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[3fr_2fr] md:items-start">
            <HeroCarousel />
            <PromoTiles />
          </div>
        </div>

        <ProductRow
          title={t("weeklySpecials.title")}
          subtitle={t("weeklySpecials.subtitle")}
          products={weeklySpecials}
        />

        <CategoryGrid categories={categories} />

        <ProductRow
          title={t("freshVegetables.title")}
          subtitle={t("freshVegetables.subtitle")}
          products={freshVegetables}
        />

        <BrandStrip />

        <ProductRow
          title={t("pantryPicks.title")}
          subtitle={t("pantryPicks.subtitle")}
          products={pantryPicks}
        />

        <FaqAccordion />
        <SeoContent />
      </main>

      <Footer />
    </div>
  );
}
