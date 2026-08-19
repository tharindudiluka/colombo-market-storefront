# Colombo Market — Headless Storefront

A Next.js headless frontend for the Colombo Market Shopify store (colombomarket.de), backed
by the Shopify Storefront API. Bilingual (German default, English secondary). Currently
scoped to the home page only — cart, checkout, product pages, and search are future work.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get Shopify Storefront API credentials (there's nothing to copy from the theme repo —
   these must be generated fresh):

   1. Shopify Admin → **Settings → Apps and sales channels → Develop apps** (enable custom
      app development if prompted; requires store-owner permission).
   2. **Create an app**, name it e.g. "Colombo Frontend (Headless)".
   3. **Configuration → Storefront API scopes** → grant at least
      `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
      `unauthenticated_read_collection_listings`.
   4. **Install app** → **API credentials** → copy the Storefront API access token.
   5. The `*.myshopify.com` handle is shown in the Admin URL bar or under
      **Settings → Domains** (primary/original domain).
   6. **Settings → Languages** → confirm English is added and **published** if bilingual
      product copy is wanted (see caveat below — otherwise English pages show German
      product titles from Shopify, with translated UI chrome around them).

3. Copy `.env.example` to `.env.local` and fill in the values from step 2:

   ```bash
   cp .env.example .env.local
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — German at `/`, English at `/en`.

## Architecture

- `config/theme.ts`, `config/site.ts`, `config/collections.ts` — single source of truth
  for brand colors/fonts/layout, business facts (address, delivery threshold), and which
  Shopify collection handle backs each home page section. Rebranding or repointing a
  section to a different collection is a config edit, not a component edit.
- `lib/shopify/` — Storefront API client (`client.ts`), GraphQL queries (`queries/`), and
  the adapter layer (`mappers.ts`) that normalizes Shopify's GraphQL shape into the
  `UiProduct`/`UiCategory` types components actually consume. Components never import a
  Shopify type directly.
- `lib/content/` — static, non-commerce homepage content (hero/promo banner metadata,
  brand list, icon fallbacks) that has no Shopify equivalent.
- `messages/de.json` / `messages/en.json` — all translatable UI copy, loaded via
  [next-intl](https://next-intl.dev). `i18n/routing.ts` defines the locales; `middleware`
  lives in `proxy.ts` (Next.js 16's renamed middleware convention).
- `app/[locale]/` — the only page-rendering route today (home page). `app/api/` routes
  (like the healthcheck below) sit outside the locale segment.

## Verifying the Shopify connection

`GET /api/shopify-healthcheck` fetches the shop name via the Storefront API — hit it after
setting up `.env.local` to confirm credentials work before trusting the home page's live
data. It returns `{ ok: false, error: "..." }` with a clear message if credentials are
missing or wrong. Delete this route once you've confirmed it works, or leave it behind a
dev-only guard.

## Known limitation: locale vs. Shopify content language

`@inContext(language: EN)` only returns translated product/collection titles if the
merchant has published English under Shopify Admin → Settings → Languages and translated
content via the Translate & Adapt app. Without that, `/en` shows English UI chrome around
German product titles — this is expected Shopify behavior, not a bug here.

---

This project was bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to
load Marcellus (headings) and Arimo (body) from Google Fonts.
# colombo_frontend
