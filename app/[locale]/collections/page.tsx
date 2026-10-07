import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CollectionDiscovery } from "@/components/CollectionDiscovery";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import type { LanguageCode } from "@/lib/shopify/types";
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
  const entries = await getNavigationEntries(language);
  const t = await getTranslations("collection");

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath="/collections" items={[{ label: t("allTitle") }]} />
        <CollectionDiscovery entries={entries} />
      </main>
      <Footer />
    </div>
  );
}
