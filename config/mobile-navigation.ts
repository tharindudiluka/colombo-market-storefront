import type { HomepageCategoryIconName } from "@/components/HomepageCategoryIcon";

export type MobileNavigationIconName = HomepageCategoryIconName | "riceBowl" | "pulses" | "wheat" | "kumaio";

// Keyed by collection path (stable across menu rebuilds and identical in DE and EN), not by Shopify menu item id.
export const mobileNavigationIcons: Partial<Record<string, MobileNavigationIconName>> = {
  "/collections/reis": "riceBowl",
  "/collections/linsen-und-bohnen": "pulses",
  "/collections/mehl-asiatische-fladenbrote": "wheat",
  "/collections/gewuerze": "mortar",
  "/collections/saucen-kochzutaten": "bottle",
  "/collections/snacks-suesses": "cookie",
  "/collections/frozen-food": "snowflake",
  "/collections/angebote": "tag",
  "/collections/kumaio-bio-produkte-aus-sri-lanka": "kumaio",
};
