import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getShopPolicy, isPolicyHandle } from "@/lib/shopify/policies";
import type { LanguageCode } from "@/lib/shopify/types";
import { canonicalMetadata } from "@/lib/seo";
import { policyHref } from "@/config/pages";

async function loadPolicy(handle: string, locale: string) {
  if (!isPolicyHandle(handle)) return null;
  try {
    return await getShopPolicy(handle, locale.toUpperCase() as LanguageCode);
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
  const policy = await loadPolicy(handle, locale);
  return { ...(policy ? canonicalMetadata(locale, policyHref(handle)) : {}), title: policy?.title ?? "Policy" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const policy = await loadPolicy(handle, locale);
  if (!policy) notFound();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-12 sm:pb-16">
        <Breadcrumbs currentPath={policyHref(handle)} items={[{ label: policy.title }]} />
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <h1 className="font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">{policy.title}</h1>
          <div
            className="prose prose-sm mt-8 max-w-none text-brand-teal-dark/80 sm:prose-base prose-headings:text-brand-teal-dark prose-a:text-brand-teal"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
