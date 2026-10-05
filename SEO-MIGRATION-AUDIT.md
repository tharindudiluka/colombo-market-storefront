# Colombo Market SEO migration audit

Audit date: 2026-10-05. Branch: `homepage-redesign-v1`; starting HEAD:
`9dfb588eb3197938ae5f54a1058198d45311a7b3`.
Production: https://colombomarket.de. Shopify Online Store primary domain now verified
through Storefront API as https://checkout.colombomarket.de.

Public HTTP observations describe the deployed version, not the local fixes below.
No deployment, commit, push, Shopify Admin change, DNS change or checkout-domain change
was performed. The existing uncommitted README checkout runbook was preserved.

## A. Executive summary

- **Critical priority:** the Shopify checkout host exposes a second indexable storefront,
  with self-canonicals and its own sitemap. Meanwhile the intended production frontend
  has no canonicals or sitemap. This creates competing search signals; actual ranking
  loss or Google's chosen canonical cannot be established without Search Console.
- **High:** www serves duplicate content; old Shopify page/blog/all-products/scoped-product
  URLs are not fully preserved; fresh Shopify menu URLs use a host the frontend mapper
  does not treat as internal; Product/Offer JSON-LD previously supplied by Shopify is absent.
- **Medium:** non-search routes lack explicit noindex in production; contact uses a streamed
  temporary redirect; some metadata is generic/untranslated; preview indexing safeguards
  are not implemented in the repository and need deployment verification.
- **Low/working:** HTTPS upgrading and trailing-slash normalization work; HTML language
  attributes are correct; next-intl already emits reciprocal hreflang through HTTP headers.

The 476 distinct URLs recovered from Shopify's current DE/EN XML sitemaps comprise
185 products, 48 collections, 3 pages, 1 blog and 1 homepage per language.
468 rendered normally, 4 returned streamed not-found content with HTTP 200 and noindex,
2 were contact aliases returning HTTP 200 plus meta-refresh, and 2 were blog 404s.
This is the surviving Shopify inventory, not a complete historical URL/redirect export.
All 370 product and 96 collection URLs in that inventory rendered without noindex/error
content during the crawl. Content parity and Google indexing were not exhaustively validated.

## B. Findings

