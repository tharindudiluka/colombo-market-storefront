import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { refreshAccessToken } from "@/lib/shopify/customer-oauth";

// Next 16's Proxy always runs on the Node.js runtime (no Edge default, and no explicit
// `runtime` export allowed here) — Customer Account API token refresh works as-is.
const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = "customer_session";
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const ACCOUNT_PATH = /^\/(en\/)?account(\/|$)/;

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
