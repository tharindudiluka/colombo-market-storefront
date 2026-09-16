"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ProductTile } from "@/components/ProductTile";
import type { UiProduct } from "@/lib/shopify/mappers";
import type { ShopifyProductFilter } from "@/lib/shopify/types";

type SortKey = "featured" | "bestSelling" | "az" | "za" | "priceAsc" | "priceDesc" | "dateAsc" | "dateDesc";
type ViewMode = "grid" | "list";
type ProductFilterInput = Record<string, unknown>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function toFilterInput(input: unknown): ProductFilterInput | null {
  try {
    const parsed = typeof input === "string" ? JSON.parse(input) : input;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as ProductFilterInput : null;
  } catch {
    return null;
  }
}

function readPriceRange(filters: ProductFilterInput[]) {
  const active = filters.find((filter) => "price" in filter)?.price;
  if (active && typeof active === "object") {
    const price = active as { min?: number; max?: number };
    return { min: price.min ?? 0, max: price.max ?? 0 };
  }
  return null;
}

export function CollectionBrowser({
  products,
  filters = [],
  activeFilters = [],
  sort = "featured",
  totalCount,
}: {
  products: UiProduct[];
  filters?: ShopifyProductFilter[];
  activeFilters?: ProductFilterInput[];
  sort?: string;
  totalCount?: number;
}) {
  const t = useTranslations("collection");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ProductFilterInput[]>(activeFilters);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  const chosenSort = (sort in {
    featured: 1, bestSelling: 1, az: 1, za: 1, priceAsc: 1, priceDesc: 1, dateAsc: 1, dateDesc: 1,
  } ? sort : "featured") as SortKey;
  const priceFacet = filters.find((filter) => filter.type === "PRICE_RANGE");
  const priceBounds = useMemo(() => {
    const priceInput = toFilterInput(priceFacet?.values[0]?.input)?.price as { min?: number; max?: number } | undefined;
    return { min: priceInput?.min ?? 0, max: priceInput?.max ?? Math.max(...products.map((product) => product.price.amount), 0) };
  }, [priceFacet, products]);
  const draftPrice = readPriceRange(draftFilters);
  const filtersActive = activeFilters.length > 0;

  function replaceQuery(next: { filters?: ProductFilterInput[]; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.filters) {
      params.delete("filter");
      next.filters.forEach((filter) => params.append("filter", JSON.stringify(filter)));
    }
    if (next.sort) {
      if (next.sort === "featured") params.delete("sort");
      else params.set("sort", next.sort);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function toggleFilter(input: ProductFilterInput) {
    setDraftFilters((current) => {
      const key = canonical(input);
      return current.some((item) => canonical(item) === key)
        ? current.filter((item) => canonical(item) !== key)
        : [...current, input];
    });
  }

  function updatePriceBound(bound: "min" | "max", amount: number) {
    const current = draftPrice ?? { min: priceBounds.min, max: priceBounds.max };
    const min = bound === "min" ? Math.min(amount, current.max) : current.min;
    const max = bound === "max" ? Math.max(amount, current.min) : current.max;
    const next = draftFilters.filter((filter) => !("price" in filter));
    if (min > priceBounds.min || max < priceBounds.max) next.push({ price: { min, max } });
    setDraftFilters(next);
  }

  function applyFilters() {
    replaceQuery({ filters: draftFilters });
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraftFilters([]);
    replaceQuery({ filters: [] });
    setFilterOpen(false);
  }

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "featured", label: t("sortFeatured") },
    { value: "bestSelling", label: t("sortBestSelling") },
    { value: "az", label: t("sortAlphaAsc") },
    { value: "za", label: t("sortAlphaDesc") },
    { value: "priceAsc", label: t("sortPriceAsc") },
    { value: "priceDesc", label: t("sortPriceDesc") },
    { value: "dateAsc", label: t("sortDateAsc") },
    { value: "dateDesc", label: t("sortDateDesc") },
  ];

  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 py-4">
        <p className="text-sm text-brand-teal-dark/70">{t("productCount", { count: totalCount ?? products.length })}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => { setDraftFilters(activeFilters); setFilterOpen(true); }}
            aria-expanded={filterOpen}
            className={`flex h-12 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${filtersActive ? "border-brand-teal bg-brand-teal text-white" : "border-black/15 text-brand-teal-dark hover:border-brand-teal"}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            {t("filter")}{filtersActive ? ` (${activeFilters.length})` : ""}
          </button>
          <label className="flex h-12 items-center gap-2 text-xs font-semibold text-brand-teal-dark sm:text-sm">
            <span className="hidden sm:inline">{t("sortLabel")}</span>
            <select
              value={chosenSort}
              onChange={(event) => replaceQuery({ sort: event.target.value })}
              className="h-full rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-brand-teal-dark sm:text-sm"
            >
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <div className="hidden items-center gap-1 rounded-lg border border-black/15 p-1 sm:flex">
            <button type="button" aria-label={t("viewGrid")} aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")} className={`flex h-9 w-9 items-center justify-center rounded-md ${viewMode === "grid" ? "bg-brand-teal text-white" : "text-brand-teal-dark/60"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
            </button>
            <button type="button" aria-label={t("viewList")} aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")} className={`flex h-9 w-9 items-center justify-center rounded-md ${viewMode === "list" ? "bg-brand-teal text-white" : "text-brand-teal-dark/60"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-brand-teal-dark/60">{t("empty")}</p>
          <button type="button" onClick={clearFilters} className="rounded-full border border-brand-teal px-4 py-2 text-sm font-semibold text-brand-teal">{t("resetFilters")}</button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => <ProductTile key={product.id} product={product} locale={locale} />)}
        </div>
      ) : (
        <div className="mt-2 divide-y divide-black/10">
          {products.map((product) => <ProductTile key={product.id} product={product} locale={locale} variant="list" />)}
        </div>
      )}

      {filterOpen && (
        <div className="fixed inset-0 z-[70]">
          <button type="button" aria-label={t("closeFilters")} onClick={() => setFilterOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <aside role="dialog" aria-modal="true" aria-labelledby="collection-filter-title" className="absolute inset-y-0 left-0 flex w-[var(--layout-drawer-width)] max-w-[92vw] flex-col bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-5">
              <h2 id="collection-filter-title" className="text-lg font-bold text-brand-teal-dark">{t("filter")}</h2>
              <button type="button" aria-label={t("closeFilters")} onClick={() => setFilterOpen(false)} className="rounded-lg p-2 text-brand-teal-dark/70 hover:bg-brand-cream/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <label className="mb-4 flex h-12 items-center gap-3">
                <span className="shrink-0 text-sm font-semibold text-brand-teal-dark">{t("sortLabel")}</span>
                <select value={chosenSort} onChange={(event) => replaceQuery({ sort: event.target.value })} className="h-12 min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 text-sm text-brand-teal-dark">
                  {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <div className="divide-y divide-black/10">
                {filters.map((facet, index) => {
                  const isPrice = facet.type === "PRICE_RANGE";
                  const values = facet.values.map((value) => ({ ...value, parsed: toFilterInput(value.input) })).filter((value) => value.parsed);
                  return (
                    <details
                      key={facet.id}
                      open={expandedFilters[facet.id] ?? index === 0}
                      onToggle={(event) => {
                        const isOpen = event.currentTarget.open;
                        setExpandedFilters((current) => ({ ...current, [facet.id]: isOpen }));
                      }}
                      className="group"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-brand-teal-dark [&::-webkit-details-marker]:hidden">
                        {facet.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4 transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
                      </summary>
                      {isPrice ? (
                        <div className="pb-4">
                          <p className="mb-3 text-xs text-brand-teal-dark/60">{t("highestPrice", { price: new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(priceBounds.max) })}</p>
                          <div className="grid grid-cols-2 gap-3">
                            {(["min", "max"] as const).map((bound) => (
                              <label key={bound} className="flex h-12 items-center gap-2 rounded-lg border border-black/15 px-3 text-sm text-brand-teal-dark">
                                <span className="text-brand-teal-dark/55">{t(bound === "min" ? "priceFrom" : "priceTo")}</span>
                                <span>€</span>
                                <input type="number" min={priceBounds.min} max={priceBounds.max} step="0.01" value={draftPrice?.[bound] ?? (bound === "min" ? priceBounds.min : priceBounds.max)} onChange={(event) => updatePriceBound(bound, Number(event.target.value))} className="w-full min-w-0 bg-transparent text-right focus:outline-none" />
                              </label>
                            ))}
                          </div>
                          <div className="mt-4 flex gap-3">
                            {(["min", "max"] as const).map((bound) => (
                              <input key={bound} aria-label={t(bound === "min" ? "priceFrom" : "priceTo")} type="range" min={priceBounds.min} max={priceBounds.max} step="0.01" value={draftPrice?.[bound] ?? (bound === "min" ? priceBounds.min : priceBounds.max)} onChange={(event) => updatePriceBound(bound, Number(event.target.value))} className="w-full accent-brand-teal" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <ul className="space-y-3 pb-4">
                          {values.slice(0, expandedFilters[`${facet.id}:more`] ? undefined : 10).map((value) => {
                            const selected = draftFilters.some((item) => canonical(item) === canonical(value.parsed));
                            return (
                              <li key={value.id}>
                                <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-teal-dark/85">
                                  <input type="checkbox" checked={selected} onChange={() => toggleFilter(value.parsed!)} className="h-5 w-5 rounded border-black/20 accent-brand-teal" />
                                  <span className="flex-1">{value.label}</span>
                                  <span className="text-xs text-brand-teal-dark/45">{value.count}</span>
                                </label>
                              </li>
                            );
                          })}
                          {values.length > 10 && (
                            <li><button type="button" onClick={() => setExpandedFilters((current) => ({ ...current, [`${facet.id}:more`]: !current[`${facet.id}:more`] }))} className="text-sm font-semibold text-brand-teal underline underline-offset-2">{t(expandedFilters[`${facet.id}:more`] ? "showLess" : "showMore")}</button></li>
                          )}
                        </ul>
                      )}
                    </details>
                  );
                })}
                {filters.length === 0 && <p className="py-5 text-sm text-brand-teal-dark/60">{t("filtersUnavailable")}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 border-t border-black/10 bg-white px-5 py-4">
              <button type="button" onClick={clearFilters} className="flex-1 rounded-lg border border-black/15 px-4 py-3 text-sm font-semibold text-brand-teal-dark hover:bg-brand-cream/40">{t("clearFilters")}</button>
              <button type="button" onClick={applyFilters} className="flex-1 rounded-lg bg-brand-teal px-4 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark">{t("applyFilters", { count: products.length })}</button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
