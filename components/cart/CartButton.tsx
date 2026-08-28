"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const t = useTranslations("header");
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button aria-label={t("cartLabel")} onClick={openCart} className="relative text-brand-teal-dark">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 sm:h-6 sm:w-6"
      >
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-terracotta text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
