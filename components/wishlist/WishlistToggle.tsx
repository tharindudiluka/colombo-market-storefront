"use client";

import { useTranslations } from "next-intl";
import { useWishlist, type WishlistItem } from "@/components/wishlist/WishlistProvider";

export function WishlistToggle({ item, className = "" }: { item: WishlistItem; className?: string }) {
  const t = useTranslations("wishlist");
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(item.id);

  return (
    <button
      type="button"
      aria-label={saved ? t("remove", { title: item.title }) : t("save", { title: item.title })}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(item);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-teal-dark ring-1 ring-black/10 transition hover:bg-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    </button>
  );
}
