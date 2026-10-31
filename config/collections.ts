/**
 * Semantic key -> real Shopify collection handle. No handle is ever hardcoded inside a
 * GraphQL query or component — queries take the handle as a parameter sourced from here,
 * so repointing a home page section to a different collection is a one-line edit.
 *
 * Handles below are inferred from the live theme (templates/index.json, category circle
 * grid) and should be confirmed against the actual Shopify Admin collection list before
 * Phase 2/3 wiring goes live — a typo here fails loudly (collection(handle) returns null)
 * rather than silently, so mismatches surface immediately in the healthcheck.
 */
export const collectionHandles = {
  weeklySpecials: "angebote",
  bestsellers: "bestseller",
  freshVegetables: "frisches-gemuse",
  pantryPicks: "reis-und-mehl",
} as const;

export const promoCollectionHandles = {
  // The dedicated Daily Delight collection is empty in Shopify; frozen-food holds the same frozen
  // Daily Delight products. Point back to it once the dedicated collection is populated.
  dailyDelight: "frozen-food",
  kumaio: "kumaio-bio-produkte-aus-sri-lanka",
} as const;

/** Stable high-level footer destinations; does not replicate the main menu. */
export const footerCollectionHandles = {
  rice: "reis",
  pulses: "linsen-und-bohnen",
  spices: "gewuerze",
  frozen: "frozen-food",
  offers: collectionHandles.weeklySpecials,
} as const;

// Homepage category selection: the same seven shopping categories (plus Offers) as the main menu.
// Titles and translations come from Shopify.
export const categoryHandles: readonly { handle: string; labelKey: string }[] = [
  { handle: "reis", labelKey: "rice" },
  { handle: "linsen-und-bohnen", labelKey: "pulses" },
  { handle: "mehl-asiatische-fladenbrote", labelKey: "bread" },
  { handle: "gewuerze", labelKey: "spices" },
  { handle: "saucen-kochzutaten", labelKey: "sauces" },
  { handle: "snacks-suesses", labelKey: "snacks" },
  { handle: "frozen-food", labelKey: "frozen" },
  { handle: "angebote", labelKey: "offers" },
];
