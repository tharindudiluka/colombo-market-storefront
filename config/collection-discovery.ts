import type { HomepageCategoryIconName } from "@/components/HomepageCategoryIcon";
import type { DiscoveryIconName } from "@/components/CollectionDiscoveryIcon";

// Stable Shopify menu IDs select departments; links and labels remain merchant-managed.
export const discoveryDepartments = [
  { key: "staples", menuId: "808943944027", icon: "rice", grouped: true },
  { key: "spices", menuId: "790848536923", icon: "mortar", parentHandle: "gewuerze" },
  { key: "essentials", menuId: "808944075099", icon: "jar", parentHandle: "essentials" },
  { key: "frozen", menuId: "808944435547", icon: "snowflake", parentHandle: "frozen-food" },
  { key: "snacks", menuId: "808947614043", icon: "snack", parentHandle: "sweets-sussigkeiten" },
  { key: "organic", menuId: "808947745115", icon: "leaf" },
  { key: "offers", menuId: "808947876187", icon: "tag", parentHandle: "angebote" },
] as const satisfies readonly { key: string; menuId: string; icon: HomepageCategoryIconName; grouped?: boolean; parentHandle?: string }[];

// Page-specific additions to the existing food icon family.
export const discoveryIcons: Partial<Record<string, DiscoveryIconName>> = {
  "urad-dal": "dal", "toor-dal": "dal", "moong-dal-mungbohnen": "dal", "rote-linsen": "dal",
  "mehl-asiatische-fladenbrote": "flour", "kichererbsenmehl-besan": "flour", "griess-rawa": "wheat", "dosa-idli-mischungen": "batter", "papadams": "flatbread",
  "reismehl": "flour", "weizenmehl": "wheat", "currypulver": "mortar", "masala": "mortar",
  "pfeffer": "peppercorns", "kardamom": "cardamom", "zimt": "cinnamon", "essentials": "jar", "kokoschips": "coconut",
  "saucen-speiseole-ghee": "coconut", "sauce": "bottle", "tiefkuhlprodukte": "flatbread",
};
