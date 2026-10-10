"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { useLocale, useTranslations } from "next-intl";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistToggle } from "@/components/wishlist/WishlistToggle";
import type { UiProductDetail, UiProductVariant } from "@/lib/shopify/mappers";

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

  return (
    <div className="product-buy-box">
      {product.vendor && (
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">{product.vendor}</p>
      )}
      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="min-w-0 font-heading text-2xl leading-tight font-bold text-brand-teal-dark sm:text-3xl">{product.title}</h1>
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

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-2xl font-bold text-brand-teal-dark sm:text-3xl">
          {formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode, locale)}
        </span>
        {selectedVariant.compareAtPrice && (
          <span className="text-base text-brand-teal-dark/40 line-through">
            {formatMoney(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode, locale)}
          </span>
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
                      className={`min-h-11 rounded-xl border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${
                        isSelected
                          ? "border-brand-teal-dark bg-brand-teal-dark text-white"
                          : "border-black/15 text-brand-teal-dark hover:border-brand-teal"
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

      <div className="product-quantity mt-6 flex items-center gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-teal-dark/70">
            {t("quantityLabel")}
          </p>
          <QuantityStepper value={quantity} max={maxQuantity} onChange={setQuantity} label={t("quantityLabel")} />
        </div>
      </div>

      {isSoldOut ? (
        <p className="mt-5 text-sm font-semibold text-brand-terracotta">{t("soldOut")}</p>
      ) : (
        maxQuantity !== null &&
        maxQuantity <= 5 && (
          <p className="mt-5 text-sm text-brand-terracotta">{t("onlyLeft", { count: maxQuantity })}</p>
        )
      )}

      <button
        type="button"
        disabled={isSoldOut || isPending}
        onClick={handleAddToCart}
        aria-live="polite"
        className={`mt-3 min-h-12 w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:text-base ${
          isSoldOut || isPending
            ? "cursor-not-allowed bg-black/10 text-brand-teal-dark/40"
            : justAdded
              ? "bg-brand-teal text-white"
              : "bg-brand-teal-dark text-white hover:bg-brand-teal"
        }`}
      >
        {isSoldOut ? t("soldOut") : isPending ? t("adding") : justAdded ? t("addedToCart") : t("addToCart")}
      </button>
      {addError && <p role="alert" className="mt-2 text-sm font-semibold text-brand-terracotta">{t("addToCartError")}</p>}
      {children}
      <ProductDetailsAccordion product={product} variant={selectedVariant} descriptionHtml={descriptionHtml} />
    </div>
  );
}
