import { site } from "@/config/site";

// These are browsing routes implemented by this storefront, not checkout or
// customer authentication endpoints. Unknown paths on Shopify stay untouched.
const STOREFRONT_PATH = /^\/(?:collections|products|pages|policies|search|contact|wishlist)(?:\/|$)/;
const CHECKOUT_PATH = /^\/(?:cart\/c|checkout|checkouts|account|orders)(?:\/|$)/;

/** Return locale-neutral paths for our locale-aware Link; retain external URLs. */
export function normalizeStorefrontUrl(url: string, primaryDomain?: string): string {
  if (url === "#") return "#";
  try {
    const parsed = new URL(url, "https://shopify.local");
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return url;

    const directHosts = ["shopify.local", site.domain, process.env.SHOPIFY_STORE_DOMAIN];
    const shopHosts = [`checkout.${site.domain}`];
    if (primaryDomain) shopHosts.push(new URL(primaryDomain).hostname);
    const direct = directHosts.includes(parsed.hostname);
    if (!direct && !shopHosts.includes(parsed.hostname)) return url;

    const segments = parsed.pathname.split("/");
    if (site.locale.supported.some(locale => locale === segments[1])) segments.splice(1, 1);
    const pathname = segments.join("/") || "/";

    // Preserve the exact Shopify checkout handoff, including locale and tokens.
    if (CHECKOUT_PATH.test(pathname)) return url;
    if (pathname === "/" && url.endsWith("#")) return "#";
    if (!direct && pathname !== "/" && pathname !== "/cart" && !STOREFRONT_PATH.test(pathname)) return url;

    return `${pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "#";
  }
}
