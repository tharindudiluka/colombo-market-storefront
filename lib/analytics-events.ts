import { getConsentSnapshot, parseConsent } from "@/lib/consent";
import type { UiCart, UiCartLine } from "@/lib/shopify/mappers";

// GA4 ecommerce events for the storefront. Sends only when the visitor has granted
// analytics consent, using the same gate as the page_view bridge in lib/analytics.ts.
// `purchase` and `begin_checkout` are intentionally NOT sent from here: checkout runs
// on checkout.colombomarket.de and is tracked by Shopify's pixel (one source per event).

export const ANALYTICS_READY_EVENT = "colombo:analytics-ready";

// Item IDs follow the Google & YouTube / Merchant Center shape `shopify_<country>_<productId>_<variantId>`
// so storefront events line up with the Shopify pixel. Confirm the shape in Merchant Center
// and change it here only.
const ITEM_ID_PREFIX = "shopify_DE";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

type EventParams = Record<string, unknown>;

const MAX_PENDING = 10;
let pending: { name: string; params: EventParams }[] = [];
let listening = false;

function numericId(gid: string) {
  return gid.split("/").pop()?.split("?")[0] ?? gid;
}

export function analyticsItemId(productGid: string, variantGid: string) {
  return `${ITEM_ID_PREFIX}_${numericId(productGid)}_${numericId(variantGid)}`;
}

function round(amount: number) {
  return Math.round(amount * 100) / 100;
}

function variantName(title: string | null | undefined) {
  return title && title !== "Default Title" ? title : undefined;
}

export function cartLineItem(line: UiCartLine, quantity = line.quantity): AnalyticsItem {
  return {
    item_id: analyticsItemId(line.productId, line.variantId),
    item_name: line.title,
    ...(line.vendor ? { item_brand: line.vendor } : {}),
    ...(variantName(line.variantTitle) ? { item_variant: line.variantTitle as string } : {}),
    price: line.price.amount,
    quantity,
  };
}

// A saved "analytics allowed" choice that ConsentManager has not applied to the bridge yet
// (it restores it after hydration, later than a product page mounts).
function savedConsentGrantsAnalytics() {
  return parseConsent(getConsentSnapshot())?.analytics === true;
}

function ready() {
  return Boolean(window.colomboAnalyticsConsent?.granted && window.colomboGaConfigured && window.gtag);
}

function flush() {
  const queued = pending;
  pending = [];
  if (!ready()) return; // consent withdrawn or GA unavailable: drop silently
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  for (const { name, params } of queued) window.gtag?.("event", name, { ...params, send_to: measurementId });
}

export function trackEvent(name: string, params: EventParams) {
  try {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (typeof window === "undefined" || !measurementId) return;
    // Never queue for a visitor who has not allowed analytics: nothing is sent retroactively.
    if (!window.colomboAnalyticsConsent?.granted && !savedConsentGrantsAnalytics()) return;
    if (ready()) {
      window.gtag?.("event", name, { ...params, send_to: measurementId });
      return;
    }
    // Consent is granted (or saved as granted) but the GA script has not finished loading yet
    // (e.g. product page view on first load): hold a few events and send them once the tag is ready.
    if (pending.length < MAX_PENDING) pending.push({ name, params });
    if (!listening) {
      listening = true;
      window.addEventListener(ANALYTICS_READY_EVENT, flush);
    }
  } catch {
    // Analytics must never break browsing or the cart.
  }
}

export function trackViewItem(item: AnalyticsItem, currency: string) {
  trackEvent("view_item", { currency, value: round(item.price * item.quantity), items: [item] });
}

export function trackAddToCart(cart: UiCart, variantId: string, quantity: number) {
  const line = cart.lines.find((entry) => entry.variantId === variantId);
  if (!line) return;
  trackEvent("add_to_cart", {
    currency: line.price.currencyCode,
    value: round(line.price.amount * quantity),
    items: [cartLineItem(line, quantity)],
  });
}

export function trackViewCart(cart: UiCart | null) {
  if (!cart || cart.lines.length === 0) return;
  trackEvent("view_cart", {
    currency: cart.total.currencyCode,
    value: round(cart.subtotal.amount),
    items: cart.lines.map((line) => cartLineItem(line)),
  });
}

export function variantTitleForItem(title: string | null | undefined) {
  return variantName(title);
}
