/**
 * Single source of truth for brand tokens (colors, fonts, layout constants). Matches the
 * original spice_clone reference UI's theme (teal/gold/terracotta palette, Geist font) —
 * kept as-is per product direction, rather than the Colombo Market storefront's own
 * theme. app/globals.css mirrors these exact values in its :root/@theme block (Tailwind
 * v4's CSS-first config can't import TS values directly) — when a value here changes,
 * update globals.css to match. Components should never hardcode a hex value or px width;
 * they should only ever reference the Tailwind utilities/CSS vars that these values feed.
 */
export const theme = {
  colors: {
    teal: "#0f5c4c",
    tealDark: "#0a3f34",
    gold: "#c9971f",
    terracotta: "#d9531e",
    cream: "#faf6ee",
  },
  fonts: {
    heading: "Geist",
    body: "Geist",
  },
  layout: {
    maxWidth: "1400px",
    buttonRadius: "9999px",
  },
} as const;

export type Theme = typeof theme;
