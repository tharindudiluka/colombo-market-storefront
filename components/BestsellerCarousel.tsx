"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductTile } from "@/components/ProductTile";
import { useCart } from "@/components/cart/CartProvider";
import type { UiProduct } from "@/lib/shopify/mappers";

export function BestsellerCarousel({ products }: { products: UiProduct[] }) {
  const t = useTranslations("productRow.bestsellers");
  const tp = useTranslations("product");
  const locale = useLocale();
  const { addItem, isPending } = useCart();
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ previous: false, next: false });
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setPosition({ previous: element.scrollLeft > 1, next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [products]);

  function move(direction: number) {
    const element = track.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth });
  }

  async function addProduct(variantId: string) {
    setError(false);
    try { await addItem(variantId, 1); } catch { setError(true); }
  }

  return (
    <section className="mt-8 border-y border-brand-teal/10 bg-white/60" aria-labelledby="bestsellers-title">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="bestsellers-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 text-sm text-brand-teal-dark/70">{t("subtitle")}</p>
          </div>
          {(position.previous || position.next) && <div className="flex gap-2">
            {([[-1, "previous"], [1, "next"]] as const).map(([direction, key]) => <button key={key} type="button" aria-label={t(key)} aria-controls="bestseller-products" disabled={!position[key]} onClick={() => move(direction)} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/25 text-brand-teal-dark transition hover:bg-brand-cream disabled:opacity-30"><span aria-hidden>{direction < 0 ? "←" : "→"}</span></button>)}
          </div>}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-brand-terracotta">{tp("addToCartError")}</p>}
        {products.length === 0 ? <p className="py-8 text-sm text-brand-teal-dark/70">{t("empty")}</p> : <div ref={track} id="bestseller-products" role="region" aria-label={t("title")} tabIndex={0} className="bestseller-track no-scrollbar mt-6 pb-2">
          {products.map(product => {
            const options = product.quickAddVariants ?? [];
            const selectedId = variants[product.id] ?? options.find(option => option.availableForSale)?.id;
            const selected = options.find(option => option.id === selectedId);
            const available = selected?.availableForSale;
            return <div key={product.id} className="bestseller-card">
              <ProductTile product={selected ? { ...product, price: selected.price, compareAtPrice: selected.compareAtPrice } : product} locale={locale} addControl={<button type="button" disabled={!available || isPending} aria-label={tp("addToCart")} onClick={() => selectedId && void addProduct(selectedId)} className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white transition hover:bg-brand-teal-dark disabled:cursor-not-allowed disabled:opacity-50"><span aria-hidden className="text-xl">+</span></button>} />
              <div className="mt-2 min-h-11">
                {options.length > 1 && <select aria-label={t("variant", { title: product.title })} value={selectedId ?? ""} onChange={event => setVariants(current => ({ ...current, [product.id]: event.target.value }))} className="min-h-11 w-full rounded-lg border border-brand-teal/20 bg-white px-3 text-sm text-brand-teal-dark">
                  {options.map(option => <option key={option.id} value={option.id} disabled={!option.availableForSale}>{option.title}</option>)}
                </select>}
              </div>
            </div>;
          })}
        </div>}
      </div>
    </section>
  );
}
