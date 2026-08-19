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
  freshVegetables: "frisches-gemuse",
  pantryPicks: "reis-und-mehl",
} as const;

export const categoryHandles: readonly { handle: string; labelKey: string }[] = [
  { handle: "angebote", labelKey: "angebote" },
  { handle: "gewurze", labelKey: "gewurze" },
  { handle: "reis-und-mehl", labelKey: "reisUndMehl" },
  { handle: "frisches-gemuse", labelKey: "frischesGemuse" },
  { handle: "linsen-und-bohnen", labelKey: "linsenUndBohnen" },
  { handle: "tee-und-kekse", labelKey: "teeUndKekse" },
  { handle: "ayurvedische-produkte", labelKey: "ayurvedischeProdukte" },
  { handle: "gefrorenes-fleisch-und-fisch", labelKey: "gefrorenesFleischUndFisch" },
  { handle: "tiefkuhlprodukte", labelKey: "tiefkuhlprodukte" },
  { handle: "mehl-produkte", labelKey: "mehlProdukte" },
  { handle: "pickles-und-chutneys", labelKey: "picklesUndChutneys" },
  { handle: "snacks", labelKey: "snacks" },
  { handle: "bio-produkte", labelKey: "bioProdukte" },
];
