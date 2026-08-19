import type { IconName } from "@/components/Icon";

/**
 * Icon fallback per Shopify collection handle, used by CategoryGrid when a collection
 * has no image set. Display labels come from messages/*.json under "nav.<handle>" —
 * translated per locale, not hardcoded here.
 */
export const categoryIcons: Record<string, IconName> = {
  angebote: "spice",
  gewurze: "spice",
  "reis-und-mehl": "grain",
  "frisches-gemuse": "leaf",
  "linsen-und-bohnen": "dal",
  "tee-und-kekse": "tea",
  "ayurvedische-produkte": "leaf",
  "gefrorenes-fleisch-und-fisch": "snack",
  tiefkuhlprodukte: "snack",
  "mehl-produkte": "grain",
  "pickles-und-chutneys": "spice",
  snacks: "snack",
  "bio-produkte": "leaf",
};
