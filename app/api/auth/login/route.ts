import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizeUrl, generatePkcePair, generateState } from "@/lib/shopify/customer-oauth";
import { setOAuthFlow } from "@/lib/customer/session";
import { site } from "@/config/site";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "de";
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? undefined;

  const { verifier, challenge } = generatePkcePair();
  const state = generateState();
  const redirectUri = `${site.url}/api/auth/callback`;

  await setOAuthFlow({ verifier, state, locale, returnTo });

  return NextResponse.redirect(buildAuthorizeUrl({ state, codeChallenge: challenge, redirectUri }));
}
