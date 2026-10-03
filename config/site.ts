/**
 * Business facts, not translated prose. Components (Footer, AnnouncementBar, VisitStore)
 * read these instead of hardcoding copy — keeps facts (address, delivery threshold) from
 * drifting out of sync with reality, and out of messages/*.json where they'd have to be
 * duplicated per locale.
 */
export const site = {
  name: "Colombo Market",
  wordmark: "COLOMBO MARKET",
  // Store logo, pulled from the Shopify theme (config/settings_data.json →
  // shopify://shop_images/Untitled_design_3.png) and vendored into public/.
  logo: "/colombo-market-logo.png",
  // Original storefront photo used by the Shopify homepage image-with-text section.
  storefrontImage: {
    src: "https://cdn.shopify.com/s/files/1/0980/0404/2075/files/Banner.jpg?v=1783785135",
    width: 5946,
    height: 3418,
  },
  domain: "colombomarket.de",
  // Full origin, used server-side to build OAuth redirect/logout URIs for the Shopify
  // Customer Account API. Override per-environment via SITE_URL (staging vs. prod).
  url: process.env.SITE_URL ?? "http://localhost:3000",
  address: {
    street: "Herrenstraße 30",
    postalCode: "88212",
    city: "Ravensburg",
    country: "Germany",
    mapsUrl:
      "https://www.google.com/maps/place//data=!4m2!3m1!1s0x479baf9ce6fb37e5:0x3499ac08ecb1dfa?sa=X&ved=1t:8290&ictx=111",
  },
  social: {
    instagram: "https://instagram.com/colombo_market",
    // facebook: add real handle here once confirmed
  },
  delivery: {
    freeDeliveryThreshold: 59.99,
  },
  currency: "EUR",
  locale: {
    default: "de",
    supported: ["de", "en"] as const,
  },
} as const;

export type Site = typeof site;
