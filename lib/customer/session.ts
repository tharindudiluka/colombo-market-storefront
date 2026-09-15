import { cookies } from "next/headers";
import { refreshAccessToken } from "@/lib/shopify/customer-oauth";

const SESSION_COOKIE = "customer_session";
const OAUTH_FLOW_COOKIE = "oauth_flow";
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export type StoredSession = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
};

export type OAuthFlow = {
  verifier: string;
  state: string;
  locale: "de" | "en";
  returnTo?: string;
};

async function readCookie<T>(name: string): Promise<T | null> {
  const store = await cookies();
  const raw = store.get(name)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeCookie(name: string, value: unknown, maxAge: number): Promise<void> {
  const store = await cookies();
  store.set(name, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });
}

export async function getSession(): Promise<StoredSession | null> {
  return readCookie<StoredSession>(SESSION_COOKIE);
}

export async function setSession(session: StoredSession): Promise<void> {
  await writeCookie(SESSION_COOKIE, session, 60 * 60 * 24 * 60);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Read-only: returns whatever access token is currently stored, without refreshing.
 * Use this from Server Components / data-fetching actions invoked during RSC render —
 * Next.js forbids writing cookies at that point, so refreshing here would throw.
 * `proxy.ts` middleware refreshes proactively before the request reaches render, so in
 * practice this is fresh; a token that's still stale just means the underlying
 * `customerAccountFetch` call fails, which callers treat the same as "not logged in."
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

/**
 * Read + refresh-if-near-expiry + rewrite the cookie. Only safe to call from genuine
 * Server Action / Route Handler invocations (form submits, client-triggered transitions)
 * — never during the initial render of a Server Component. Returns null if there's no
 * session, or if the refresh token itself is no longer valid.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  if (session.expiresAt - Date.now() > REFRESH_THRESHOLD_MS) {
    return session.accessToken;
  }

  try {
    const refreshed = await refreshAccessToken(session.refreshToken);
    const updated: StoredSession = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token,
      idToken: refreshed.id_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    };
    await setSession(updated);
    return updated.accessToken;
  } catch {
    await clearSession();
    return null;
  }
}

export async function getOAuthFlow(): Promise<OAuthFlow | null> {
  return readCookie<OAuthFlow>(OAUTH_FLOW_COOKIE);
}

export async function setOAuthFlow(flow: OAuthFlow): Promise<void> {
  await writeCookie(OAUTH_FLOW_COOKIE, flow, 60 * 10);
}

export async function clearOAuthFlow(): Promise<void> {
  const store = await cookies();
  store.delete(OAUTH_FLOW_COOKIE);
}
