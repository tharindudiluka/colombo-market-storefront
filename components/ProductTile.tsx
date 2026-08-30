"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { UiProduct } from "@/lib/shopify/mappers";

function formatMoney(amount: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(amount);
}

type ProductTileProps = {
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
export function ProductTile({ product, locale = "de-DE", variant = "grid" }: ProductTileProps) {
  const price = formatMoney(product.price.amount, product.price.currencyCode, locale);
  const compareAtPrice = product.compareAtPrice
    ? formatMoney(product.compareAtPrice.amount, product.compareAtPrice.currencyCode, locale)
    : null;

  const addButton = (
    <button
      type="button"
      aria-label="Add to bag"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-teal-dark ring-1 ring-black/10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-3.5 w-3.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );

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
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-1 text-center text-[10px] text-brand-teal-dark/40">
          Kein Bild
        </span>
      )}
      {variant === "grid" && product.compareAtPrice && (
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">
          Angebot
        </span>
      )}
      {variant === "grid" && <div className="absolute bottom-2 right-2">{addButton}</div>}
    </div>
  );

  if (variant === "list") {
    return (
      <Link
        href={`/products/${product.handle}`}
        className="flex min-w-0 items-center gap-4 py-3 transition-colors hover:bg-brand-cream/50"
      >
        {image}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-brand-teal-dark sm:text-base">{product.title}</p>
          {product.compareAtPrice && (
            <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Angebot
            </span>
          )}
          {!product.availableForSale && (
            <p className="mt-1 text-xs text-brand-teal-dark/50">Ausverkauft</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <p className="text-sm font-bold text-brand-teal-dark sm:text-base">{price}</p>
          {compareAtPrice && <p className="text-xs text-brand-teal-dark/40 line-through">{compareAtPrice}</p>}
        </div>
        {addButton}
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-colors hover:border-black/15"
    >
      {image}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-tight text-brand-teal-dark sm:text-sm">
          {product.title}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-bold text-brand-teal-dark sm:text-base">{price}</p>
          {compareAtPrice && <p className="text-xs text-brand-teal-dark/40 line-through">{compareAtPrice}</p>}
        </div>
        {!product.availableForSale && (
          <p className="text-[11px] text-brand-teal-dark/50">Ausverkauft</p>
        )}
      </div>
    </Link>
  );
}
