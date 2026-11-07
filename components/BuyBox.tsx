"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { useLocale, useTranslations } from "next-intl";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistToggle } from "@/components/wishlist/WishlistToggle";
import type { UiProductDetail, UiProductVariant } from "@/lib/shopify/mappers";
import { analyticsItemId, trackViewItem, variantTitleForItem } from "@/lib/analytics-events";

function formatMoney(amount: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(amount);
}

function findMatchingVariant(
  variants: UiProductVariant[],
  selected: Record<string, string>
): UiProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selected[option.name] === option.value)
  );
}

export function BuyBox({ product, descriptionHtml, children }: { product: UiProductDetail; descriptionHtml: string; children: ReactNode }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { addItem, isPending } = useCart();

  const defaultVariant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((defaultVariant?.selectedOptions ?? []).map((o) => [o.name, o.value]))
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [addError, setAddError] = useState(false);

  const selectedVariant = useMemo(
    () => findMatchingVariant(product.variants, selectedOptions) ?? defaultVariant,
    [product.variants, selectedOptions, defaultVariant]
  );

  // Phones: once the main add-to-cart button has scrolled out of view, a compact bar keeps it one tap away.
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const element = addButtonRef.current;
    if (!element) return;
    let frame = 0;
    // The sticky site header covers the top of the viewport, so the button counts as gone once it passes under it.
    const update = () => {
      frame = 0;
      setShowSticky(element.getBoundingClientRect().bottom < 150);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const viewedProductId = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedVariant || viewedProductId.current === product.id) return;
    viewedProductId.current = product.id;
    const variant = variantTitleForItem(selectedVariant.title);
    trackViewItem(
      {
        item_id: analyticsItemId(product.id, selectedVariant.id),
        item_name: product.title,
        ...(product.vendor ? { item_brand: product.vendor } : {}),
        ...(variant ? { item_variant: variant } : {}),
        price: selectedVariant.price.amount,
        quantity: 1,
      },
      selectedVariant.price.currencyCode
    );
  }, [product.id, product.title, product.vendor, selectedVariant]);

  const hasRealOptions = !(product.options.length === 1 && product.options[0].name === "Title");
  const isSoldOut = !selectedVariant || !selectedVariant.availableForSale;
  const maxQuantity = selectedVariant?.quantityAvailable ?? null;

  async function handleAddToCart() {
    if (isSoldOut || !selectedVariant) return;
    setAddError(false);
    try {
      await addItem(selectedVariant.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    } catch {
      setAddError(true);
    }
  }

  if (!selectedVariant) {
    return null;
  }

  const price = formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode, locale);
  const savePercent = selectedVariant.compareAtPrice && selectedVariant.compareAtPrice.amount > selectedVariant.price.amount
    ? Math.round((1 - selectedVariant.price.amount / selectedVariant.compareAtPrice.amount) * 100)
    : 0;
  const addLabel = isSoldOut ? t("soldOut") : isPending ? t("adding") : justAdded ? t("addedToCart") : t("addToCart");
  const addClass = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-sm transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none sm:text-base ${
    isSoldOut || isPending
      ? "cursor-not-allowed bg-black/10 text-brand-teal-dark/40 shadow-none"
      : justAdded
        ? "cursor-pointer bg-brand-teal text-white"
        : "cursor-pointer bg-brand-teal-dark text-white hover:-translate-y-0.5 hover:bg-brand-teal hover:shadow-md active:translate-y-0 active:scale-[0.98]"
  }`;
  const cartIcon = (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h13l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 4H3" /><circle cx="9.5" cy="20.5" r="1" /><circle cx="16.5" cy="20.5" r="1" /></svg>
  );

  return (
    <div className="product-buy-box">
      {product.vendor && (
        <p className="inline-flex rounded-full bg-brand-terracotta/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-terracotta">{product.vendor}</p>
      )}
      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="min-w-0 font-heading text-2xl leading-tight font-extrabold tracking-tight text-brand-teal-dark sm:text-3xl lg:text-4xl">{product.title}</h1>
        <WishlistToggle
          item={{
            id: product.id,
            handle: product.handle,
            title: product.title,
            image: product.images[0] ?? null,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            availableForSale: product.availableForSale,
          }}
          className="h-11! w-11! shrink-0 border border-brand-teal-dark/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-3xl font-extrabold tracking-tight text-brand-teal-dark sm:text-4xl">{price}</span>
        {selectedVariant.compareAtPrice && (
          <span className="text-base text-brand-teal-dark/40 line-through">
            {formatMoney(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode, locale)}
          </span>
        )}
        {savePercent > 0 && (
          <span className="rounded-full bg-brand-terracotta px-2.5 py-1 text-xs font-bold text-white">{t("save", { percent: savePercent })}</span>
        )}
        <span className="text-xs text-brand-teal-dark/50">{t("taxIncluded")}</span>
      </div>

      {selectedVariant.unitPrice && (
        <p className="mt-1 text-xs text-brand-teal-dark/50">
          {t("unitPrice", {
            price: formatMoney(selectedVariant.unitPrice.amount, selectedVariant.unitPrice.currencyCode, locale),
            unit: `${selectedVariant.unitPrice.referenceValue}${selectedVariant.unitPrice.referenceUnit}`,
          })}
        </p>
      )}

      <p className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${isSoldOut ? "text-brand-terracotta" : "text-brand-teal"}`}>
        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${isSoldOut ? "bg-brand-terracotta" : "bg-brand-teal"}`} />
        {isSoldOut ? t("soldOut") : maxQuantity !== null && maxQuantity <= 5 ? t("onlyLeft", { count: maxQuantity }) : t("inStock")}
      </p>

      {hasRealOptions && (
        <div className="mt-6 flex flex-col gap-4 border-t border-brand-teal-dark/10 pt-6">
          {product.options.map((option) => (
            <div key={option.name}>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal-dark/70">{option.name}</p>
              <div role="group" aria-label={option.name} className="mt-2 flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const candidate = findMatchingVariant(product.variants, { ...selectedOptions, [option.name]: value });
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={!candidate?.availableForSale}
                      onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                      className={`min-h-11 min-w-16 cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${
                        isSelected
                          ? "border-brand-teal-dark bg-brand-teal-dark text-white shadow-sm"
                          : "border-black/10 bg-white text-brand-teal-dark hover:border-brand-teal hover:bg-brand-cream/40"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="product-quantity">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-teal-dark/70">{t("quantityLabel")}</p>
          <QuantityStepper value={quantity} max={maxQuantity} onChange={setQuantity} label={t("quantityLabel")} />
        </div>
        <button ref={addButtonRef} type="button" disabled={isSoldOut || isPending} onClick={handleAddToCart} aria-live="polite" className={`${addClass} w-full sm:flex-1`}>
          {!isSoldOut && cartIcon}
          {addLabel}
        </button>
      </div>
      {addError && <p role="alert" className="mt-2 text-sm font-semibold text-brand-terracotta">{t("addToCartError")}</p>}
      {children}
      <ProductDetailsAccordion product={product} variant={selectedVariant} descriptionHtml={descriptionHtml} />

      {/* Phones only: appears after the main button has scrolled away. */}
      <div
        aria-hidden={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-teal-dark/10 bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${showSticky ? "translate-y-0" : "translate-y-full"}`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-brand-teal-dark/70">{product.title}</p>
            <p className="text-lg font-extrabold leading-tight text-brand-teal-dark">{price}</p>
          </div>
          <button type="button" tabIndex={showSticky ? 0 : -1} disabled={isSoldOut || isPending} onClick={handleAddToCart} className={`${addClass} shrink-0`}>
            {!isSoldOut && cartIcon}
            {addLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
