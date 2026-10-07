import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

// Keep broad tags (such as "collection") unavailable to this targeted endpoint.
const allowedTags = new Set(["ponni-reis"]);

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret || secret.length < 32 || secret.trim() !== secret) {
    return json({ ok: false, error: "Revalidation is not configured." }, 503);
  }

  const authorization = request.headers.get("authorization") ?? "";
  const provided = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!provided || !timingSafeEqual(digest(provided), digest(secret))) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return json({ ok: false, error: "Expected application/json." }, 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }
  if (
    !body || typeof body !== "object" || Array.isArray(body) ||
    Object.keys(body).length !== 1 || !("tag" in body) ||
    typeof body.tag !== "string" || !allowedTags.has(body.tag)
  ) {
    return json({ ok: false, error: "Unsupported tag or request body." }, 400);
  }

  try {
    // Expire every fetch variant carrying this tag, including DE and EN.
    // Data is refetched when those pages are next requested.
    revalidateTag(body.tag, { expire: 0 });
    return json({ ok: true, tag: body.tag });
  } catch {
    return json({ ok: false, error: "Revalidation failed." }, 500);
  }
}
