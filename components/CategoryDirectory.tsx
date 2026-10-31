import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { homepageCategoryPresentation } from "@/lib/content/homepage-categories";
import type { CategoryCard } from "@/lib/catalog/categories-page";

const chip = "inline-flex min-h-10 items-center rounded-full border border-brand-teal/20 bg-white px-3.5 py-1.5 text-sm font-medium text-brand-teal-dark transition-colors hover:border-brand-teal/50 hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

export async function CategoryDirectory({ categories }: { categories: CategoryCard[] }) {
  const t = await getTranslations("categoriesPage");
  const tc = await getTranslations("collection");

  return (
    <section aria-labelledby="directory-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10 sm:py-12">
      <h2 id="directory-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">{t("directoryTitle")}</h2>
      <ul className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const presentation = homepageCategoryPresentation[category.handle];
          const description = t.has(`descriptions.${category.handle}`) ? t(`descriptions.${category.handle}`) : null;
          return (
            <li key={category.id} id={`cat-${category.handle}`} className="flex scroll-mt-40">
              <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-brand-teal/15 bg-white">
                <Link href={`/collections/${category.handle}`} tabIndex={-1} aria-hidden="true" className="block bg-brand-cream p-3">
                  {category.images.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {category.images.map((image) => (
                        <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                          <Image src={image.url} alt="" fill sizes="(min-width: 1280px) 100px, (min-width: 768px) 14vw, 28vw" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex aspect-[3/1] items-center justify-center">
                      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${presentation?.tone ?? "bg-category-sage text-brand-teal-dark"}`}>
                        <HomepageCategoryIcon name={presentation?.icon ?? "leaf"} className="h-9 w-9" />
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div>
                    <h3 className="font-heading text-xl font-extrabold leading-tight text-brand-teal-dark">
                      <Link href={`/collections/${category.handle}`} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{category.title}</Link>
                    </h3>
                    {category.productCount !== null && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-teal-dark/55">{tc("productCount", { count: category.productCount })}</p>}
                    {description && <p className="mt-2 text-sm leading-6 text-brand-teal-dark/75">{description}</p>}
                  </div>
                  {category.subs.length > 0 && (
                    <nav aria-label={t("subLabel", { category: category.title })} className="mt-auto">
                      <ul className="flex flex-wrap gap-2">
                        {category.subs.map((sub) => (
                          <li key={sub.id}><Link href={`/collections/${sub.handle}`} className={chip}>{sub.title}</Link></li>
                        ))}
                      </ul>
                    </nav>
                  )}
                  <Link href={`/collections/${category.handle}`} className={`${category.subs.length ? "" : "mt-auto"} inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand-teal hover:text-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal`}>
                    {t("viewAll", { category: category.title })} <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
