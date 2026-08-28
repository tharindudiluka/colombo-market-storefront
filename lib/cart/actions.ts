"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  cartCreateMutation,
  cartLinesAddMutation,
  cartLinesRemoveMutation,
  cartLinesUpdateMutation,
  cartQuery,
} from "@/lib/shopify/queries/cart";
import { toUiCart, type UiCart } from "@/lib/shopify/mappers";
import type {
  CartCreateResult,
  CartLinesAddResult,
  CartLinesRemoveResult,
  CartLinesUpdateResult,
  CartQueryResult,
  LanguageCode,
} from "@/lib/shopify/types";

const CART_COOKIE = "cartId";

async function getCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function setCartId(id: string) {
  const store = await cookies();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getCart(language: LanguageCode = "DE"): Promise<UiCart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  const data = await shopifyFetch<CartQueryResult>({
    query: cartQuery,
    variables: { cartId, language },
    revalidate: 0,
  });
  return data.cart ? toUiCart(data.cart) : null;
}

export async function addToCart(
  variantId: string,
  quantity: number,
  language: LanguageCode = "DE"
): Promise<UiCart> {
  const cartId = await getCartId();

  if (cartId) {
    const data = await shopifyFetch<CartLinesAddResult>({
      query: cartLinesAddMutation,
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }], language },
      revalidate: 0,
    });
    if (data.cartLinesAdd.cart && data.cartLinesAdd.userErrors.length === 0) {
      return toUiCart(data.cartLinesAdd.cart);
    }
  }

  // No cart cookie yet, or the stored cart is stale/expired on Shopify's side — start fresh.
  const created = await shopifyFetch<CartCreateResult>({
    query: cartCreateMutation,
    variables: { input: { lines: [{ merchandiseId: variantId, quantity }] }, language },
    revalidate: 0,
  });
  if (created.cartCreate.userErrors.length > 0 || !created.cartCreate.cart) {
    throw new Error(created.cartCreate.userErrors.map((e) => e.message).join("; ") || "Could not create cart.");
  }
  await setCartId(created.cartCreate.cart.id);
  return toUiCart(created.cartCreate.cart);
}

export async function updateCartLine(
  lineId: string,
  quantity: number,
  language: LanguageCode = "DE"
): Promise<UiCart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart.");

  const data = await shopifyFetch<CartLinesUpdateResult>({
    query: cartLinesUpdateMutation,
    variables: { cartId, lines: [{ id: lineId, quantity }], language },
    revalidate: 0,
  });
  if (data.cartLinesUpdate.userErrors.length > 0 || !data.cartLinesUpdate.cart) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join("; ") || "Could not update cart.");
  }
  return toUiCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(lineId: string, language: LanguageCode = "DE"): Promise<UiCart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart.");

  const data = await shopifyFetch<CartLinesRemoveResult>({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds: [lineId], language },
    revalidate: 0,
  });
  if (data.cartLinesRemove.userErrors.length > 0 || !data.cartLinesRemove.cart) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join("; ") || "Could not update cart.");
  }
  return toUiCart(data.cartLinesRemove.cart);
}
