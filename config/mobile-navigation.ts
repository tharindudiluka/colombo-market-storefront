import type { IconName } from "@/components/Icon";

export type MobileNavigationIconName = IconName | "mortar" | "candy" | "bread";

// Keyed by collection path (stable across menu rebuilds and identical in DE and EN), not by Shopify menu item id.
export const mobileNavigationIcons: Partial<Record<string, MobileNavigationIconName>> = {
  "/collections/reis": "rice",
  "/collections/linsen-und-bohnen": "dal",
  "/collections/mehl-asiatische-fladenbrote": "bread",
  "/collections/gewuerze": "mortar",
  "/collections/saucen-kochzutaten": "chili",
  "/collections/snacks-suesses": "candy",
  "/collections/frozen-food": "snowflake",
  "/collections/angebote": "tag",
};
