import { randomBytes, createHash } from "crypto";

const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID;
const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_SECRET;

const SCOPES = "openid email customer-account-api:full";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
};

function requireConfig() {
  if (!shopId || !clientId || !clientSecret) {
    throw new Error(
      "Missing SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID / _CLIENT_ID / _CLIENT_SECRET. Enable the Headless " +
        "sales channel + new Customer Accounts in the Shopify admin, create a confidential Customer " +
        "Account API client, and copy its values into .env.local."
    );
  }
}

/**
 * PKCE verifier/challenge + CSRF state for the OAuth Authorization Code flow. No new
 * dependency needed — Node's built-in crypto + base64url encoding is sufficient.
 */
export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function generateState(): string {
  return randomBytes(16).toString("base64url");
}

export function buildAuthorizeUrl({
  state,
  codeChallenge,
  redirectUri,
}: {
  state: string;
  codeChallenge: string;
  redirectUri: string;
}): string {
  requireConfig();
  const url = new URL(`https://shopify.com/authentication/${shopId}/oauth/authorize`);
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

async function requestToken(body: URLSearchParams): Promise<TokenResponse> {
  requireConfig();
  const res = await fetch(`https://shopify.com/authentication/${shopId}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Shopify Customer Account API token request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function exchangeCodeForToken({
  code,
  codeVerifier,
  redirectUri,
}: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  return requestToken(
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    })
  );
}

export function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  return requestToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
    })
  );
}

export function buildLogoutUrl(idToken: string): string {
  requireConfig();
  const url = new URL(`https://shopify.com/authentication/${shopId}/logout`);
  url.searchParams.set("id_token_hint", idToken);
  return url.toString();
}
