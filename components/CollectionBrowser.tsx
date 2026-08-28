"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductTile } from "@/components/ProductTile";
import type { UiProduct } from "@/lib/shopify/mappers";

type SortKey = "featured" | "az" | "za" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

export function CollectionBrowser({ products }: { products: UiProduct[] }) {
  const t = useTranslations("collection");
  const locale = useLocale();
  const [sortKey, setSortKey] = useState<SortKey>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const filtered = useMemo(() => {
    const base = products.filter((p) => (p.availableForSale ? showInStock : showOutOfStock));
    const list = [...base];
    switch (sortKey) {
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        list.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case "price-desc":
        list.sort((a, b) => b.price.amount - a.price.amount);
        break;
      default:
        break;
    }
    return list;
  }, [products, sortKey, showInStock, showOutOfStock]);

  const resetFilters = () => {
    setShowInStock(true);
    setShowOutOfStock(true);
  };
  const filtersActive = !showInStock || !showOutOfStock;

  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 py-4">
        <p className="text-sm text-brand-teal-dark/70">{t("productCount", { count: filtered.length })}</p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold sm:text-sm ${
              filtersActive
                ? "border-brand-teal bg-brand-teal text-white"
                : "border-black/15 text-brand-teal-dark hover:border-brand-teal"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-3.5 w-3.5">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            {t("filter")}
          </button>

          <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-teal-dark sm:text-sm">
            <span className="hidden sm:inline">{t("sortLabel")}</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-teal-dark sm:text-sm"
            >
              <option value="featured">{t("sortFeatured")}</option>
              <option value="az">{t("sortAlphaAsc")}</option>
              <option value="za">{t("sortAlphaDesc")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
            </select>
          </label>

          <div className="hidden items-center gap-1 rounded-full border border-black/15 p-1 sm:flex">
            <button
              type="button"
              aria-label={t("viewGrid")}
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                viewMode === "grid" ? "bg-brand-teal text-white" : "text-brand-teal-dark/60"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <rect x="13" y="4" width="7" height="7" rx="1" />
                <rect x="4" y="13" width="7" height="7" rx="1" />
                <rect x="13" y="13" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t("viewList")}
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                viewMode === "list" ? "bg-brand-teal text-white" : "text-brand-teal-dark/60"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-3.5 w-3.5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-black/10 bg-brand-cream/60 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-teal-dark/60">{t("availability")}</p>
          <label className="flex items-center gap-2 text-sm text-brand-teal-dark">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-brand-teal"
            />
            {t("inStock")}
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-teal-dark">
            <input
              type="checkbox"
              checked={showOutOfStock}
              onChange={(e) => setShowOutOfStock(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-brand-teal"
            />
            {t("outOfStock")}
          </label>
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-brand-terracotta underline underline-offset-2"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-brand-teal-dark/60">{t("empty")}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-brand-teal px-4 py-2 text-sm font-semibold text-brand-teal"
          >
            {t("resetFilters")}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductTile key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-2 divide-y divide-black/10">
          {filtered.map((product) => (
            <ProductTile key={product.id} product={product} locale={locale} variant="list" />
          ))}
        </div>
      )}
    </section>
  );
}
