"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductTile } from "@/components/ProductTile";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function WishlistPageClient() {
  const t = useTranslations("wishlist");
  const locale = useLocale();
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="glass mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center sm:px-10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-brand-terracotta" aria-hidden>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
        <p className="mt-4 text-lg font-bold text-brand-teal-dark">{t("emptyTitle")}</p>
        <p className="mt-2 text-sm leading-6 text-brand-teal-dark/70">{t("emptyBody")}</p>
        <Link href="/collections" className="mt-6 rounded-full bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ProductTile key={item.id} product={item} locale={locale} />
      ))}
    </div>
  );
}
