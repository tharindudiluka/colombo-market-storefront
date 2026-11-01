import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { SectionHeader, viewAllLinkClass } from "@/components/home/SectionHeader";
import { Link } from "@/i18n/navigation";
import { categoryImages } from "@/config/category-images";
import { homepageCategoryPresentation } from "@/lib/content/homepage-categories";
import type { CategoryCard } from "@/lib/catalog/categories-page";

/**
 * Category cards. Every card has the same square image area, a title band and a whole-card link. Purpose-built category
 * images (config/category-images.ts) fill the square; until then the best product packshot is shown contained.
 */
export async function HomeCategoryShortcuts({ categories }: { categories: CategoryCard[] }) {
  const t = await getTranslations("homePage.shortcuts");

  return (
    <section aria-labelledby="home-shortcuts-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-7">
      <SectionHeader id="home-shortcuts-title" title={t("title")}>
        <Link href="/collections" className={viewAllLinkClass}>{t("all")} <span aria-hidden>→</span></Link>
      </SectionHeader>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
        {categories.map((category, index) => {
          const custom = categoryImages[category.handle];
          const packshot = category.images[0];
          const presentation = homepageCategoryPresentation[category.handle];
          return (
            <li key={category.id}>
              <Link
                href={`/collections/${category.handle}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors hover:border-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
              >
                <span className="relative block aspect-square bg-white">
                  {custom ? (
                    <Image src={custom.src} alt="" width={custom.width} height={custom.height} sizes="(min-width: 1280px) 160px, (min-width: 640px) 22vw, 30vw" className="h-full w-full object-contain" />
                  ) : packshot ? (
                    <Image
                      src={packshot.url}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 160px, (min-width: 640px) 22vw, 30vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      className="object-contain p-3 transition-transform duration-200 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className={`absolute inset-0 flex items-center justify-center ${presentation?.tone ?? "bg-category-sage text-brand-teal-dark"}`}>
                      <HomepageCategoryIcon name={presentation?.icon ?? "leaf"} className="h-10 w-10" />
                    </span>
                  )}
                </span>
                <span className="flex min-h-[2.9rem] flex-1 items-center justify-center bg-brand-cta px-2 py-1.5 text-center text-xs font-semibold leading-snug text-white transition-colors group-hover:bg-brand-teal-dark sm:text-[13px]">
                  <span className="line-clamp-2">{category.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
