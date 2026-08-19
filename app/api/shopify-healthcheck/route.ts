import { shopifyFetch } from "@/lib/shopify/client";
import { shopInfoQuery } from "@/lib/shopify/queries/shop";
import type { ShopInfo } from "@/lib/shopify/types";

/**
 * Temporary connectivity check for Phase 2 — confirms SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local are valid before wiring live data into
 * the home page (Phase 3). Delete this route once that's confirmed.
 */
export async function GET() {
  try {
    const data = await shopifyFetch<ShopInfo>({ query: shopInfoQuery, revalidate: 0 });
    return Response.json({ ok: true, shop: data.shop });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
