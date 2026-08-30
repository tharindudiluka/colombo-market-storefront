import Image from "next/image";
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

        <Link href="/" className="shrink-0" aria-label={site.name}>
          <Image
            src={site.logo}
            alt={site.name}
            width={1024}
            height={1024}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </Link>

        <div className="hidden flex-1 items-center sm:flex">
          <SearchForm className="w-full" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <button
            aria-label={t("accountLabel")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-teal-dark transition-colors hover:bg-brand-cream active:scale-95 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
          <CartButton />
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
