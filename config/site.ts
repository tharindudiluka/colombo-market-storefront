/**
 * Business facts, not translated prose. Components (Footer, AnnouncementBar, SeoContent)
 * read these instead of hardcoding copy — keeps facts (address, delivery threshold) from
 * drifting out of sync with reality, and out of messages/*.json where they'd have to be
 * duplicated per locale.
 */
export const site = {
  name: "Colombo Market",
  wordmark: "COLOMBO MARKET",
  domain: "colombomarket.de",
  address: {
    street: "Herrenstraße 30",
    postalCode: "88212",
    city: "Ravensburg",
    country: "Germany",
  },
  social: {
    instagram: "https://instagram.com/colombo_market",
    // facebook: add real handle here once confirmed
  },
  delivery: {
    freeDeliveryThreshold: 39.99,
  },
  currency: "EUR",
  locale: {
    default: "de",
    supported: ["de", "en"] as const,
  },
} as const;

export type Site = typeof site;