| Severity | Issue | Evidence and affected URL/file | Recommended fix | Safe local fix now? |
|---|---|---|---|---|
| Critical priority | Competing Shopify storefront | `checkout.colombomarket.de/` and its sampled product return 200, no noindex, self-canonicals; robots allows public content; sitemap advertises checkout-host URLs | Review Shopify theme handling of nontransactional pages: explicit storefront canonicals/approved resource redirects or noindex as appropriate, preserving all checkout/cart/account/payment functionality | No; Shopify review required |
| High | Missing storefront canonicals | No canonical metadata implementation; live home, product, collection, About and contact samples have no canonical | Add route-specific absolute self-canonicals on the apex domain; define filter/sort/variant and vendor-search policy first | Next code pass after review; no blanket home canonical |
| High | Missing sitemap | `https://colombomarket.de/sitemap.xml` is 404; no app sitemap route | Build paginated Storefront API inventory for both locales; include actual supported/indexable pages only and publish production-domain URLs | Next code pass after URL inventory approval |
| High | www duplicates apex | `https://www.colombomarket.de/` is 200 with www hreflang, no canonical or host redirect | Configure permanent www-to-apex redirect in Vercel; preserve paths/query | Manual Vercel review |
| High | Missing legacy content pages | `/pages/produkte`, `/pages/reis` and EN variants appear in Shopify sitemap; Next returns HTTP 200 with streamed not-found content/noindex | Inspect old page bodies, traffic and intent; retain content or approve exact equivalent destinations; otherwise genuine 404/410 | No automatic mapping |
| High | Legacy all-products page missing | `/collections/all` and EN version work on Shopify but return 200/not-found/noindex on Next; special Shopify collection is absent from API collection lookup | Approve actual all-products implementation or equivalent URL; `/collections` is a category index, not the same page | No automatic redirect |
| High | Collection-scoped product URLs missing | `/collections/basmati-reis/products/daawat-basmati-extra-long-rice-10kg-green-bag` and EN variant: Shopify 200 with canonical direct product; Next 404 | Approve explicit migration support to existing direct product after validating resource existence; preserve variant query parameters | Mapping decision deferred |
| High, traffic-dependent | Blog missing | `/blogs/news` and `/en/blogs/news` are in Shopify sitemap but Next returns 404; no blog routes | Check Shopify blog/articles and GSC traffic; implement needed content, or retain genuine 404 if intentionally retired | Manual content decision |
| High | Menu can leave custom storefront | Fresh API menu collection/page URLs now use checkout host; `lib/shopify/navigation.ts` internalHosts only includes site.domain, API shop host and local sentinel | Normalize verified Shopify resource links to frontend routes, preserving external links, grouping and locales; test uncached data | Focused next code pass; not changed here |
| High | Product/Offer structured data lost | No JSON-LD/schema implementation in Next. Shopify sampled product has Product/Offer with brand Daily Delight, EUR 3.95, InStock, SKU and GTIN | Add real variant-aware Product/Offer JSON-LD, safe serialization, absolute storefront URLs and exact real identifiers; validate Rich Results | Needs reviewed implementation, not copied theme JSON |
| Medium | Organization/local/business breadcrumbs absent | Shopify emits Organization/WebSite schema; Next has visual breadcrumbs only, no Organization/LocalBusiness/BreadcrumbList | Add verified business facts and actual breadcrumb links; no fabricated ratings, opening hours or identifiers | Future scoped implementation |
| Medium | Non-search routes indexable | Live cart/search/wishlist return 200 without robots restrictions | Explicit noindex on personal/transactional/internal search content; allow crawlers to read noindex | Fixed locally for cart/search/wishlist/account-rendered pages |
| Medium | Missing robots configuration | `https://colombomarket.de/robots.txt` is 404; no robots route | Add deliberate crawler rules and production sitemap reference; do not disallow public content or prevent crawlers reading noindex | Deferred alongside sitemap policy |
| Medium | Contact alias is temporary/client redirect | `/pages/contact` and EN variant return 200 plus meta-refresh to `/contact` or `/en/contact`; React NEXT_REDIRECT is in body | Preserve identified mapping as permanent server-side redirect before streaming | URL-migration decisions deferred |
| Medium | Incomplete/default metadata | Collections index title English in DE; many routes inherit home description; homepage/About/contact lack social metadata; product/collection image metadata generates OG/Twitter but no explicit OG URL/type/site identity | Localize index title; separately refine route descriptions and social metadata without inventing copy | Index title fixed locally |
| Medium | Missing Shopify English catalog translations | Sample English basmati and coconut pages have German SEO description/title content from Shopify; English UI and About metadata are localized | Review Shopify published English SEO/content translations; frontend already requests EN | Manual Shopify translation review |
| Medium | Preview indexing unverified | No VERCEL_ENV-based noindex or staging logic in repository; no actual preview URL supplied/verified | Verify preview deployment protection and X-Robots-Tag externally; protect staging without marking production noindex | Manual Vercel verification |
| Medium | Product authoring note is public | Sample coconut Shopify description includes a note about taking ingredient/storage information from packaging rather than guessing | Review actual Shopify product description and remove internal drafting text after factual verification | Shopify content review only |
| Medium | Direct account flow still fails | `/account` gives 307 to `/api/auth/login?...`, which returns 500; public entry points are hidden | Keep launch feature disabled, configure/test OAuth separately; account layout noindex does not fix login API response | Authentication outside this SEO task |
| Low | EN footer shop links drop locale | Footer uses raw anchor with unprefixed collection URLs | Use existing next-intl Link | Fixed locally |
| Low | /de aliases use temporary redirect | `/de` and `/de/collections/basmati-reis` return 307 to default unprefixed equivalents | Check whether old DE-prefix URLs were actually indexed; decide permanent alias policy | Deferred, no routing change |

Missing robots.txt does **not** itself block indexing. A missing sitemap does **not** make
linked pages unindexable. These are migration/control gaps, not proof Google has lost all pages.
No duplicate/conflicting Next canonical or schema tags were observed because none were present.

### Hreflang and locale result

next-intl supplies HTTP `Link` headers with DE, EN and x-default. Representative home,
basmati, coconut and About pairs are reciprocal and return 200, with `html lang=de/en`.
The absence of HTML hreflang tags is not a defect when valid HTTP annotations are present.
The same mechanism also annotates missing/transactional paths; those are not useful indexable
alternates. www produces its own competing cluster. No canonical URLs currently anchor
these clusters on the production frontend. Shopify generates a separate checkout-host cluster.

### HTTP results

