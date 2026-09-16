"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function NotFoundState() {
  const t = useTranslations("routeState.notFound");
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-terracotta">404</p>
      <h1 className="font-heading mt-3 text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-base leading-7 text-brand-teal-dark/70">{t("body")}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark">
          {t("home")}
        </Link>
        <Link href="/collections" className="rounded-full border border-brand-teal px-5 py-3 text-sm font-bold text-brand-teal-dark hover:bg-brand-cream">
          {t("collections")}
        </Link>
      </div>
    </main>
  );
}

export function ErrorState({ reset }: { reset: () => void }) {
  const t = useTranslations("routeState.error");
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-terracotta">!</p>
      <h1 className="font-heading mt-3 text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-base leading-7 text-brand-teal-dark/70">{t("body")}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-brand-teal px-5 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark">
          {t("retry")}
        </button>
        <Link href="/" className="rounded-full border border-brand-teal px-5 py-3 text-sm font-bold text-brand-teal-dark hover:bg-brand-cream">
          {t("home")}
        </Link>
      </div>
    </main>
  );
}

export function LoadingState() {
  const t = useTranslations("routeState.loading");
  return (
    <main className="mx-auto w-full max-w-[var(--layout-max-width)] px-4 py-6 sm:py-8" aria-busy="true" aria-label={t("label")}>
      <div role="status" className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2" aria-hidden="true">
          <div className="skeleton-shimmer h-3 w-16 rounded-full" />
          <div className="skeleton-shimmer h-3 w-3 rounded-full" />
          <div className="skeleton-shimmer h-3 w-24 rounded-full" />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-teal-dark/10 pb-5" aria-hidden="true">
          <div className="skeleton-shimmer h-9 w-56 max-w-[70vw] rounded-lg sm:h-11 sm:w-72" />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-11 w-28 rounded-lg sm:w-32" />
            <div className="skeleton-shimmer h-11 w-36 rounded-lg sm:w-44" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-brand-teal-dark/10 bg-white/75 shadow-sm">
              <div className="skeleton-shimmer aspect-[4/3] w-full" />
              <div className="space-y-3 p-3 sm:p-4">
                <div className="skeleton-shimmer h-3 w-2/5 rounded-full" />
                <div className="skeleton-shimmer h-4 w-full rounded-full" />
                <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
                <div className="flex items-center justify-between pt-1">
                  <div className="skeleton-shimmer h-5 w-16 rounded-full" />
                  <div className="skeleton-shimmer h-9 w-9 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">{t("label")}</p>
    </main>
  );
}
