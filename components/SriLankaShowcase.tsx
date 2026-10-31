import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductTile } from "@/components/ProductTile";
import { sriLankaCollectionHandle, sriLankaShortcuts } from "@/config/sri-lanka";
import type { UiProduct } from "@/lib/shopify/mappers";

export async function SriLankaShowcase({ products }: { products: UiProduct[] }) {
  const t = await getTranslations("categoriesPage.sriLanka");
  const locale = await getLocale();
  if (!products.length) return null;

  return (
    <section id="sri-lanka" aria-labelledby="sri-lanka-title" className="mx-auto max-w-[var(--layout-max-width)] scroll-mt-40 px-4 pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-3xl border border-brand-teal-dark/20">
        <div className="relative isolate overflow-hidden bg-brand-teal-dark px-5 py-8 text-white sm:px-10 sm:py-12">
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full border-[28px] border-white/5" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-24 -z-10 h-56 w-56 rounded-full border-[24px] border-brand-gold/10" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">{t("eyebrow")}</p>
          <h2 id="sri-lanka-title" className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/85">{t("body")}</p>
          <nav aria-label={t("shortcutsLabel")} className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {sriLankaShortcuts.map((shortcut) => (
                <li key={shortcut.handle}>
                  <Link href={`/collections/${shortcut.handle}`} className="inline-flex min-h-10 items-center rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    {t(`shortcuts.${shortcut.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="bg-white px-4 py-8 sm:px-8 sm:py-10">
          <h3 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">{t("productsTitle")}</h3>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id} className="min-w-0"><ProductTile product={product} locale={locale} /></li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-brand-teal/10 pt-6">
            <p className="max-w-md text-xs leading-5 text-brand-teal-dark/60">{t("note")}</p>
            <Link href={`/collections/${sriLankaCollectionHandle}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-teal px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
              {t("cta")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
