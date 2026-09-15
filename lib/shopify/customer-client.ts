const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID;
const apiVersion = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION ?? "2025-10";

type CustomerAccountFetchArgs = {
  query: string;
  variables?: Record<string, unknown>;
  accessToken: string;
};

type CustomerAccountGraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * Thin fetch wrapper around the Shopify Customer Account GraphQL API — a separate API
 * from the Storefront one (different endpoint, different auth scheme), so this is
 * deliberately its own client rather than an extension of `client.ts`. Every response is
 * customer-specific, so this never uses Next's fetch cache. Callers resolve/refresh the
 * access token themselves (see `lib/customer/session.ts`) before calling this.
 */
export async function customerAccountFetch<T>({
  query,
  variables,
  accessToken,
}: CustomerAccountFetchArgs): Promise<T> {
  if (!shopId) {
    throw new Error(
      "Missing SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID. Copy .env.example to .env.local and fill in your " +
        "Customer Account API credentials (see README for setup steps)."
    );
  }

  const res = await fetch(`https://shopify.com/${shopId}/account/customer/api/${apiVersion}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shopify Customer Account API request failed: ${res.status} ${res.statusText}`);
  }

  const json: CustomerAccountGraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Shopify Customer Account API returned no data.");
  }

  return json.data;
}
