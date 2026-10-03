/**
 * Non-translatable homepage banner metadata (link targets, gradient accents). The
 * translatable copy (eyebrow/title/body/cta, tile title/subtitle) lives in
 * messages/de.json + messages/en.json under "hero.slides" / "promo.tiles" — same order,
 * zipped together by index in HeroCarousel.tsx / PromoTiles.tsx.
 */
// Garden Frost — green gradient accents (was wine/magenta). Zipped by index
// with hero.slides / promo.tiles copy in messages/*.json.
export const heroSlideMeta = [
  { id: "welcome", href: "/collections/angebote", accent: "from-[#2e5e2b] to-[#4e9a46]" },
  { id: "spices", href: "/collections/gewurze", accent: "from-[#3f7d3a] to-[#1f3f23]" },
  { id: "angebote", href: "/collections/angebote", accent: "from-[#4e9a46] to-[#2e5e2b]" },
] as const;

export const promoTileMeta = [
  { id: "vegetables", href: "/collections/frisches-gemuse", accent: "bg-gradient-to-br from-[#5a8f3a] to-[#2e5e2b]" },
  { id: "tea", href: "/collections/tee-und-kekse", accent: "bg-gradient-to-br from-[#3f7d3a] to-[#173218]" },
] as const;

// Stable Shopify entry identity: artwork updates keep the Kumaio presentation.
export const kumaioBannerId = "gid://shopify/Metaobject/518376653147";
export const dailyDelightBannerId = "gid://shopify/Metaobject/518391628123";
