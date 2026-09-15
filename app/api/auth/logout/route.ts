import { NextResponse } from "next/server";
import { buildLogoutUrl } from "@/lib/shopify/customer-oauth";
import { clearSession, getSession } from "@/lib/customer/session";
import { site } from "@/config/site";

// POST-only (invoked from a <form method="post">, not a bare link) so logout can't be
// triggered by prefetch or a crawler following an href.
export async function POST() {
  const session = await getSession();
  await clearSession();

  if (!session) {
    return NextResponse.redirect(new URL("/", site.url), 303);
  }

  return NextResponse.redirect(buildLogoutUrl(session.idToken), 303);
}
