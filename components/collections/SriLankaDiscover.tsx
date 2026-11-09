import { getLocale, getTranslations } from "next-intl/server";
import { HomeProductRow } from "@/components/home/HomeProductRow";
import { Link } from "@/i18n/navigation";
import { sriLankaAllHandle } from "@/config/sri-lanka";
import type { SriLankaCollection } from "@/lib/catalog/sri-lanka-collection";

/**
 * "Discover Sri Lanka": the CURRENT live Sri Lankan collection as a product carousel, with shortcuts to the
 * sub-collections that actually contain Sri Lankan products. Rendered on its own light surface to stand out cleanly.
 */
export async function SriLankaDiscover({ data }: { data: SriLankaCollection }) {
  const t = await getTranslations("categoriesPage.sriLanka");
  const tp = await getTranslations("homePage.rows");
  const locale = await getLocale();

  const chips = (
    <nav aria-label={t("shortcutsLabel")} className="mt-3">
      <ul className="flex flex-wrap gap-1.5">
        {data.shortcuts.map((shortcut) => (
          <li key={shortcut.handle}>
            <Link
              href={`/collections/${shortcut.handle}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 text-[13px] font-semibold text-neutral-800 transition-colors hover:border-brand-cta hover:bg-brand-cta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              {t(`shortcuts.${shortcut.labelKey}`)}
              <span className="text-xs font-normal opacity-70">{shortcut.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div id="sri-lanka" data-nav-section="sri-lanka" className="mt-10 scroll-mt-44 border-y border-neutral-200 bg-neutral-50 pb-8 pt-6 sm:mt-12 sm:pb-10 sm:pt-8">
      <HomeProductRow
        bare
        id="sri-lanka-title"
        title={t("title")}
        subtitle={t("subtitle")}
        intro={data.shortcuts.length ? chips : undefined}
        href={`/collections/${sriLankaAllHandle}`}
        viewAll={t("cta")}
        previous={tp("previous")}
        next={tp("next")}
        locale={locale}
        products={data.products}
      />
    </div>
  );
}