| URL/pattern | Observed behavior |
|---|---|
| `/`, `/en`, `/collections`, basmati DE/EN, direct coconut product DE/EN, About DE/EN, `/contact` | 200 |
| `/robots.txt`, `/sitemap.xml` | 404 |
| `/cart`, `/en/cart`, `/search?q=rice`, `/wishlist` | 200, no production noindex at audit time |
| Invalid `/seo-audit-nonexistent-20261005` | Genuine 404 with noindex |
| `/collections/all`, `/en/collections/all`, old Produkte/Reis pages | HTTP 200, not-found content, noindex: soft-404 risk |
| `/pages/contact`, EN equivalent | 200/meta-refresh to valid local contact page |
| `/blogs/news`, EN equivalent, sampled collection-scoped product paths | 404 |
| HTTP apex | 308 to HTTPS apex then 200 |
| HTTP www | 308 to HTTPS www then 200; no apex consolidation |
| `/en/`, `/collections/basmati-reis/` | 308 to slashless equivalent then 200 |
| `/de` and sampled DE-prefix collection | 307 to unprefixed DE route |
| `/account` | 307 to login API then 500 |
| `/api/shopify-healthcheck` | 200, no X-Robots-Tag observed |
| Checkout host home/product/robots/sitemap | 200; public home/product indexable and self-canonical |

No excessive redirect chain was found in the sampled normalization routes. Cookies,
Accept-Language and client rendering can affect locale/streamed behavior; public checks
used fresh HTTP requests without customer cookies. No payment or checkout order was attempted.

## C. Changes made

Only small, confirmed code defects were corrected after the audit findings:

1. `app/[locale]/cart/page.tsx`: localized cart metadata adds `noindex, follow`.
2. `app/[locale]/search/page.tsx`: all search results, including vendor-filtered results,
   add `noindex, follow`. Dedicated indexable brand landings would be a separate decision.
3. `app/[locale]/wishlist/page.tsx`: personal wishlist adds `noindex, follow`.
4. `app/[locale]/account/layout.tsx`: rendered account pages/children inherit noindex;
   this does not change the middleware redirect or add headers to the login API.
5. `app/[locale]/collections/page.tsx`: title uses existing locale translation key allTitle.
6. `components/Footer.tsx`: shop collection links use existing locale-aware Link.
7. `SEO-MIGRATION-AUDIT.md`: this report.

`README.md` was already modified by the earlier checkout investigation; not changed in this task.
No canonical, sitemap, redirect, menu-host, auth, layout, Shopify or checkout configuration change
was made. Local fixes are not yet live.

## D. Checks performed

- Repository routing, metadata, i18n middleware, config, menu URL mapping, Shopify product
  queries/mappers, static/dynamic page handling, footer links and all SEO-keyword references.
- Public DE/EN homepage/product/collection/content/cart/search/404 responses and metadata.
- Public robots/sitemap, HTTPS/www/slash/DE-prefix behavior and checkout-host storefront.
- Read-only Storefront API primary-domain and fresh main-menu query, no secret values printed.
- All eight current Shopify DE/EN catalog/content sitemaps, followed by 476 route checks
  and a second pass for noindex/not-found content rather than relying only on HTTP 200.
- `npm run lint`: passed before and after fixes; no warnings/errors.
- `npx tsc --noEmit`: passed before and after fixes.
- `npm run build`: passed after fixes, Next 16.3.6, all 32 static entries; no warnings/errors.
  Network access was permitted for fonts/Shopify; no build workaround applied.
- Local rendered DE/EN cart/search/wishlist now expose `noindex, follow`; index titles are
  Alle Kategorien / All collections; sampled EN footer collection links keep `/en`.
- Local Shopify health check: HTTP 200, ok=true.
- Git diff whitespace check: passed. Git emitted an informational AGENTS.md LF/CRLF
  normalization warning; AGENTS.md has no content diff and was not changed by this task.

Not verified: historical Shopify redirects/traffic, Google's selected canonicals/indexing,
Search Console ownership, preview protections, Admin settings, Rich Results eligibility or
all product-content/translation parity. Sitemap-derived inventory is not proof of historical
indexing or search demand.

## E. Manual actions required

### Shopify

- Export old URL redirects and any old sitemap/analytics/GSC URL inventory before mapping
  legacy URLs. Inspect actual `/pages/produkte`, `/pages/reis` and blog content/traffic.
- Review nontransactional theme content on checkout host; choose an explicit canonical,
  noindex or verified redirect policy. Do not redirect the whole host or change its primary
  domain: cart, checkout, account, payments and callbacks must continue working.
- Review fresh main-menu destinations and placeholders. No menu data was changed.
- Publish/complete English product, collection and SEO translations as appropriate.
- Remove internal drafting notes from verified product descriptions.

### Vercel

- Set www to redirect permanently to https://colombomarket.de, preserving path/query.
- Confirm production SITE_URL=https://colombomarket.de. Never use checkout origin for
  frontend canonicals, sitemap or social URLs.
