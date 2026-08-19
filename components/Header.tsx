import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { site } from "@/config/site";

export async function Header() {
  const t = await getTranslations("header");

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center gap-3 px-4 py-3 sm:gap-6">
        <MobileNavDrawer />

        <Link href="/" className="shrink-0">
          <span className="font-heading rounded-md bg-brand-teal px-3 py-1.5 text-base font-extrabold tracking-wide text-white sm:text-lg">
            {site.wordmark}
          </span>
        </Link>

        <div className="hidden flex-1 items-center sm:flex">
          <div className="flex w-full items-center rounded-full border border-black/10 bg-brand-cream px-4 py-2">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/50 focus:outline-none"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5 shrink-0 text-brand-teal-dark/70">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 sm:ml-0">
          <button aria-label={t("accountLabel")} className="text-brand-teal-dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
          <button aria-label={t("cartLabel")} className="relative text-brand-teal-dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-terracotta text-[10px] font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-black/5 px-4 pb-3 pt-1 sm:hidden">
        <div className="flex items-center rounded-full border border-black/10 bg-brand-cream px-4 py-2">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/50 focus:outline-none"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5 shrink-0 text-brand-teal-dark/70">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </header>
  );
}
