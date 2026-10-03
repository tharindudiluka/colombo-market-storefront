import type { IconName } from "@/components/Icon";

export type MobileNavigationIconName = IconName | "mortar" | "candy";

// Shopify main-menu item IDs are shared by DE and EN, including group headings.
// If a merchant deletes and recreates a group, update its ID here.
export const mobileNavigationIcons: Partial<Record<string, MobileNavigationIconName>> = {
  "gid://shopify/MenuItem/808943944027": "rice", // Staple foods
  "gid://shopify/MenuItem/790848536923": "mortar", // Spices
  "gid://shopify/MenuItem/808944075099": "jar", // Essentials
  "gid://shopify/MenuItem/808944435547": "snowflake", // Fresh & frozen
  "gid://shopify/MenuItem/808947614043": "candy", // Snacks & sweets
  "gid://shopify/MenuItem/808947745115": "leaf", // Organic & special
  "gid://shopify/MenuItem/808947876187": "tag", // Offers
  "gid://shopify/MenuItem/808947908955": "store", // About us
};
