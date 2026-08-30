/**
 * Single source of truth for brand tokens (colors, fonts, layout constants). "Garden
 * Frost" theme — fresh-produce green primary, sprout-green pop, deep-carrot warm accent.
 * The legacy token names (teal/gold/terracotta/cream) are kept so nothing downstream has
 * to change; only the values move. app/globals.css mirrors these exact values in its
 * :root/@theme block (Tailwind v4's CSS-first config can't import TS values directly) —
 * when a value here changes, update globals.css to match. Components should never
 * hardcode a hex value or px width; they should only ever reference the Tailwind
 * utilities/CSS vars that these values feed.
 */
export const theme = {
  colors: {
    teal: "#3f7d3a",
    tealDark: "#2e5e2b",
    gold: "#8cc63f",
    terracotta: "#b4531f",
    cream: "#d6efd9",
  },
  fonts: {
    heading: "Geist",
    body: "Geist",
  },
  layout: {
    maxWidth: "1400px",
    buttonRadius: "9999px",
  },

  /* ----------------------------------------------------------------------
   * GLASS + GRADIENT LAYER (experimental). Mirrors the token block of the
   * same name in app/globals.css. Additive — nothing above depends on it;
   * delete this `glass` key (and the matching CSS block) to return to the
   * flat Garden Frost theme.
   * -------------------------------------------------------------------- */
  glass: {
    fill: "rgba(255,255,255,0.5)",
    fillStrong: "rgba(255,255,255,0.66)",
    rim: "rgba(255,255,255,0.85)",
    edge: "rgba(47,94,43,0.10)",
    blur: "blur(26px) saturate(165%)",
    shadow: "0 22px 55px -16px rgba(31,58,35,0.28), 0 6px 18px -10px rgba(31,58,35,0.18)",
    radius: "26px",
    gradients: {
      ground:
        "radial-gradient(120% 78% at 0% 0%, #a9ddc8, transparent 55%), radial-gradient(130% 85% at 100% 100%, #f7ead7, transparent 55%), linear-gradient(165deg, #d9efe3 0%, #e9f3ea 45%, #f4eee1 100%)",
      primary: "linear-gradient(135deg, #4e9a46 0%, #3f7d3a 55%, #2e5e2b 100%)",
      warm: "linear-gradient(135deg, #e27d3a 0%, #b4531f 100%)",
      sprout: "linear-gradient(120deg, #a8d85a 0%, #8cc63f 45%, #63a83a 100%)",
      mint: "linear-gradient(135deg, #d0eadd 0%, #a7d7c1 55%, #8ec9af 100%)",
      footer: "linear-gradient(180deg, #2e5e2b 0%, #1f3f23 100%)",
      orb: "radial-gradient(circle at 32% 28%, #e2f4e6 0%, #8fcea9 42%, #3f7d3a 100%)",
    },
  },
} as const;

export type Theme = typeof theme;
