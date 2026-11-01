import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CategoryCard } from "@/lib/catalog/categories-page";

/** Plain, server-rendered link tree of the department structure (user-facing and crawlable). */
export async function HomeCategoryLinks({ categories }: { categories: CategoryCard[] }) {
  const t = await getTranslations("homePage.links");

  return (
    <section aria-labelledby="home-links-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="home-links-title" className="text-lg font-bold text-neutral-900 sm:text-xl">{t("title")}</h2>
        <Link href="/collections" className="inline-flex min-h-11 items-center text-sm font-bold text-brand-teal hover:text-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
          {t("all")} <span aria-hidden className="ml-2">→</span>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="font-heading text-base font-extrabold text-brand-teal-dark">
              <Link href={`/collections/${category.handle}`} className="inline-flex min-h-10 items-center hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{category.title}</Link>
            </h3>
            {category.subs.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {category.subs.map((sub) => (
                  <li key={sub.id}>
                    <Link href={`/collections/${sub.handle}`} className="inline-flex min-h-9 items-center text-sm text-brand-teal-dark/75 hover:text-brand-teal-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{sub.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
