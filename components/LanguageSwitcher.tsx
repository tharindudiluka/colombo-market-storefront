"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

const locales = ["de", "en"] as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as (typeof locales)[number];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");

  return (
    <div className={`flex items-center rounded-full border border-black/10 bg-white/60 p-0.5 ${className}`} aria-label={t("label")} role="group">
      {locales.map((targetLocale) => {
        const active = targetLocale === locale;
        return (
          <button
            key={targetLocale}
            type="button"
            aria-pressed={active}
            onClick={() => {
              const query = Object.fromEntries(searchParams.entries());
              router.replace(
                Object.keys(query).length > 0 ? { pathname, query } : pathname,
                { locale: targetLocale }
              );
            }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
              active ? "bg-brand-teal text-white" : "text-brand-teal-dark/70 hover:bg-brand-cream"
            }`}
          >
            {t(targetLocale)}
          </button>
        );
      })}
    </div>
  );
}
