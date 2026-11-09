"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import type { UiProduct } from "@/lib/shopify/mappers";
import { WishlistToggle } from "@/components/wishlist/WishlistToggle";

function formatMoney(amount: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(amount);
}

const addControlClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-teal-dark shadow-sm ring-1 ring-black/10 transition-colors hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:cursor-wait disabled:opacity-60";

function PlusIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Default add control for tiles that are not given their own addControl. Simple in-stock
 * single-variant products are added (quantity 1) to the cart; products that need a variant
 * choice, or whose variants are unknown, go to the product page instead of guessing one;
 * sold-out products get no control.
 */
export function DefaultAddControl({ product, className }: { product: UiProduct; className?: string }) {
  const t = useTranslations("product");
  const { addItem, isPending } = useCart();
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");

  if (!product.availableForSale) return null;

  if (!product.quickAddVariantId) {
    return (
      <Link href={`/products/${product.handle}`} aria-label={t("chooseOptions")} title={t("chooseOptions")} className={className ?? addControlClass}>
        <PlusIcon />
      </Link>
    );
  }

  const variantId = product.quickAddVariantId;
  async function handleAdd() {
    try {
      await addItem(variantId, 1);
      setStatus("added");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label={status === "added" ? t("addedToCart") : status === "error" ? t("addToCartError") : t("addToCart")}
      title={status === "error" ? t("addToCartError") : t("addToCart")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleAdd();
      }}
      className={`${className ?? addControlClass} ${status === "added" ? "bg-brand-teal-dark text-white hover:bg-brand-teal-dark" : ""} ${status === "error" ? "ring-2 ring-brand-terracotta" : ""}`}
    >
      {status === "added" ? (
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m5 12 5 5 9-10" /></svg>
      ) : status === "error" ? (
        <span aria-hidden className="text-base font-bold leading-none">!</span>
      ) : (
        <PlusIcon />
      )}
    </button>
  );
}

type ProductTileProps = {
  addControl?: ReactNode;
  product: UiProduct;
  locale?: string;
  /** "grid" is the vertical card used in scroll rows/grids; "list" is a horizontal row. */
  variant?: "grid" | "list";
};

/**
 * The single product tile used everywhere a product is shown as a clickable summary
 * (ProductRow, CollectionBrowser grid/list, PDP related products). The tile always fills
 * its container width (`w-full`/`min-w-0`) rather than taking a `className` override —
 * two width utilities on the same element race in Tailwind's generated stylesheet, not
 * in source order, so a caller that needs a fixed width (ProductRow's horizontal scroll
 * row) wraps the tile in its own sizing `<div>` instead of fighting this one.
 */
export function ProductTile({ product, locale = "de-DE", variant = "grid", addControl }: ProductTileProps) {
  const t = useTranslations("product");
  const price = formatMoney(product.price.amount, product.price.currencyCode, locale);
  const compareAtPrice = product.compareAtPrice
    ? formatMoney(product.compareAtPrice.amount, product.compareAtPrice.currencyCode, locale)
    : null;

  const addButton = addControl ?? <DefaultAddControl product={product} />;

  const image = (
    <div
      className={`relative shrink-0 overflow-hidden bg-brand-cream ${
        variant === "list" ? "h-20 w-20 rounded-lg" : "aspect-square w-full"
      }`}
    >
      {product.image ? (
        <Image
          src={product.image.url}
          alt={product.image.alt}
          fill
          sizes={variant === "list" ? "80px" : "(min-width: 640px) 220px, 45vw"}
          // Contained, never cropped: packshots with their own label art fill the square otherwise and look zoomed in.
          className={`object-contain mix-blend-multiply ${variant === "list" ? "p-1" : "p-3"}`}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-[10px] text-brand-teal-dark/40">
          {t("noImage")}
        </span>
      )}
      {variant === "grid" && product.compareAtPrice && (
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">
          {t("saleBadge")}
        </span>
      )}
    </div>
  );

  if (variant === "list") {
    return (
      <div className="flex min-w-0 items-center gap-3 py-3 transition-colors hover:bg-brand-cream/50">
        <Link href={`/products/${product.handle}`} className="flex min-w-0 flex-1 items-center gap-4">
          {image}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-teal-dark sm:text-base">{product.title}</p>
            {product.compareAtPrice && (
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {t("saleBadge")}
              </span>
            )}
            {!product.availableForSale && (
              <p className="mt-1 text-xs text-brand-teal-dark/50">{t("soldOut")}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <p className="text-sm font-bold text-brand-teal-dark sm:text-base">{price}</p>
            {compareAtPrice && <p className="text-xs text-brand-teal-dark/40 line-through">{compareAtPrice}</p>}
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          {addButton}
          <WishlistToggle item={product} className="shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-colors hover:border-black/15">
      <div className="relative">
        <Link href={`/products/${product.handle}`} className="block">
          {image}
        </Link>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <WishlistToggle item={product} />
          {addButton}
        </div>
      </div>
      <Link href={`/products/${product.handle}`} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-tight text-brand-teal-dark sm:text-sm">
            {product.title}
          </p>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-sm font-bold text-brand-teal-dark sm:text-base">{price}</p>
            {compareAtPrice && <p className="text-xs text-brand-teal-dark/40 line-through">{compareAtPrice}</p>}
          </div>
          {!product.availableForSale && (
            <p className="text-[11px] text-brand-teal-dark/50">{t("soldOut")}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
