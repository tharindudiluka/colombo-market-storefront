import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeCategoryLinksClient } from "@/components/home/HomeCategoryLinksClient";
import { viewAllButtonClass } from "@/components/home/SectionHeader";
import { categoryImages } from "@/config/category-images";
import type { CategoryCard } from "@/lib/catalog/categories-page";

/** Link tree of the department structure (user-facing and crawlable): cards on desktop, accordion on phones. */
export async function HomeCategoryLinks({ categories }: { categories: CategoryCard[] }) {
  const t = await getTranslations("homePage.links");
  const tNav = await getTranslations("nav");
  const tCat = await getTranslations("categoriesPage");
  const viewAllLabels = Object.fromEntries(categories.map((category) => [category.id, tNav("viewAllCategory", { category: category.title })]));
  // Short department line and collage thumbnail per card (both optional; cards stay complete without them).
  const extras = Object.fromEntries(
    categories.map((category) => [
      category.id,
      {
        description: tCat.has(`descriptions.${category.handle}`) ? tCat(`descriptions.${category.handle}`) : null,
        image: categoryImages[category.handle] ?? null,
      },
    ]),
  );

  return (
    <section aria-labelledby="home-links-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="home-links-title" className="flex items-center gap-2.5 text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[22px]">
          <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-brand-teal" />
          {t("title")}
        </h2>
        <Link href="/collections" className={viewAllButtonClass}>
          {t("all")}
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <HomeCategoryLinksClient categories={categories} viewAllLabels={viewAllLabels} extras={extras} />
    </section>
  );
}
