import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/shopify/customer-oauth";
import { clearOAuthFlow, getOAuthFlow, setSession } from "@/lib/customer/session";
import { site } from "@/config/site";

function homePath(locale: string) {
  return locale === "en" ? "/en" : "/";
}

function accountPath(locale: string, returnTo?: string) {
  if (returnTo) return returnTo;
  return locale === "en" ? "/en/account" : "/account";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const flow = await getOAuthFlow();
  await clearOAuthFlow();

  // No matching flow cookie (expired, cleared, or a forged callback hit) or a state
  // mismatch — bail out to the homepage rather than trusting an unverified code exchange.
  if (!code || !state || !flow || flow.state !== state) {
    return NextResponse.redirect(new URL(homePath(flow?.locale ?? "de"), site.url));
  }

  try {
    const redirectUri = `${site.url}/api/auth/callback`;
    const token = await exchangeCodeForToken({ code, codeVerifier: flow.verifier, redirectUri });

    await setSession({
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      idToken: token.id_token,
      expiresAt: Date.now() + token.expires_in * 1000,
    });

    return NextResponse.redirect(new URL(accountPath(flow.locale, flow.returnTo), site.url));
  } catch {
    return NextResponse.redirect(new URL(homePath(flow.locale), site.url));
  }
}
