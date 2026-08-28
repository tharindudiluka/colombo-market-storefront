import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { Footer } from "@/components/Footer";
import { HelpButton } from "@/components/HelpButton";
import { shopifyFetch } from "@/lib/shopify/client";
import { collectionByHandleQuery } from "@/lib/shopify/queries/collection-by-handle";
import { toUiCollectionDetail } from "@/lib/shopify/mappers";
import type { CollectionByHandleResult, LanguageCode } from "@/lib/shopify/types";

async function getCollection(handle: string, language: LanguageCode) {
  const data = await shopifyFetch<CollectionByHandleResult>({
    query: collectionByHandleQuery,
    variables: { handle, first: 48, language },
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
    title: collection.seo.title || `${collection.title} — Colombo Market`,
    description: collection.seo.description || undefined,
    openGraph: collection.image ? { images: [collection.image.url] } : undefined,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LanguageCode;

  const raw = await getCollection(handle, language);
  if (!raw) notFound();

  const collection = toUiCollectionDetail(raw);
  const t = await getTranslations("collection");
  const tNav = await getTranslations("nav");
  const categoryLabel = collection.title || tNav(handle);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />

      <main className="flex-1">
        <Breadcrumbs items={[{ label: categoryLabel }]} />

        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-2 pt-3">
          <h1 className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
            {categoryLabel}
          </h1>
        </div>

        <CollectionBrowser products={collection.products} />

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
      <HelpButton />
    </div>
  );
}
