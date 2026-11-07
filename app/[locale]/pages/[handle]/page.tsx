import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PolicyLayout } from "@/components/PolicyLayout";
import { shopifyFetch } from "@/lib/shopify/client";
import { pageByHandleQuery } from "@/lib/shopify/queries/page-by-handle";
import type { LanguageCode, PageByHandleResult, ShopifyPage } from "@/lib/shopify/types";
import { canonicalMetadata } from "@/lib/seo";
import { pageHref } from "@/config/pages";

async function getPage(handle: string, language: LanguageCode): Promise<ShopifyPage | null> {
  try {
    const data = await shopifyFetch<PageByHandleResult>({
      query: pageByHandleQuery,
      variables: { handle, language },
      tags: ["page", handle],
    });
    return data.page;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const page = await getPage(handle, locale.toUpperCase() as LanguageCode);
  return {
    ...(page ? canonicalMetadata(locale, pageHref(page.handle)) : {}),
    title: page?.seo.title ?? page?.title ?? handle,
    description: page?.seo.description ?? page?.bodySummary,
  };
}

export default async function ShopifyPageRoute({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const page = await getPage(handle, locale.toUpperCase() as LanguageCode);
  if (!page) notFound();
  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath={pageHref(page.handle)} items={[{ label: page.title }]} />
        <PolicyLayout title={page.title} html={page.bodyHtml} />
      </main>
      <Footer />
    </div>
  );
}
