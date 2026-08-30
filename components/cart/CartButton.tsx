"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const t = useTranslations("header");
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      aria-label={t("cartLabel")}
      onClick={openCart}
      className="flex h-10 w-10 items-center justify-center rounded-full text-brand-teal-dark transition-colors hover:bg-brand-cream active:scale-95 sm:h-11 sm:w-11"
    >
      <span className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 sm:h-7 sm:w-7"
        >
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-terracotta px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
    </button>
  );
}
