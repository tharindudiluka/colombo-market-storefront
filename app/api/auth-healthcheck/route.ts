/**
 * Connectivity/config check for the Customer Account API — hits the unauthenticated
 * discovery endpoint to confirm SHOPIFY_STORE_DOMAIN resolves and the shop/client env
 * vars are present, without needing a real login. Useful before the first staging deploy,
 * since the actual OAuth round trip can't be tested against localhost.
 */
export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID;
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

  if (!domain || !shopId || !clientId) {
    return Response.json(
      {
        ok: false,
        error:
          "Missing SHOPIFY_STORE_DOMAIN, SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID, or " +
          "SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID in .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`https://${domain}/.well-known/customer-account-api`);
    if (!res.ok) {
      throw new Error(`Discovery endpoint returned ${res.status} ${res.statusText}`);
    }
    const discovery = await res.json();
    return Response.json({ ok: true, shopId, discovery });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
