/**
 * Optional purpose-built category images for the homepage category cards (keyed by collection handle).
 *
 * Until an entry exists, the card shows the best available product packshot as temporary content (contained, never
 * cropped). When an entry exists, the image fills the square image area edge to edge, so the component never changes.
 *
 * Recommended asset: square, about 1200 x 1200 px, 2-4 product cutouts arranged cleanly on a plain light background,
 * WebP/JPEG under 150 KB, files placed under public/images/categories/.
 */
export type CategoryImage = { src: string; width: number; height: number; alt: string };

export const categoryImages: Partial<Record<string, CategoryImage>> = {
  // Square collages (1254 x 1254 PNG, white background).
  // NOTE: the source files Rice.png / Lentils.png were named the other way round (Rice.png showed lentils); the files
  // here are named after what they show.
  reis: { src: "/images/categories/rice.png", width: 1254, height: 1254, alt: "Reis" },
  "linsen-und-bohnen": { src: "/images/categories/lentils.png", width: 1254, height: 1254, alt: "Linsen, Bohnen & Dal" },
  "mehl-asiatische-fladenbrote": { src: "/images/categories/flour.png", width: 1254, height: 1254, alt: "Mehl, Grieß & Fladen" },
  gewuerze: { src: "/images/categories/spices.png", width: 1254, height: 1254, alt: "Gewürze" },
  "saucen-kochzutaten": { src: "/images/categories/sauces.png", width: 1254, height: 1254, alt: "Saucen & Kochzutaten" },
  "snacks-suesses": { src: "/images/categories/snacks.png", width: 1254, height: 1254, alt: "Snacks & Süßes" },
  "frozen-food": { src: "/images/categories/frozen.png", width: 1254, height: 1254, alt: "Tiefkühl" },
  angebote: { src: "/images/categories/angebote.png", width: 1254, height: 1254, alt: "Angebote" },
};
