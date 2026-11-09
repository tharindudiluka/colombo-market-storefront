import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { FaqAccordion } from "@/components/FaqAccordion";
import { VisitStore } from "@/components/VisitStore";
import { Footer } from "@/components/Footer";
import { HomeSlider } from "@/components/home/HomeSlider";
import { HomeCategoryShortcuts } from "@/components/home/HomeCategoryShortcuts";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeRows } from "@/components/home/HomeRows";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeFamilies } from "@/components/home/HomeFamilies";
import { HomeCategoryLinks } from "@/components/home/HomeCategoryLinks";
import { getCategoryDirectory, getSriLankaProducts } from "@/lib/catalog/categories-page";
import { getAvailableFamilies } from "@/lib/catalog/home";
import { getHomeRows } from "@/lib/catalog/home-rows";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import type { LanguageCode } from "@/lib/shopify/types";
import { homeRowMaxProducts } from "@/config/home-rows";
import { canonicalMetadata, storefrontOrigin, storefrontUrl } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { site } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const title = t("title");
  const description = t("description");
  const image = {
    url: new URL(site.logo, storefrontOrigin).href,
    width: 1024,
    height: 1024,
    alt: site.name,
  };

  return {
    ...canonicalMetadata(locale, "/"),
    title: { absolute: title },
    description,
    openGraph: {
      type: "website",
      url: storefrontUrl(locale, "/"),
      siteName: site.name,
      locale: locale === "en" ? "en_GB" : "de_DE",
      alternateLocale: locale === "en" ? "de_DE" : "en_GB",
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale.toUpperCase() as LanguageCode;
  const t = await getTranslations("homePage");
  const entries = await getNavigationEntries(language);

  // Four batched Storefront requests (directory, Sri Lankan products, collection rows, product families); the rows
  // request shares the Sri Lankan product promise instead of fetching it twice.
  const sriLankaProducts = getSriLankaProducts(language, homeRowMaxProducts);
  const [categories, rows, families] = await Promise.all([
    getCategoryDirectory(entries, language),
    getHomeRows(language, sriLankaProducts),
    getAvailableFamilies(language),
  ]);

  return (
    <div className="homepage flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 pb-4">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-4 sm:pt-5">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[28px]">{t("h1")}</h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-[15px]">{t("h1Support")}</p>
          </div>
          <HomeSlider />
        </div>
        <HomeCategoryShortcuts categories={categories} />
        <HomeTrustStrip />
        <HomeRows rows={rows} from={0} to={rows.length} />
        <HomeFamilies families={families} />
        <HomeIntro />
        <FaqAccordion />
        <VisitStore />
        <HomeCategoryLinks categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
