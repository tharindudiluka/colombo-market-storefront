"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { UiProduct } from "@/lib/shopify/mappers";

const STORAGE_KEY = "colombo-market-wishlist-v1";
const CHANGE_EVENT = "colombo-market-wishlist-change";
const EMPTY_ITEMS: WishlistItem[] = [];
let cachedItems: WishlistItem[] | null = null;

export type WishlistItem = Pick<
  UiProduct,
  "id" | "handle" | "title" | "image" | "price" | "compareAtPrice" | "availableForSale"
>;

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  isSaved: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function isWishlistItem(value: unknown): value is WishlistItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<WishlistItem>;
  return (
    typeof item.id === "string" &&
    typeof item.handle === "string" &&
    typeof item.title === "string" &&
    typeof item.availableForSale === "boolean" &&
    typeof item.price?.amount === "number" &&
    typeof item.price?.currencyCode === "string" &&
    (item.compareAtPrice === null ||
      (typeof item.compareAtPrice?.amount === "number" &&
        typeof item.compareAtPrice.currencyCode === "string")) &&
    (item.image === null ||
      (typeof item.image?.url === "string" && typeof item.image.alt === "string"))
  );
}

function readStoredItems(): WishlistItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWishlistItem);
  } catch {
    return [];
  }
}

function getItemsSnapshot() {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  cachedItems ??= readStoredItems();
  return cachedItems;
}

function subscribeToWishlist(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedItems = null;
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function writeItems(items: WishlistItem[]) {
  cachedItems = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private browsing, quota, disabled storage).
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToWishlist, getItemsSnapshot, () => EMPTY_ITEMS);

  const toggle = useCallback((item: WishlistItem) => {
    const current = getItemsSnapshot();
    writeItems(
      current.some((saved) => saved.id === item.id)
        ? current.filter((saved) => saved.id !== item.id)
        : [item, ...current]
    );
  }, []);

  const remove = useCallback((id: string) => {
    writeItems(getItemsSnapshot().filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isSaved: (id: string) => items.some((item) => item.id === id),
      toggle,
      remove,
    }),
    [items, remove, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used within WishlistProvider");
  return value;
}
