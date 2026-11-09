/**
 * Products shown in the "Discover Sri Lanka" section of /collections. Membership is evidence-based and was
 * audited against live Shopify data (catalog-plan/exec/catalog-live.json). A product only qualifies when its own
 * catalog data states a Sri Lankan origin; cuisine-usage wording ("used in Sri Lankan cooking") does not count.
 *
 * evidence:
 *   origin      - product metafield custom.origin = "Sri Lanka"
 *   description - the product title or description states the item itself is from Sri Lanka
 *   collection  - member of the Sri Lanka-specific collection "Kumaio - Bio Produkte aus Sri lanka"
 *
 * Order is display priority; the section shows the first available items and skips anything sold out or missing.
 */
export const sriLankaProducts = [
  { handle: "zesta-premium-bopf-190g", evidence: "description" },
  { handle: "maliban-ginger-cookies-160g", evidence: "description" },
  { handle: "maliban-cream-cracker-190g", evidence: "description" },
  { handle: "annam-katta-sambol-320g", evidence: "description" },
  { handle: "kumaio-bio-kokos-milch-400g", evidence: "origin" },
  { handle: "kumaio-bio-kokosol-500ml", evidence: "origin" },
  { handle: "kumaio-bio-kokoschips-mango-110", evidence: "origin" },
  { handle: "kumaio-bio-chai-sirup-250ml", evidence: "origin" },
  { handle: "kumaio-bio-kokoschips-mit-passionfrucht-150g", evidence: "origin" },
  { handle: "kumaio-bio-kokos-aminos-traditional-250ml", evidence: "origin" },
  { handle: "kumaio-bio-kokos-essig-250ml", evidence: "origin" },
  { handle: "kumaio-kokoschips-mit-zimt-150g", evidence: "description" },
] as const;

export const sriLankaShowcaseSize = 8;

/**
 * Category shortcuts for the /collections Sri Lanka section. A shortcut is only shown while the live Sri Lankan collection
 * contains at least one product that is also in that sub-collection (see lib/catalog/sri-lanka-collection.ts).
 */
export const sriLankaShortcuts = [
  { handle: "tea", labelKey: "tea" },
  { handle: "kekse-geback-und-zwieback", labelKey: "biscuits" },
  { handle: "kokoschips", labelKey: "coconut" },
  { handle: "saucen-speiseole-ghee", labelKey: "coconutProducts" },
  { handle: "pickles-chutney-sambol", labelKey: "sambol" },
  { handle: "suesses-marmelade", labelKey: "jam" },
  { handle: "sauce", labelKey: "sauces" },
] as const;

/** The only Sri Lanka-specific Shopify collection today (Kumaio, all products sourced from Sri Lanka). */
export const sriLankaCollectionHandle = "kumaio-bio-produkte-aus-sri-lanka";

/**
 * The full Sri Lankan assortment: every product whose Sri Lankan origin is verified (country of origin field, origin
 * metafield, or a description that states the item's own origin) carries the tag `origin:sri-lanka`, which drives this
 * automated Shopify collection. The curated list above stays the homepage "Sri Lankan Favourites" selection.
 */
export const sriLankaAllHandle = "sri-lankische-produkte";
