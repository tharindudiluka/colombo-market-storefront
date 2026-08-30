# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server on http://localhost:3000 (Turbopack). German at /, English at /en
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (no args = lint whole repo; eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit   # typecheck (no test framework is set up in this repo)
```

There are no unit/e2e tests. "Verifying a change" means the dev server plus, for anything
touching Shopify, `GET /api/shopify-healthcheck` (returns `{ ok, shop }` or `{ ok:false, error }`).

## Environment

`.env.local` (copy from `.env.example`) — server-only, no `NEXT_PUBLIC_` prefix:
`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_STOREFRONT_API_VERSION`
(defaults to `2025-10`). See `README.md` for how to mint the Storefront token.

## Stack & conventions

- **Next.js 16 App Router** (Turbopack), **React 19**, **Tailwind v4** (CSS-first, no
  `tailwind.config`), **next-intl v4**. Path alias `@/*` → repo root.
- **Middleware lives in `proxy.ts`, not `middleware.ts`** — Next 16's renamed convention.
  It only runs the next-intl locale middleware.
- Server Components by default. Interactive pieces are split: a server `Foo.tsx` does i18n
  + data fetching and renders a `"use client"` `FooClient.tsx` for the interactivity
  (see `AnnouncementBar` / `AnnouncementBarClient`, `cart/CartProvider`).
- **Never hardcode a hex color or px dimension in a component** — reference the Tailwind
  utilities / CSS vars that `config/theme.ts` feeds.
- **Never hardcode a Shopify collection handle** in a query or component — it comes from
  `config/collections.ts` as a query parameter.
- For locale-aware links/redirects use `@/i18n/navigation` (`Link`, `redirect`, `useRouter`),
  not `next/link` / `next/navigation`.

## Architecture

### i18n
German is the default and unprefixed (`/`); English is `/en` (`localePrefix: "as-needed"`).
`config/site.ts` defines the supported/default locales; `i18n/routing.ts` reads them;
`i18n/request.ts` loads `messages/{de,en}.json`. Layout calls `setRequestLocale` and
`generateStaticParams` emits both locales. Each page maps `locale.toUpperCase()` to a
`LanguageCode` (`"DE" | "EN"`) that is threaded into every Shopify query via `@inContext`.

Known limitation: `@inContext(language: EN)` only returns translated product/collection
titles if the merchant published English + translated content in Shopify. Otherwise `/en`
shows English UI chrome around German product titles — expected, not a bug.

### Shopify data — the mapper seam
`lib/shopify/`:
- `client.ts` — `shopifyFetch<T>()`, the only thing that talks to the Storefront GraphQL
  API. Server-only. Uses Next's native fetch cache: `revalidate` (default 3600) + `tags`
  for ISR/tag revalidation. Throws with a readable message on missing creds / GraphQL errors.
- `queries/` — raw GraphQL query strings. `collections.ts` exports
  `buildHomeCollectionsQuery()` which *generates* one aliased `collection(handle:)` field
  per entry in `config/collections.ts`.
- `types.ts` — the `Shopify*` GraphQL response shapes.
- `mappers.ts` — `toUiProduct` / `toUiProductDetail` / `toUiCollectionDetail` / `toUiCart`
  / `toUiCategory` normalize `Shopify*` into `Ui*` types. **Components import only `Ui*`
  types, never a `Shopify*` type.** Money strings become numbers here; `compareAtPrice` is
  only set when actually on sale; `quantityAvailable` is always `null` (the inventory
  scope isn't granted — consumers treat null as "unbounded").

### Config as source of truth (`config/`)
- `theme.ts` — brand tokens (colors/fonts/layout). Tailwind v4 can't import TS, so
  `app/globals.css` `:root` / `@theme` block **mirrors these values by hand** — change one,
  change both. Legacy token names (teal/gold/terracotta/cream) are kept intentionally.
- `site.ts` — business facts (address, `freeDeliveryThreshold`, currency) and locale config.
- `collections.ts` — semantic key → real Shopify collection handle. A wrong handle fails
  loudly (`collection(handle:)` returns `null` → `notFound()`), not silently.

### Content split
- `lib/content/` — static, non-translatable metadata for homepage banners (link targets,
  gradient accents, icon fallbacks). Arrays here are **zipped by index** with translatable
  copy arrays in `messages/*.json` (e.g. `heroSlideMeta` ↔ `hero.slides`), so order matters.
- `messages/{de,en}.json` — all translatable UI copy, namespaced (`announcementBar`,
  `header`, `nav`, `hero`, `promo`, `product`, `cart`, `search`, …).
- **Hero banners** are merchant-managed via the `home_banners` Shopify **metaobject**
  (one `image` file field per entry). Server `HeroCarousel.tsx` fetches them
  (`queries/home-banners.ts` → `toUiBanner`), and the `heroSlideMeta` + `hero.slides`
  gradient/copy slides are the fallback when the metaobject returns nothing / errors.
  `HeroCarouselClient.tsx` renders both shapes via a `HeroItem` union (`kind: "image" | "content"`).

### Routes & shell
`app/[locale]/`: home (`page.tsx`), `collections/[handle]`, `products/[handle]`, `search`.
Every page renders the same shell — `AnnouncementBar` → `Header` → `NavMenu` → … →
`Footer` → `HelpButton`. `app/api/` routes sit outside the `[locale]` segment.

### Cart
- `lib/cart/actions.ts` — `"use server"` actions (`getCart`, `addToCart`, `updateCartLine`,
  `removeCartLine`). Cart id is stored in an httpOnly `cartId` cookie; a stale cookie
  transparently falls back to `cartCreate`. All run with `revalidate: 0`.
- `components/cart/CartProvider.tsx` — client context (`useCart()`) holding cart state +
  drawer open/close, wrapping the tree in `app/[locale]/layout.tsx` with the server-fetched
  `initialCart`. Mutations go through `useTransition`.
