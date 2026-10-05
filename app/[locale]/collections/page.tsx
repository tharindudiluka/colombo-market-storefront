import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionsIndexQuery } from "@/lib/shopify/queries/collections-index";
import { toUiCategory } from "@/lib/shopify/mappers";
import type { CollectionsIndexResult, LanguageCode } from "@/lib/shopify/types";
import { canonicalMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "collection" });
  return { ...canonicalMetadata(locale, "/collections"), title: `${t("allTitle")} — Colombo Market` };
}

export default async function CollectionsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = locale.toUpperCase() as LanguageCode;
  const data = await shopifyFetch<CollectionsIndexResult>({
    query: collectionsIndexQuery,
    variables: { first: 100, language },
    tags: ["collection"],
  });
  const categories = data.collections.nodes.map(toUiCategory);
  const t = await getTranslations("collection");

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath="/collections" items={[{ label: t("allTitle") }]} />
        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-3">
          <h1 className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
            {t("allTitle")}
          </h1>
        </div>
        <CategoryGrid categories={categories} variant="catalog" />
      </main>
      <Footer />
    </div>
  );
}
