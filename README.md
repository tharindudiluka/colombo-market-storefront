# Colombo Market — Headless Storefront

A Next.js headless storefront for Colombo Market (colombomarket.de), backed by the Shopify
Storefront API. It is bilingual (German default, English secondary) and includes catalogue,
product, cart, search, contact, wish-list, and customer-account flows.

Non-technical owner? Start with [CLIENT_HANDOVER.md](CLIENT_HANDOVER.md). It explains how
to clone, configure, run, safely change, and review this project with GitHub Desktop and
ChatGPT/Codex.

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
      `unauthenticated_read_collection_listings`, `unauthenticated_read_metaobjects`,
      `unauthenticated_read_content`, `unauthenticated_read_checkouts`, and
      `unauthenticated_write_checkouts`.
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

## Production checkout domain (Next.js on Vercel)

The custom storefront domain and Shopify-hosted checkout must have separate hosts.
`colombomarket.de` stays attached to Vercel. Shopify's **Online Store primary domain**
must resolve to Shopify, not to this Next.js app.

Diagnosis verified with fresh nonempty Storefront API carts on 2026-10-05:

- Shopify reported `https://colombomarket.de` as its primary domain.
- German `checkoutUrl` used `/cart/c/...`; English used `/en/cart/c/...` on that host.
- Both reached Vercel and returned HTTP 404.
- Using the existing `.myshopify.com` host for the same checkout path returned HTTP 301
  back to the incorrectly configured primary domain, then HTTP 404.

### Required Shopify configuration

In Shopify Admin, **Settings → Domains**, set a Shopify-served domain as the primary
domain for the **Online Store**. The smallest correction uses the existing shop domain
`colombo-market-2.myshopify.com`, with no new DNS record. Alternatively, connect a dedicated
checkout subdomain (for example `checkout.colombomarket.de`) to Shopify, wait for Shopify's
domain/TLS verification, and make that the Online Store primary domain. Follow the DNS
records Shopify supplies for that subdomain; do not repoint the storefront apex domain.

Keep `colombomarket.de` on Vercel and retain production `SITE_URL=https://colombomarket.de`.
Keep `SHOPIFY_STORE_DOMAIN=colombo-market-2.myshopify.com` for API requests. No additional
checkout environment variable, Next.js redirect/rewrite, locale-prefix stripping, or
frontend checkout-host substitution is required.

The cart fragment requests Shopify's `checkoutUrl` for reads and every mutation; cart
actions bypass caching, `toUiCart` preserves the URL, and both checkout controls use plain
HTML anchors. Preserve this handoff, including Shopify's locale path and all query
parameters. Cart keys are sensitive: do not log or paste complete checkout URLs.

### Verify after changing the Shopify setting

1. Query `shop.primaryDomain.url` and create a fresh cart with an available product in
   each language context (`DE` and `EN`). Confirm each returned `checkoutUrl` uses the
   Shopify-served primary domain.
2. Open checkout from both the cart drawer and cart page in each storefront locale.
   Confirm Shopify displays the correct product, quantity, price, and language without
   redirecting back to the Vercel-hosted `/cart/c/...` route. Do not place a test order
   unless separately authorized.
3. Refresh any already-open cart UI so it fetches the current checkout URL rather than
   retaining a URL from before the domain change. No application redeploy is required
   for the domain setting alone.
4. Review Shopify-generated links (notifications, discounts, checkout logo/continue
   shopping) because changing Shopify's primary domain affects their host. Configure
   storefront return navigation separately if needed; do not add a blanket redirect
   that intercepts cart or checkout routes.

Shopify references:
[Cart API checkout handoff](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
and [direct checkout traffic to a Shopify subdomain](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic#direct-checkout-traffic-to-the-subdomain).

## Known limitation: locale vs. Shopify content language

`@inContext(language: EN)` only returns translated product/collection titles if the
merchant has published English under Shopify Admin → Settings → Languages and translated
content via the Translate & Adapt app. Without that, `/en` shows English UI chrome around
German product titles — this is expected Shopify behavior, not a bug here.

---

This project was bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to
load Geist, matching the spice_clone reference UI's original theme.
# colombo_frontend
