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

## Glass/gradient layer: retired in A2

The experimental layer is gone from `app/globals.css` and `config/theme.ts` (`theme.glass`).
What replaced it, in `app/globals.css` under "SHARED SURFACES":

- Page ground: `html` uses `--ds-canvas`; `body` uses `--background` (now `var(--ds-canvas)`);
  `.min-h-full.bg-white` stays transparent so the canvas shows through route wrappers.
- `.glass` (cart, wishlist, contact, about cards) is now a clean surface: `--ds-surface`,
  1px `--ds-line` border, `--ds-radius-lg`, `--ds-shadow-card`. No blur.
- `header.sticky.top-0`: `--ds-surface` with a 1px line and card shadow, via `box-shadow`
  so header height does not change.
- `form[role="search"]`: muted warm pill with line border and a green focus ring.
- Body font is now Geist (`--font-geist-sans`).
- `--color-brand-cream` is now the warm neutral `#f3efe7` (was mint `#d6efd9`); the name
  finally matches the value. `brand-teal|teal-dark|gold|terracotta` keep their values.

Removed outright: all `--glass-*`, `--gradient-*`, `--orb`, `--radius-glass` tokens; the
`body::before` ambient ground; the utility-class overrides on `.bg-brand-gold|terracotta|teal|cream`
and `.bg-black\/50` (blur); the footer gradient; the `.overflow-hidden.rounded-2xl`,
`.rounded-2xl.p-3`, `.rounded-full.bg-brand-cream` shadow rules. Dead selectors that matched
nothing (`nav.border-b` chips, `a.rounded-xl.bg-white`, `button.fixed.rounded-full`) were deleted.

Preserved: `.skeleton-shimmer` + keyframes, `.footer-group-panel*`, the header's base
surface, `.min-h-full.bg-white` transparency.
