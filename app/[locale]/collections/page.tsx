import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { BotanicalAccents } from "@/components/BotanicalAccents";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryDirectory } from "@/components/CategoryDirectory";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SriLankaShowcase } from "@/components/SriLankaShowcase";
import { getCategoryDirectory, getSriLankaProducts } from "@/lib/catalog/categories-page";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import type { LanguageCode } from "@/lib/shopify/types";
import { canonicalMetadata, storefrontUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categoriesPage.meta" });
  const canonical = canonicalMetadata(locale, "/collections");
  return {
    ...canonical,
    alternates: {
      ...canonical.alternates,
      languages: { de: storefrontUrl("de", "/collections"), en: storefrontUrl("en", "/collections"), "x-default": storefrontUrl("de", "/collections") },
    },
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
  const [categories, sriLankaProducts] = await Promise.all([getCategoryDirectory(entries, language), getSriLankaProducts(language)]);

  const pill = "inline-flex min-h-11 shrink-0 items-center rounded-full border border-brand-teal/25 bg-white px-4 py-2 text-sm font-semibold text-brand-teal-dark transition-colors hover:border-brand-teal hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath="/collections" items={[{ label: tc("allTitle") }]} />

        <div className="relative isolate overflow-hidden">
          <BotanicalAccents variant="hero" />
          <div className="relative z-10 mx-auto max-w-[var(--layout-max-width)] px-4 pb-6 pt-6 sm:pb-8 sm:pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terracotta">{t("hero.eyebrow")}</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl lg:text-5xl">{t("hero.title")}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-brand-teal-dark/75">{t("hero.intro")}</p>
          </div>
        </div>

        <nav aria-label={t("quickNavLabel")} className="border-y border-brand-teal/10 bg-white">
          <ul className="no-scrollbar mx-auto flex max-w-[var(--layout-max-width)] gap-2 overflow-x-auto px-4 py-3 xl:flex-wrap xl:overflow-visible">
            {categories.map((category) => (
              <li key={category.id} className="shrink-0"><a href={`#cat-${category.handle}`} className={pill}>{category.title}</a></li>
            ))}
            {sriLankaProducts.length > 0 && <li className="shrink-0"><a href="#sri-lanka" className={`${pill} border-brand-terracotta/40 text-brand-terracotta`}>{t("sriLankaPill")}</a></li>}
          </ul>
        </nav>

        <CategoryDirectory categories={categories} />
        <SriLankaShowcase products={sriLankaProducts} />
      </main>
      <Footer />
    </div>
  );
}
