import type { HomepageCategoryIconName } from "@/components/HomepageCategoryIcon";

type CategoryPresentation = { icon: HomepageCategoryIconName; tone: string };

// Explicit, audited Shopify handles. No translated-title inference or layout data.
const families: { handles: string[]; icon: HomepageCategoryIconName; tone: string }[] = [
  { handles: ["angebote", "bestseller"], icon: "tag", tone: "bg-category-turmeric text-brand-terracotta" },
  { handles: ["reis", "basmati-reis", "sona-masoori-reis", "jasminreis", "red-raw-rice", "red-par-boiled-rice", "ponni-reis", "puffreis-mamra", "reisflocken-rice-flakes"], icon: "rice", tone: "bg-category-turmeric text-brand-teal-dark" },
  { handles: ["mehl-asiatische-fladenbrote", "andere-mehl", "reismehl", "weizenmehl"], icon: "bread", tone: "bg-category-peach text-brand-teal-dark" },
  { handles: ["linsen-und-bohnen", "linsen", "bohnen", "kichererbsen", "dal-sorten"], icon: "dal", tone: "bg-category-sage text-brand-teal-dark" },
  { handles: ["gewuerze", "gemahlene-gewuerze", "ganze-gewuerze", "curry-mixtures-currymischungen", "suesse-waermende-gewuerze", "scharfe-gewuerze"], icon: "mortar", tone: "bg-category-terracotta text-brand-terracotta" },
  { handles: ["pickles-wurzmittel", "chutney", "curry-paste", "sauce", "saucen-speiseole-ghee"], icon: "jar", tone: "bg-category-peach text-brand-terracotta" },
  { handles: ["ghee-kochzutaten"], icon: "ghee", tone: "bg-category-peach text-brand-teal-dark" },
  { handles: ["tea", "schwarzer-und-gruner-tee", "tee-kaffee"], icon: "tea", tone: "bg-category-peach text-brand-terracotta" },
  { handles: ["getranke"], icon: "bottle", tone: "bg-category-peach text-brand-teal-dark" },
  { handles: ["snacks"], icon: "snack", tone: "bg-category-turmeric text-brand-terracotta" },
  { handles: ["sweets-sussigkeiten", "sussigkeiten"], icon: "candy", tone: "bg-category-turmeric text-brand-terracotta" },
  { handles: ["kekse-geback-und-zwieback"], icon: "cookie", tone: "bg-category-turmeric text-brand-terracotta" },
  { handles: ["frozen-food", "tiefkuhl-snacks", "daily-delight-tiefkuhlprodukte"], icon: "snowflake", tone: "bg-category-teal text-brand-teal-dark" },
  { handles: ["gefrorenes-fleisch-und-fisch"], icon: "fish", tone: "bg-category-teal text-brand-teal-dark" },
  { handles: ["frozen-yam-vegetables"], icon: "vegetables", tone: "bg-category-teal text-brand-teal-dark" },
  { handles: ["tiefkuhlprodukte"], icon: "bread", tone: "bg-category-teal text-brand-teal-dark" },
  { handles: ["frisches-gemuse"], icon: "vegetables", tone: "bg-category-sage text-brand-teal-dark" },
  { handles: ["bio-producte", "kumaio-bio-produkte-aus-sri-lanka", "sanchon-bio-produkte"], icon: "leaf", tone: "bg-category-sage text-brand-teal-dark" },
  { handles: ["glutenfrei"], icon: "wheatFree", tone: "bg-category-sage text-brand-teal-dark" },
  { handles: ["ayurvedische-produkte"], icon: "leaf", tone: "bg-category-green text-brand-teal-dark" },
];

export const catalogCategoryPresentation: Partial<Record<string, CategoryPresentation>> = Object.fromEntries(
  families.flatMap(({ handles, icon, tone }) => handles.map(handle => [handle, { icon, tone }])),
);

export const catalogCategoryFallback: CategoryPresentation = {
  icon: "package", tone: "bg-category-peach text-brand-teal-dark",
};
