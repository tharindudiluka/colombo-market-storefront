import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { categoryIcons, categoryTones } from "@/lib/content/categories";
import type { UiCategory } from "@/lib/shopify/mappers";

export async function CategoryGrid({ categories }: { categories: UiCategory[] }) {
  const t = await getTranslations();
  const desktopColumns = categories.length >= 13 ? "lg:grid-cols-6 xl:grid-cols-7" : categories.length >= 10 ? "lg:grid-cols-6" : "lg:grid-cols-4";

  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 sm:py-12" aria-labelledby="category-grid-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="category-grid-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
        {t("categoryGrid.title")}
      </h2>
      <Link href="/collections" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-teal/25 px-5 py-2 text-sm font-semibold text-brand-teal-dark transition hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-brand-teal">{t("categoryGrid.viewAll")} <span aria-hidden>→</span></Link>
      </div>

      <div className={`mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-teal/15 bg-white/90 sm:grid-cols-3 ${desktopColumns}`}>
        {categories.map((cat) => (
          <Link
            key={cat.handle}
            href={`/collections/${cat.handle}`}
            className="group flex min-h-52 min-w-0 flex-col items-center justify-start gap-4 border-b border-r border-brand-teal/15 bg-white/90 px-4 py-7 text-center transition-colors hover:bg-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-teal sm:min-h-56 sm:px-6 sm:py-8"
          >
            <span aria-hidden className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 sm:h-20 sm:w-20 ${categoryTones[cat.handle] ?? "bg-category-sage text-brand-teal-dark"}`}>
              <Icon name={categoryIcons[cat.handle] ?? "spice"} className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            <span className="min-h-10 max-w-full text-sm font-semibold leading-5 text-brand-teal-dark sm:text-base sm:leading-6">
              {cat.title || t(`nav.${cat.handle}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
