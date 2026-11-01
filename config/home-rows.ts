/**
 * Product rows on the homepage, in display order. `handle` is an existing Shopify collection (never hardcoded in a
 * query); `sriLanka` is the verified Sri Lankan list from config/sri-lanka.ts. A row is only rendered when it has at
 * least `minProducts` available products, so thin or empty collections never appear. Titles: homePage.rows.titles.<key>.
 */
export const homeRows = [
  { key: "bestsellers", handle: "bestseller" },
  { key: "sriLanka", handle: null },
  { key: "rice", handle: "reis" },
  { key: "dal", handle: "linsen-und-bohnen" },
  { key: "spices", handle: "gewuerze" },
  { key: "snacks", handle: "snacks-suesses" },
  { key: "frozen", handle: "frozen-food" },
  { key: "offers", handle: "angebote" },
] as const;

export type HomeRowKey = (typeof homeRows)[number]["key"];

export const homeRowMinProducts = 4;
export const homeRowMaxProducts = 12;
