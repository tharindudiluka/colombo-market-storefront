import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { AccountButton } from "@/components/account/AccountButton";
import { CartButton } from "@/components/cart/CartButton";
import { SearchForm } from "@/components/search/SearchForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WishlistHeaderButton } from "@/components/wishlist/WishlistHeaderButton";
import { site } from "@/config/site";
import { getLocale } from "next-intl/server";
import { getNavigationCollections } from "@/lib/shopify/navigation";

export async function Header() {
  const locale = await getLocale();
  const collections = await getNavigationCollections(locale.toUpperCase() as "DE" | "EN");
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center gap-3 px-4 py-3 sm:gap-6">
        <MobileNavDrawer collections={collections} />

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
          <LanguageSwitcher className="hidden sm:flex" />
          <AccountButton />
          <WishlistHeaderButton />
          <CartButton />
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
