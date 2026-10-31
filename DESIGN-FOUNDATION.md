# Design foundation (Batch A1)

Source: `app/design-foundation.css` (imported by `app/globals.css`), mirrored in
`config/theme.ts` → `theme.foundation`. Everything is **additive**: new names only, nothing
existing was changed, so no page renders differently until a later batch adopts a piece.

## Colors (`--ds-*`, plus utilities such as `bg-canvas`, `text-ink`, `border-line`)

| Token | Value | Use |
|---|---|---|
| `--ds-green` / `colombo-green` | `#1e4a2c` | Primary: buttons, headings accents, active states |
| `--ds-green-hover` | `#163a22` | Primary hover |
| `--ds-green-soft` | `#e8efe6` | Secondary hover, subtle fills |
| `--ds-sage` | `#6f8f74` | Muted botanical green, decorative or secondary text on dark |
| `--ds-canvas` | `#faf7f2` | Page background (warm off-white) |
| `--ds-surface` | `#fffdf9` | Cards, inputs, panels |
| `--ds-surface-muted` | `#f3efe7` | Banded sections |
| `--ds-ink` / `--ds-ink-soft` | `#1c2a20` / `#4b5a50` | Primary / secondary text |
| `--ds-line` / `--ds-line-strong` | `#e3ddd1` / `#c9c2b4` | Dividers, card borders / input borders |
| `--ds-accent-terracotta` | `#b4531f` | Sale, badges, sparingly |
| `--ds-accent-gold` | `#b8912f` | Highlights, sparingly |

Legacy `brand-teal | brand-teal-dark | brand-gold | brand-cream | brand-terracotta` and
`category-*` are unchanged (values still the "Garden Frost" mint palette) and keep working.
Migration direction: `brand-teal(-dark)` → `colombo-green`, `brand-cream` → `surface-muted`,
body background → `canvas`, then rename/retire the legacy names once nothing uses them.
Campaign colors (`kumaio-*`, `daily-delight-*`) stay scoped to their banners.

## Typography (Geist, `.type-*`)

`.type-page-title` (28px → 36px ≥640), `.type-section-title` (22px → 28px),
`.type-card-title` (14px → 15px), `.type-body` (16px, 68ch max), `.type-body-sm` (14px),
`.type-caption` (12px, the floor; do not go lower). Defined in `@layer components`, so a
Tailwind utility on the same element still wins.

The global `body { font-family: Arial }` is **intentionally unchanged in A1**: switching it
to Geist reflows every page, so it is a one-line change reserved for A2 with a visual
comparison (`body { font-family: var(--font-geist-sans), system-ui, sans-serif }`).

## Containers

- `.container-shop`: max 1440px, the default for shop/content pages.
- `.container-wide`: max 1920px, only for full-bleed banners that genuinely need it.
- `.container-narrow`: 48rem, for reading pages (policies, about text).
- Gutter `--ds-gutter`: 16px → 24px (≥640) → 32px (≥1024). No `calc(100% - …)` hacks.

Adopt per page in later batches by replacing `mx-auto max-w-[var(--layout-max-width)] px-4`
(and the `.homepage > main .mx-auto` overrides) with the class. Not migrated yet.

## Radii and shadows

Radii `--ds-radius-sm|md|lg` = 6 / 10 / 14px (utilities `rounded-ds-sm|md|lg`; the `ds`
infix avoids overriding Tailwind's own `rounded-sm|md|lg`). Shadows `--ds-shadow-card`,
`--ds-shadow-lift` (utilities `shadow-card`, `shadow-lift`). `.surface-card` combines
surface + line + radius-lg + shadow-card.

## Buttons and controls

`.btn` plus one variant: `.btn-primary` (solid green, white text), `.btn-secondary`
(surface + green outline), `.btn-tertiary` (text action). 44px min height, radius-md,
14px/600, 150ms color transitions, 2px green `:focus-visible` outline, 50% opacity when
disabled (`:disabled` or `aria-disabled="true"`). No gradients. `.control` is the shared
base for inputs, selects and textareas (44px, 16px text, line-strong border, same focus
ring). Not yet applied to existing buttons; existing `bg-brand-teal` buttons still render
through the glass layer.

## Glass/gradient layer: scope for A2

Nothing below was removed or disabled in A1. All of it lives in `app/globals.css`
between the banner `GLASS + GRADIENT LAYER` (line 387) and `END GLASS + GRADIENT LAYER`
(line 640), plus `theme.glass` in `config/theme.ts` and one `.glass` class used in markup.

**Tokens (`:root`)**: `--glass-*`, `--radius-glass`, `--gradient-ground|primary|warm|sprout|mint|header|footer|sheen`, `--orb`.

**Page ground**: `html { background-color }`, `body { background: transparent }`,
`body::before` (fixed full-viewport mint gradient), `.min-h-full.bg-white` (forces route
wrappers transparent so the ground shows through).

**Global restyling by utility-class selector** (affects anything using those utilities):
- `.bg-brand-gold` → sprout gradient (announcement bar)
- `.bg-brand-terracotta` → warm gradient
- `.bg-brand-teal` → green gradient (every teal button/badge)
- `.bg-brand-cream` → mint gradient (product image backgrounds, bands)
- `.bg-black\/50` → backdrop blur on scrims
- `footer.bg-brand-teal-dark` → footer gradient (reset to none by `footer.storefront-footer`)
- `.overflow-hidden.rounded-2xl:not(.bg-brand-cream)` → hero frame radius 18px + glass shadow
- `.rounded-2xl.p-3` → promo tile radius 16px + glass shadow
- `a.rounded-xl.bg-white` (+ `:hover`) → frosted product cards, 26px radius, blur
- `.rounded-full.bg-brand-cream` → category circles border + glass shadow
- `button.fixed.rounded-full` → floating help button border and shadow

**Structural selectors**: `header.sticky.top-0` (+ ≥1024px override to flat white),
`form[role="search"]` (+ `:focus-within`, + ≥1024px override), `nav.border-b` and its
`.desktop-nav-link` chip rules (+ `[aria-current="page"]` gradient).

**Component class**: `.glass`, used in `CartPageClient`, `WishlistPageClient`,
`contact/page`, `pages/about-us/page`.

**Inside the banner but NOT glass; keep or relocate in A2**: `.skeleton-shimmer` +
`@keyframes skeleton-shimmer` (route loading skeletons) and `.footer-group-panel*`
(functional footer accordion). `header.sticky.top-0` also supplies the header's base
background and shadow, so it needs a flat replacement rather than plain deletion.

A2 plan: swap the legacy-token usages to the foundation tokens, replace each selector with
explicit component classes, compare before/after screenshots, then delete the block, the
`theme.glass` key, and the `.glass` class uses.
