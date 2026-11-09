import Image from "next/image";
import { NavMenuClient } from "@/components/NavMenuClient";
import { Link } from "@/i18n/navigation";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { AccountButton } from "@/components/account/AccountButton";
import { CartButton } from "@/components/cart/CartButton";
import { SearchForm } from "@/components/search/SearchForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WishlistHeaderButton } from "@/components/wishlist/WishlistHeaderButton";
import { collectionHandles, promoCollectionHandles } from "@/config/collections";
import { site } from "@/config/site";
import { getLocale } from "next-intl/server";
import { getNavigationEntries } from "@/lib/shopify/navigation";

export async function Header() {
  const locale = await getLocale();
  const menuEntries = await getNavigationEntries(locale.toUpperCase() as "DE" | "EN");
  // Kumaio gets its own top-level link to its existing collection (brand name, same in DE and EN) without editing the
  // Shopify menu. It sits before "Angebote", or at the end if that entry is absent. Only the header uses this list.
  const kumaioHref = `/collections/${promoCollectionHandles.kumaio}`;
  const offersIndex = menuEntries.findIndex((entry) => entry.href === `/collections/${collectionHandles.weeklySpecials}`);
  const entries = menuEntries.some((entry) => entry.href === kumaioHref)
    ? menuEntries
    : [...menuEntries.slice(0, offersIndex < 0 ? menuEntries.length : offersIndex), { id: "brand-kumaio", title: "Kumaio", href: kumaioHref, children: [] }, ...(offersIndex < 0 ? [] : menuEntries.slice(offersIndex))];
  return (
    <header className="storefront-header sticky top-0 z-40 bg-white shadow-sm">
      <div className="storefront-header-row mx-auto flex max-w-[var(--layout-max-width)] items-center gap-3 px-4 py-3 sm:gap-6 lg:h-[var(--layout-header-height)] lg:px-[var(--layout-page-padding)] lg:py-[var(--layout-header-padding)]">
        <MobileNavDrawer entries={entries} />

        <Link href="/" className="shrink-0" aria-label={site.name}>
          <Image
            src={site.logo}
            alt={site.name}
            width={1024}
            height={1024}
            priority
            className="storefront-logo h-11 w-auto sm:h-14 lg:h-12"
          />
        </Link>

        <div className="storefront-header-search hidden flex-1 items-center sm:flex">
          <SearchForm className="w-full" />
        </div>

        <div className="storefront-header-actions ml-auto flex items-center gap-1 sm:ml-0">
          <LanguageSwitcher />
          {site.features.customerAccounts && <AccountButton />}
          <WishlistHeaderButton />
          <CartButton />
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchForm />
      </div>
      <NavMenuClient entries={entries} />
    </header>
  );
}
