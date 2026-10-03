import { categoryHandles } from "@/config/collections";
import type { HomepageCategoryIconName } from "@/components/HomepageCategoryIcon";

const icons: Record<string, HomepageCategoryIconName> = {
  rice: "rice", bread: "bread", pulses: "dal", spices: "mortar",
  cooking: "ghee", pickles: "jar", frozen: "snowflake", vegetables: "vegetables",
  sweets: "candy", tea: "tea", organic: "leaf", glutenFree: "wheatFree",
};
const tones = [
  "bg-category-sage text-brand-teal-dark",
  "bg-category-peach text-brand-terracotta",
  "bg-category-turmeric text-brand-teal-dark",
  "bg-category-terracotta text-brand-terracotta",
  "bg-category-green text-brand-teal-dark",
  "bg-category-teal text-brand-teal-dark",
];

// Homepage only: collection handles stay in config; Shopify owns localized titles.
export const homepageCategoryPresentation: Record<string, { icon: HomepageCategoryIconName; tone: string }> = Object.fromEntries(
  categoryHandles.map(({ handle, labelKey }, index) => [handle, { icon: icons[labelKey], tone: tones[index % tones.length] }]),
);
