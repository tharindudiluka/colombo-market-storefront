"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function WishlistHeaderButton() {
  const t = useTranslations("wishlist");
  const { count } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label={t("headerLabel", { count })}
      className="flex h-10 w-10 items-center justify-center rounded-full text-brand-teal-dark transition-colors hover:bg-brand-cream active:scale-95 sm:h-11 sm:w-11"
    >
      <span className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6 sm:h-7 sm:w-7">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-terracotta px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
    </Link>
  );
}
