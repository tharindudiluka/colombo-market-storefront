/**
 * High-intent product groups linked from the homepage. Every handle is an existing Shopify collection; a group is only
 * rendered while its collection has at least one available product (checked at request time), so nothing empty is promoted.
 * Labels are message keys (homePage.families.items.*) so authentic product terms stay consistent in DE and EN.
 */
export const homeFamilies = [
  { handle: "basmati-reis", labelKey: "basmati" },
  { handle: "ponni-reis", labelKey: "ponni" },
  { handle: "sona-masoori-reis", labelKey: "sonaMasoori" },
  { handle: "rote-linsen", labelKey: "masoor" },
  { handle: "urad-dal", labelKey: "urad" },
  { handle: "toor-dal", labelKey: "toor" },
  { handle: "currypulver", labelKey: "curryPowder" },
  { handle: "tea", labelKey: "tea" },
  { handle: "tiefkuhlprodukte", labelKey: "roti" },
  { handle: "snacks", labelKey: "snacks" },
  { handle: "kokoschips", labelKey: "coconutChips" },
] as const;
