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
  dailyDelight: "daily-delight-tiefkuhlprodukte",
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

// Homepage category selection. Titles and translations come from Shopify.
export const categoryHandles: readonly { handle: string; labelKey: string }[] = [
  { handle: "reis", labelKey: "rice" },
  { handle: "mehl-asiatische-fladenbrote", labelKey: "bread" },
  { handle: "linsen-und-bohnen", labelKey: "pulses" },
  { handle: "gewuerze", labelKey: "spices" },
  { handle: "ghee-kochzutaten", labelKey: "cooking" },
  { handle: "pickles-wurzmittel", labelKey: "pickles" },
  { handle: "frozen-food", labelKey: "frozen" },
  { handle: "frisches-gemuse", labelKey: "vegetables" },
  { handle: "sweets-sussigkeiten", labelKey: "sweets" },
  { handle: "tee-kaffee", labelKey: "tea" },
  { handle: "bio-producte", labelKey: "organic" },
  { handle: "glutenfrei", labelKey: "glutenFree" },
];
