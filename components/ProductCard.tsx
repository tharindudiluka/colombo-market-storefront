import Image from "next/image";
import type { UiProduct } from "@/lib/shopify/mappers";

function formatMoney(amount: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(
    amount
  );
}

export function ProductCard({ product, locale = "de-DE" }: { product: UiProduct; locale?: string }) {
  return (
    <div className="flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white sm:w-full">
      <div className="relative flex h-32 items-center justify-center bg-brand-cream sm:h-36">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(min-width: 640px) 200px, 160px"
            className="object-cover"
          />
        ) : (
          <span className="text-xs text-brand-teal-dark/40">Kein Bild</span>
        )}
        {product.compareAtPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">
            Angebot
          </span>
        )}
        <button
          aria-label="Add to bag"
          className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-teal-dark shadow"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-3.5 w-3.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold text-brand-teal-dark sm:text-sm">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-bold text-brand-teal-dark sm:text-base">
            {formatMoney(product.price.amount, product.price.currencyCode, locale)}
          </p>
          {product.compareAtPrice && (
            <p className="text-xs text-brand-teal-dark/40 line-through">
              {formatMoney(product.compareAtPrice.amount, product.compareAtPrice.currencyCode, locale)}
            </p>
          )}
        </div>
        {!product.availableForSale && (
          <p className="text-[11px] text-brand-teal-dark/50">Ausverkauft</p>
        )}
      </div>
    </div>
  );
}
