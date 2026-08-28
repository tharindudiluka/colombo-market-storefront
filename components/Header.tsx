import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { CartButton } from "@/components/cart/CartButton";
import { SearchForm } from "@/components/search/SearchForm";
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
          <SearchForm className="w-full" />
        </div>

        <div className="ml-auto flex items-center gap-4 sm:ml-0">
          <button aria-label={t("accountLabel")} className="text-brand-teal-dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
          <CartButton />
        </div>
      </div>

      <div className="border-t border-black/5 px-4 pb-3 pt-1 sm:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
