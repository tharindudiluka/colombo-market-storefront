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
    <main className="mx-auto w-full max-w-[var(--layout-max-width)] px-4 py-8" aria-busy="true" aria-label={t("label")}>
      <div className="animate-pulse space-y-5">
        <div className="h-8 w-48 rounded-full bg-brand-cream" />
        <div className="h-56 rounded-3xl bg-brand-cream/70 sm:h-80" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="aspect-[3/4] rounded-2xl bg-brand-cream/70" />
          ))}
        </div>
      </div>
      <p className="sr-only">{t("label")}</p>
    </main>
  );
}
