import type { IconName } from "@/components/Icon";

/**
 * Presentation only: handles identify real configured Shopify collections. Labels
 * remain Shopify titles (localized by the query), with message fallbacks in the UI.
 */
export const categoryIcons: Record<string, IconName> = {
  angebote: "tag",
  gewurze: "spice",
  "reis-und-mehl": "rice",
  "frisches-gemuse": "leaf",
  "linsen-und-bohnen": "dal",
  "tee-und-kekse": "tea",
  "ayurvedische-produkte": "leaf",
  "gefrorenes-fleisch-und-fisch": "fish",
  tiefkuhlprodukte: "snowflake",
  "mehl-produkte": "grain",
  "pickles-und-chutneys": "jar",
  snacks: "snack",
  "bio-produkte": "leaf",
};

export const categoryTones: Record<string, string> = {
  angebote: "bg-category-turmeric text-brand-terracotta",
  gewurze: "bg-category-terracotta text-brand-terracotta",
  "reis-und-mehl": "bg-category-peach text-brand-teal-dark",
  "frisches-gemuse": "bg-category-sage text-brand-teal-dark",
  "linsen-und-bohnen": "bg-category-turmeric text-brand-terracotta",
  "tee-und-kekse": "bg-category-peach text-brand-terracotta",
  "ayurvedische-produkte": "bg-category-green text-brand-teal-dark",
  "gefrorenes-fleisch-und-fisch": "bg-category-teal text-brand-teal-dark",
  tiefkuhlprodukte: "bg-category-teal text-brand-teal-dark",
  "mehl-produkte": "bg-category-peach text-brand-terracotta",
  "pickles-und-chutneys": "bg-category-terracotta text-brand-terracotta",
  snacks: "bg-category-peach text-brand-terracotta",
  "bio-produkte": "bg-category-sage text-brand-teal-dark",
};
