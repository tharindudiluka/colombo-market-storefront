import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { refreshAccessToken } from "@/lib/shopify/customer-oauth";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  collectionExistsQuery,
  productExistsQuery,
} from "@/lib/shopify/queries/resource-exists";

// Next 16's Proxy always runs on the Node.js runtime (no Edge default, and no explicit
// `runtime` export allowed here) — Customer Account API token refresh works as-is.
const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = "customer_session";
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const ACCOUNT_PATH = /^\/(en\/)?account(\/|$)/;
const RESOURCE_PATH = /^\/(en\/)?(products|collections)\/([^/]+)\/?$/;

type StoredSession = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
};

function parseSession(raw: string | undefined): StoredSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function writeSessionCookie(response: NextResponse, session: StoredSession) {
  response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 60,
    path: "/",
  });
}

function redirectToLogin(request: NextRequest) {
  const locale = request.nextUrl.pathname.startsWith("/en") ? "en" : "de";
  const loginUrl = new URL("/api/auth/login", request.url);
  loginUrl.searchParams.set("locale", locale);
  loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const resourcePath = request.nextUrl.pathname.match(RESOURCE_PATH);

  // loading.tsx can flush HTTP 200 before the page calls notFound(). Set the
  // status before streaming, retaining next-intl's rewrite and the existing UI.
  // Leave locale redirects and non-read requests alone. API failures propagate
  // as errors; only an explicit Shopify null means a missing resource.
  if (
    resourcePath &&
    (request.method === "GET" || request.method === "HEAD") &&
    !response.headers.has("location")
  ) {
    const [, englishPrefix, kind, encodedHandle] = resourcePath;
    const handle = decodeURIComponent(encodedHandle);
    const resourceType = kind === "products" ? "product" : "collection";
    const { resource } = await shopifyFetch<{
      resource: { id: string } | null;
    }>({
      query: kind === "products" ? productExistsQuery : collectionExistsQuery,
      variables: { handle, language: englishPrefix ? "EN" : "DE" },
      tags: [resourceType, handle],
      revalidate: 0,
    });

    if (resource === null) {
      return new NextResponse(response.body, {
        status: 404,
        headers: response.headers,
      });
    }
  }
  const isAccountRoute = ACCOUNT_PATH.test(request.nextUrl.pathname);
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (session && session.expiresAt - Date.now() < REFRESH_THRESHOLD_MS) {
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      writeSessionCookie(response, {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        idToken: refreshed.id_token,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
      });
    } catch {
      response.cookies.delete(SESSION_COOKIE);
      if (isAccountRoute) return redirectToLogin(request);
    }
  } else if (isAccountRoute && !session) {
    return redirectToLogin(request);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
