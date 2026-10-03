"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { collectionHandles } from "@/config/collections";
import { ProductTile } from "@/components/ProductTile";
import { useCart } from "@/components/cart/CartProvider";
import type { UiProduct } from "@/lib/shopify/mappers";

export function WeeklyOffers({ products }: { products: UiProduct[] }) {
  const t = useTranslations("productRow.weeklySpecials");
  const tProduct = useTranslations("product");
  const locale = useLocale();
  const router = useRouter();
  const { addItem, isPending } = useCart();
  const [error, setError] = useState(false);

  async function addOffer(product: UiProduct) {
    if (!product.quickAddVariantId) {
      router.push(`/products/${product.handle}`);
      return;
    }
    setError(false);
    try {
      await addItem(product.quickAddVariantId, 1);
    } catch {
      setError(true);
    }
  }

  return (
    <section className="mt-8 border-y border-brand-teal/10 bg-white/60" aria-labelledby="weekly-offers-title">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="weekly-offers-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 text-sm text-brand-teal-dark/70">{t("subtitle")}</p>
          </div>
          <Link href={`/collections/${collectionHandles.weeklySpecials}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-teal/25 px-5 py-2 text-sm font-semibold text-brand-teal-dark transition hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-brand-teal">
            {t("viewAll")} <span aria-hidden>→</span>
          </Link>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-brand-terracotta">{tProduct("addToCartError")}</p>}
        {products.length === 0 ? <p className="py-8 text-sm text-brand-teal-dark/70">{t("empty")}</p> : (
          <div className="weekly-offers-grid no-scrollbar snap-row mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-5 xl:grid-cols-6">
            {products.map(product => (
              <div key={product.id} className="flex w-52 shrink-0 sm:w-auto">
                <ProductTile product={product} locale={locale} addControl={
                  <button type="button" disabled={!product.availableForSale || isPending} aria-label={product.quickAddVariantId ? tProduct("addToCart") : t("chooseOptions")} onClick={() => void addOffer(product)} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-white transition hover:bg-brand-teal-dark disabled:cursor-not-allowed disabled:opacity-50">
                    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                } />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
