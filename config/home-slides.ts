/**
 * Homepage promotional slider. Add campaign banners here; no code changes are needed elsewhere.
 *
 * Artwork targets
 * - Desktop / tablet: 1600 x 640 px (5:2). Required for every slide.
 * - Phone (optional): 1080 x 1080 px (1:1) via `mobile`. When EVERY slide provides a mobile image the phone slider
 *   switches to square; otherwise phones crop the desktop image to 2:1, so keep key content in the centre 70%.
 * - WebP/JPEG, under 250 KB per image.
 *
 * Slides may have different aspect ratios: the slider reserves one box (the widest ratio, so the shortest height; no layout shift) and every
 * banner is shown whole (object-contain). Any leftover side strip is filled with the slide's optional `background` colour,
 * which should match the banner's own edge colour so the strip is invisible. Nothing is cropped.
 *
 * `image` is optional per language; a slide without an English image falls back to German, and a slide without any
 * image renders a neutral placeholder. `href` is optional (internal path such as "/collections/angebote", or an
 * absolute URL). While this list is empty the slider shows neutral placeholder slots so the layout can be reviewed.
 */
export type HomeSlideAsset = { src: string; width: number; height: number };
export type HomeSlideImage = HomeSlideAsset & { alt: string; mobile?: HomeSlideAsset; background?: string };

export type HomeSlide = {
  id: string;
  href?: string;
  image?: { de: HomeSlideImage; en?: HomeSlideImage };
};

export const homeSlides: HomeSlide[] = [
  {
    id: "sri-lankan-favourites",
    // No link yet: the planned target /collections/sri-lankan-groceries does not exist in Shopify. Add `href` once it does.
    image: {
      de: {
        src: "/images/home/banner1.png",
        width: 1983,
        height: 793,
        alt: "Sri-lankische Favoriten: Tee, Gewürze, Kokos, Snacks – Jetzt entdecken",
        // Edge colour of banner1.png (uniform on both sides), so the strips beside it are seamless.
        background: "#fbf8f2",
      },
    },
  },
  {
    id: "south-asian-variety",
    href: "/collections",
    image: {
      de: {
        src: "/images/home/banner2.png",
        width: 2172,
        height: 724,
        alt: "Südasiatische Vielfalt: Reis, Dal, Gewürze, Snacks und mehr – Entdecken",
      },
    },
  },
];

/** Number of neutral placeholder slots shown while `homeSlides` is empty. */
export const placeholderSlideCount = 3;
