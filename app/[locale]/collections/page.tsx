import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBrowser, type BrowserCategory } from "@/components/collections/CategoryBrowser";
import { SriLankaDiscover } from "@/components/collections/SriLankaDiscover";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { categoryImages } from "@/config/category-images";
import { getCategoryDirectory } from "@/lib/catalog/categories-page";
import { getSriLankaCollection } from "@/lib/catalog/sri-lanka-collection";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import type { LanguageCode } from "@/lib/shopify/types";
import { canonicalMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categoriesPage.meta" });
  return {
    ...canonicalMetadata(locale, "/collections"),
    title: t("title"),
    description: t("description"),
  };
}

export default async function CollectionsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale.toUpperCase() as LanguageCode;
  const t = await getTranslations("categoriesPage");
  const tc = await getTranslations("collection");
  const entries = await getNavigationEntries(language);
  // Two batched Storefront requests: the department directory (menu-driven, counts and photos included) and the
  // live Sri Lankan collection. Both reuse the existing cache tags.
  const [directory, sriLanka] = await Promise.all([getCategoryDirectory(entries, language), getSriLankaCollection(language)]);

  const categories: BrowserCategory[] = directory.map((category) => ({
    id: category.id,
    handle: category.handle,
    title: category.title,
    description: t.has(`descriptions.${category.handle}`) ? t(`descriptions.${category.handle}`) : null,
    countLabel: category.productCount !== null ? tc("productCount", { count: category.productCount }) : null,
    viewAllLabel: t("viewAll", { category: category.title }),
    subLabel: t("subLabel", { category: category.title }),
    image: categoryImages[category.handle] ?? null,
    packshot: category.images[0]?.url ?? null,
    subs: category.subs,
  }));

  return (
    <div className="collections-page flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-10">
        <Breadcrumbs currentPath="/collections" items={[{ label: tc("allTitle") }]} />

        <div className="pt-3 sm:pt-4" />
        <CategoryBrowser
          heading={
            <>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[28px]">{t("hero.title")}</h1>
              <p className="mt-1 text-sm text-neutral-500 sm:text-[15px]">{t("hero.intro")}</p>
            </>
          }
          categories={categories}
          hasSriLanka={Boolean(sriLanka)}
          text={{
            quickNavLabel: t("quickNavLabel"),
            sriLankaPill: t("sriLankaPill"),
            searchLabel: t("search.label"),
            searchPlaceholder: t("search.placeholder"),
            clear: t("search.clear"),
            noResults: t("search.noResults"),
            resultsLabel: t("search.resultsLabel"),
          }}
        />

        {sriLanka && <SriLankaDiscover data={sriLanka} />}
      </main>
      <Footer />
    </div>
  );
}
