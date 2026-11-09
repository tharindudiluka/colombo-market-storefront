import type { Metadata } from "next";
import { site } from "@/config/site";
import { getPathname } from "@/i18n/navigation";

// Public SEO identity is independent of staging/OAuth SITE_URL and Shopify checkout.
export const storefrontOrigin = `https://${site.domain}`;

export function storefrontUrl(locale: string, pathname: string): string {
  return new URL(getPathname({ locale: locale === "en" ? "en" : "de", href: pathname }), storefrontOrigin).href;
}

/** Canonical URL plus the DE/EN hreflang pair (and x-default = German) for a page that exists in both languages. */
export function canonicalMetadata(locale: string, pathname: string): Metadata {
  return {
    alternates: {
      canonical: storefrontUrl(locale, pathname),
      languages: { de: storefrontUrl("de", pathname), en: storefrontUrl("en", pathname), "x-default": storefrontUrl("de", pathname) },
    },
  };
}

/** "<page> | Colombo Market" — the one title pattern used on every page that does not carry its own SEO title. */
export function brandedTitle(title: string): string {
  return `${title} | ${site.name}`;
}

const ENGLISH_HINT = /\b(the|and|for|with|online in germany|buy|shop|order|delivery|stocks?)\b/gi;
const GERMAN_HINT = /\b(und|für|mit|bei|der|die|das|kaufen|bestellen|online bestellen|Lieferung|Abholung|Versand)\b/gi;

/** True when a text reads as English and not German (used to avoid serving an English meta description on German pages). */
function looksEnglish(text: string): boolean {
  return (text.match(ENGLISH_HINT)?.length ?? 0) > (text.match(GERMAN_HINT)?.length ?? 0);
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** First ~155 characters of an HTML body at a word boundary, for use as a meta description. */
export function summarize(html: string, max = 155): string {
  const text = plainText(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 0) || max).replace(/[,;:–-]+$/, "")}…`;
}

/**
 * Meta description for a Shopify-backed page. The merchant's SEO description wins, except when it is clearly in the wrong
 * language for the page (Shopify currently holds one English value for German pages): then the localized body text is used.
 */
export function pickMetaDescription(locale: string, seoDescription: string | null | undefined, bodyHtml: string | null | undefined): string | undefined {
  const seo = seoDescription?.trim();
  if (seo && !(locale !== "en" && looksEnglish(seo))) return seo;
  const body = bodyHtml ? summarize(bodyHtml) : "";
  return body || seo || undefined;
}
