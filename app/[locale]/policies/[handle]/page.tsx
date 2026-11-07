import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PolicyLayout } from "@/components/PolicyLayout";
import { getShopPolicy, isPolicyHandle, type PolicyHandle } from "@/lib/shopify/policies";
import { getTranslations } from "next-intl/server";
import type { LanguageCode } from "@/lib/shopify/types";
import { canonicalMetadata } from "@/lib/seo";
import { policyHref } from "@/config/pages";
import { delivery, formatEuro } from "@/config/delivery";

async function loadPolicy(handle: string, locale: string) {
  if (!isPolicyHandle(handle)) return null;
  try {
    return await getShopPolicy(handle, locale.toUpperCase() as LanguageCode);
  } catch {
    return null;
  }
}

/** Shopify serves policy titles in the shop language only; the storefront shows them in the visitor's language. */
async function localizedTitle(handle: string, fallback: string) {
  if (!isPolicyHandle(handle)) return fallback;
  const t = await getTranslations("policyPages.titles");
  return t(handle as PolicyHandle);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const policy = await loadPolicy(handle, locale);
  return { ...(policy ? canonicalMetadata(locale, policyHref(handle)) : {}), title: policy ? await localizedTitle(handle, policy.title) : "Policy" };
}

/**
 * The shipping policy in Shopify still states an old free-shipping threshold (59,99 EUR), and the API has no write access
 * to shop policies. Until the text is corrected in Shopify admin (Settings > Policies), show the configured threshold
 * (config/site.ts) so the page matches the rest of the storefront. Only exact old amounts are replaced.
 */
function withCurrentThreshold(handle: string, html: string, locale: string) {
  if (handle !== "shipping-policy") return html;
  return html.replace(/59[,.]99\s?€|€\s?59[,.]99/g, formatEuro(delivery.freeShippingThreshold, locale));
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const policy = await loadPolicy(handle, locale);
  if (!policy) notFound();

  const title = await localizedTitle(handle, policy.title);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath={policyHref(handle)} items={[{ label: title }]} />
        <PolicyLayout title={title} html={withCurrentThreshold(handle, policy.body, locale)} />
      </main>
      <Footer />
    </div>
  );
}
