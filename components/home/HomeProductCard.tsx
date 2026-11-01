"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DefaultAddControl } from "@/components/ProductTile";
import { WishlistToggle } from "@/components/wishlist/WishlistToggle";
import type { UiProduct } from "@/lib/shopify/mappers";

const addClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm transition-colors hover:bg-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:cursor-wait disabled:opacity-60";

function money(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

/**
 * Compact grocery card: borderless, with the product on a light-grey image tile (white packshot backgrounds blend into
 * the tile), the add button on the tile's corner, then title and price (+ real compare-at price) underneath.
 */
export function HomeProductCard({ product, locale, priority = false }: { product: UiProduct; locale: string; priority?: boolean }) {
  const t = useTranslations("homePage.rows");
  const formatLocale = locale === "en" ? "en-GB" : "de-DE";
  const href = `/products/${product.handle}`;

  return (
    <article className="flex h-full flex-col bg-white">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative isolate block aspect-square overflow-hidden rounded-lg bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image.url}
              alt=""
              fill
              sizes="(min-width: 1280px) 212px, (min-width: 640px) 184px, 152px"
              loading={priority ? "eager" : "lazy"}
              className="object-contain p-3 mix-blend-multiply"
            />
          ) : null}
        </Link>
        {product.compareAtPrice && (
          <span className="absolute left-2 top-2 rounded bg-brand-terracotta px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">{t("sale")}</span>
        )}
        <WishlistToggle item={product} className="absolute right-1.5 top-1.5 shrink-0" />
        <div className="absolute bottom-2 right-2">
          <DefaultAddControl product={product} className={addClass} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-0.5 pb-1 pt-2.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-sm font-medium leading-tight text-neutral-900">
          <Link href={href} className="hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{product.title}</Link>
        </h3>
        <p className="mt-auto min-w-0">
          <span className="block text-base font-bold leading-tight text-neutral-900">{money(product.price.amount, product.price.currencyCode, formatLocale)}</span>
          {product.compareAtPrice && (
            <span className="block text-xs text-neutral-500 line-through">{money(product.compareAtPrice.amount, product.compareAtPrice.currencyCode, formatLocale)}</span>
          )}
        </p>
      </div>
    </article>
  );
}
