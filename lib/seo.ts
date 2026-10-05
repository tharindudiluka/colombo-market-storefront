import type { Metadata } from "next";
import { site } from "@/config/site";
import { getPathname } from "@/i18n/navigation";

// Public SEO identity is independent of staging/OAuth SITE_URL and Shopify checkout.
export const storefrontOrigin = `https://${site.domain}`;

export function storefrontUrl(locale: string, pathname: string): string {
  return new URL(getPathname({ locale: locale === "en" ? "en" : "de", href: pathname }), storefrontOrigin).href;
}

export function canonicalMetadata(locale: string, pathname: string): Metadata {
  return { alternates: { canonical: storefrontUrl(locale, pathname) } };
}
