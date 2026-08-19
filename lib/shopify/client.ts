const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-10";

type ShopifyFetchArgs = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number;
};

type ShopifyGraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * Thin fetch wrapper around the Shopify Storefront GraphQL API. Only ever called from
 * Server Components/modules — the token never reaches client JS, so no NEXT_PUBLIC_
 * prefix is needed on the env vars. Uses Next's native fetch cache (`next.revalidate`/
 * `tags`) instead of a client-managed cache layer, so RSC-level ISR/tag revalidation
 * works for free.
 */
export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  revalidate = 3600,
}: ShopifyFetchArgs): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN. Copy .env.example to .env.local and fill in your Storefront API credentials (see README for setup steps)."
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API request failed: ${res.status} ${res.statusText}`);
  }

  const json: ShopifyGraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return json.data;
}
