import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { shopifyFetch } from "@/lib/shopify/client";
import { pageByHandleQuery } from "@/lib/shopify/queries/page-by-handle";
import type { LanguageCode, PageByHandleResult, ShopifyPage } from "@/lib/shopify/types";

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
      <NavMenu />
      <main className="flex-1">
        <Breadcrumbs items={[{ label: page.title }]} />
        <article className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 sm:py-14">
          <h1 className="font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">
            {page.title}
          </h1>
          <div
            className="prose prose-sm mt-8 max-w-3xl text-brand-teal-dark/80 sm:prose-base"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