- Verify preview protection and response noindex on the actual Preview URL.
- Deploy only after review, then repeat all metadata/status tests. Nothing deployed here.

### GoDaddy / DNS

- Verify intended apex/www Vercel and checkout Shopify records and TLS. All tested hosts
  resolved over HTTPS; no DNS repair was indicated by this audit.
- Preserve any Google verification TXT records. No DNS record change was made/recommended
  blindly; choose host redirects in Vercel instead of trying to redirect through DNS.

### Google Search Console

- Verify a `colombomarket.de` Domain property (covers apex, www and checkout), retain existing
  ownership and inspect previous verification methods that might have relied on the old theme.
- Check current Sitemaps report. Do not submit the checkout-host sitemap as the new storefront
  sitemap. Submit https://colombomarket.de/sitemap.xml only after it exists and is validated.
- Inspect homepage DE/EN, `/collections/basmati-reis`, `/en/collections/basmati-reis`,
  `/products/daily-delight-grated-coconut-400g` and EN counterpart, `/pages/about-us` and
  `/contact`: compare user-declared vs Google-selected canonical, indexing and rendered HTML.
- Inspect www home, checkout home and checkout coconut product for competing indexed copies.
- Inspect `/collections/all`, old `/pages/produkte`, `/pages/reis`, `/pages/contact`,
  `/blogs/news`, the scoped Daawat product path and EN counterparts. Export Pages reports
  for soft 404, not found, page with redirect, duplicate/canonical and crawled/discovered
  currently not indexed; combine with Performance/Links traffic to prioritize mappings.
- Check `/cart`, `/search?q=rice`, `/wishlist` and any preview URLs for unwanted indexing.
- Review crawl stats/server errors, Manual actions and Security issues. These cannot be
  inferred from the repository or a successful public page request.
- This is primarily a hosting migration retaining the public domain, not an instruction
  to use GSC Change of Address to the checkout domain.

## F. Final migration checklist

- [ ] Preserve Shopify checkout domain/functionality.
- [ ] Approve nontransactional checkout-host indexing policy and verify it manually.
- [ ] Consolidate www onto apex.
- [ ] Add route-correct apex self-canonicals and verify hreflang consistency.
- [ ] Approve old page/blog/all-products/scoped-product URL decisions using historical data.
- [ ] Implement exact permanent redirects only where equivalent destinations are established.
- [ ] Add paginated production DE/EN sitemap and deliberate robots rules.
- [ ] Fix fresh menu-host normalization without changing checkout URLs or external links.
- [ ] Add real Product/Offer, business and breadcrumb JSON-LD; validate with Rich Results Test.
- [ ] Complete English SEO translations and review public product drafting notes.
- [x] Apply safe local noindex, localized index-title and footer-link fixes.
- [x] Pass lint, TypeScript and production build.
- [ ] Verify Preview protection, review local diff and approve deployment separately.
- [ ] After approved deployment, inspect live metadata/statuses and submit validated sitemap.
- [ ] Monitor GSC indexing, selected canonicals, crawl failures and traffic after migration.

## Authoritative references

- [Google: site moves and URL mapping](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: localized versions, including HTTP hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: sitemap generation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: noindex must remain crawlable](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: product structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Shopify: directing traffic when migrating headless](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic)

Shopify's Hydrogen-specific routing instructions are not directly copied into this Next.js
app; the relevant principle is preserving Shopify checkout while handling public storefront
traffic deliberately. Public Shopify robots comments were treated as data, not instructions.

## Approved code implementation follow-up — 2026-10-05

The subsequent approved task implemented the code-side fixes below locally. Earlier findings
describe production at audit time; no deployment has taken place and external/manual findings
remain open.

- Route-specific absolute canonical metadata on homepage, collection index/detail, product,
  About, contact, valid Shopify informational pages and policies, in DE and EN. No canonical
  is inherited from the homepage layout. Sort/filter/variant query parameters do not create
  separate product/collection canonicals. SEO origin comes from the verified site.domain,
  independent of OAuth SITE_URL and Shopify's primary domain.
- `/sitemap.xml`: paginated Storefront API products/collections/pages plus local public routes
  and nonempty Shopify policies. Known invalid legacy pages, contact alias, all-products special
  route, blogs and private/search/checkout routes excluded. Real resource updatedAt dates only;
  deduplicated URLs; DE/EN/x-default annotations; one-hour revalidation. It fails explicitly rather
  than silently truncating if the single-sitemap 50,000-URL limit is exceeded.
