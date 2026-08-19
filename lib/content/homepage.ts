/**
 * Non-translatable homepage banner metadata (link targets, gradient accents). The
 * translatable copy (eyebrow/title/body/cta, tile title/subtitle) lives in
 * messages/de.json + messages/en.json under "hero.slides" / "promo.tiles" — same order,
 * zipped together by index in HeroCarousel.tsx / PromoTiles.tsx.
 */
export const heroSlideMeta = [
  { id: "welcome", href: "/collections/angebote", accent: "from-[#3d081b] to-[#910f3f]" },
  { id: "spices", href: "/collections/gewurze", accent: "from-[#910f3f] to-[#3d081b]" },
  { id: "angebote", href: "/collections/angebote", accent: "from-[#5a1024] to-[#910f3f]" },
] as const;

export const promoTileMeta = [
  { id: "vegetables", href: "/collections/frisches-gemuse", accent: "bg-[#4d6b2f]" },
  { id: "tea", href: "/collections/tee-und-kekse", accent: "bg-[#3d081b]" },
] as const;
