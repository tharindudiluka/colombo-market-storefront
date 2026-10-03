import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { homepageCategoryPresentation } from "@/lib/content/homepage-categories";
import type { UiCategory } from "@/lib/shopify/mappers";

export async function CategoryGrid({ categories }: { categories: UiCategory[] }) {
  const t = await getTranslations();


  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 sm:py-12" aria-labelledby="category-grid-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="category-grid-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">
        {t("categoryGrid.title")}
      </h2>
      <Link href="/collections" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-teal/25 px-5 py-2 text-sm font-semibold text-brand-teal-dark transition hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-brand-teal">{t("categoryGrid.viewAll")} <span aria-hidden>→</span></Link>
      </div>

      <div className="homepage-category-grid mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-teal/15 bg-white/90 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.handle}
            href={`/collections/${cat.handle}`}
            className="group flex h-36 min-w-0 flex-col items-center justify-center gap-2 border-b border-r border-brand-teal/15 bg-white/90 px-3 py-3 text-center transition-colors hover:bg-brand-cream/40 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-teal sm:h-38 sm:px-4"
          >
            <span aria-hidden className={`flex h-17 w-17 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${homepageCategoryPresentation[cat.handle]?.tone ?? "bg-category-sage text-brand-teal-dark"}`}>
              <HomepageCategoryIcon name={homepageCategoryPresentation[cat.handle]?.icon ?? "leaf"} className="h-10 w-10" />
            </span>
            <span className="min-h-10 max-w-full text-sm font-semibold leading-5 text-brand-teal-dark sm:text-base sm:leading-6">
              {cat.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