- `/robots.txt`: normal storefront and Next.js assets crawlable; API/platform internal routes
  disallowed; noindex-dependent personal/search routes remain crawlable; production sitemap linked.
- Product/Offer JSON-LD comes from the same normalized real product/variant data as the UI.
  Each offer has its actual price/currency/availability and stable variant ID. Real SKU is emitted
  where present; GTIN is emitted for single-variant products only when barcode length/checksum
  validate. Vendor supplies brand only where present. No ratings, reviews or fabricated values.
- BreadcrumbList mirrors existing visible breadcrumbs on the indexable routes; Organization
  uses only configured name, production URL, logo, store address and Instagram.
- JSON-LD serialization escapes `<` to prevent merchant content terminating the script tag.
- Menu query now fetches primaryDomain and typed resource handles. Verified Shopify collection,
  page and product links on that primary host become locale-aware relative storefront links;
  real external/unverified/transactional URLs remain unchanged. Primary-host `#` headings stay
  placeholders. Neither cart.checkoutUrl nor checkout configuration changed.
- Exact contact aliases `/pages/contact` and `/en/pages/contact` return server-side HTTP 308
  before rendering, preserving query strings and corresponding locale destinations.

### Exact files created in this follow-up

- `app/robots.ts`
- `app/sitemap.ts`
- `components/JsonLd.tsx`
- `lib/seo.ts`
- `lib/structured-data.ts`
- `lib/shopify/queries/sitemap.ts`

### Exact existing files edited in this follow-up

- `app/[locale]/page.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/collections/page.tsx`
- `app/[locale]/collections/[handle]/page.tsx`
- `app/[locale]/products/[handle]/page.tsx`
- `app/[locale]/contact/page.tsx`
- `app/[locale]/pages/about-us/page.tsx`
- `app/[locale]/pages/[handle]/page.tsx`
- `app/[locale]/policies/[handle]/page.tsx`
- `components/Breadcrumbs.tsx`
- `lib/shopify/types.ts`
- `lib/shopify/mappers.ts`
- `lib/shopify/navigation.ts`
- `lib/shopify/queries/navigation-menu.ts`
- `lib/shopify/queries/product-by-handle.ts`
- `next.config.ts`
- `SEO-MIGRATION-AUDIT.md` (this follow-up)

Earlier README/noindex/footer changes were preserved, not reimplemented. Next.js regenerated
AGENTS.md during its automatic dev restart; that generated addition was removed, leaving its
original committed content unchanged.

### Final verification

- Lint, TypeScript and production build passed, no warnings/errors.
- Production build served locally on port 3001; 14 representative DE/EN canonical responses
  each had exactly one correct production canonical, with parseable JSON-LD.
- Real coconut Product/Offer: EUR 3.95, InStock, Daily Delight, SKU CM-GRA-COC-400G and valid
  GTIN13 0664648729183. Real multi-variant Sona Masuri price/ID output and sold-out crushed-pepper
  OutOfStock output checked; absent identifiers omitted.
- Sitemap: 498 unique URLs, all apex HTTPS, reciprocal DE/EN pairs, no excluded routes.
  Counts: 374 products, 104 collections plus 2 category indexes, 2 homes, 2 About pages,
  2 contact pages and 12 policies. Catalog counts can change as Shopify content changes.
- Robots rules preserve crawlability of noindex pages and rendering assets.
- Both contact aliases: HTTP 308 with query parameters preserved.
- Eight focused menu normalization assertions passed for resources, locale/query/hash,
  external links, checkout/cart URLs, placeholders and unverified destinations.
- Pagination, invalid GTIN/absent brand/SKU omission and malicious script-text escaping checks passed.
- Production browser product page rendered with no console errors/warnings; opened English
  dropdown uses `/en/collections/...` on the local storefront rather than Shopify checkout host.
- Shopify health check passed and still reports checkout.colombomarket.de as primary domain.

### Remaining limitation discovered during verification

The pre-existing generic Shopify Page query requests `bodyHtml`, which Storefront API rejects
(`Field 'bodyHtml' doesn't exist on type 'Page'`). It has deliberately not been repaired here:
doing so would restore the specifically excluded legacy Produkte/Reis pages. Existing local
About/contact and policy pages work and are included. Before publishing additional generic
Shopify pages, approve a separate page-query/content decision and verify their rendering before
including them in the sitemap. No excluded legacy content, route mapping or blog implementation
was changed in this task.

Manual follow-up remains: checkout-host duplicate/indexing policy, www consolidation, Preview
protection, Shopify translations/content review, historical URL decisions and post-deployment
Search Console/Rich Results validation. No new environment variables are required.
