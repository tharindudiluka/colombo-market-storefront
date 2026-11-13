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
import { brandedTitle, canonicalMetadata } from "@/lib/seo";
import { policyHref, shippingAnchors, shippingPolicyFreeShippingPrefixes, shippingPolicyHeadingAnchors } from "@/config/pages";
import type { PolicyHtmlOptions } from "@/lib/policy-content";
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
  return { ...(policy ? canonicalMetadata(locale, policyHref(handle)) : {}), title: policy ? brandedTitle(await localizedTitle(handle, policy.title)) : "Colombo Market" };
}

/**
 * Stable anchors for the homepage delivery cards. The shipping policy is merchant-written in Shopify and its headings
 * differ per language, so the known headings are mapped to fixed ids. The sentence that states the free-shipping
 * threshold gets a "Free shipping" label. If a language's Shopify policy lacks that sentence (the English one does),
 * the same single sentence is added from messages until the policy text is updated in Shopify.
 */
async function shippingPolicyOptions(locale: string): Promise<PolicyHtmlOptions> {
  const t = await getTranslations("policyPages");
  const threshold = delivery.freeShippingThreshold.toFixed(2).replace(".", "[.,]");
  return {
    headingAnchors: shippingPolicyHeadingAnchors,
    headingAnchorPrefixes: shippingPolicyFreeShippingPrefixes,
    splitParagraph: {
      match: new RegExp(threshold),
      heading: t("freeShippingHeading"),
      // If the policy already has its own free-shipping heading, none of this is applied (no doubled heading).
      skipIfAnchor: shippingAnchors.freeShipping,
      // Only used when the Shopify policy for this language does not state the threshold itself.
      fallback: {
        afterSlugs: [shippingAnchors.costs, "versandkosten"],
        bodyHtml: `<p>${t("freeShippingBody", { threshold: formatEuro(delivery.freeShippingThreshold, locale) })}</p>`,
      },
    },
    fallbackAnchor: { id: shippingAnchors.freeShipping, before: shippingAnchors.costs },
  };
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
        <PolicyLayout title={title} html={policy.body} options={handle === "shipping-policy" ? await shippingPolicyOptions(locale) : undefined} />
      </main>
      <Footer />
    </div>
  );
}
