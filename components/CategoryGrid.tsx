import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { categoryIcons } from "@/lib/content/categories";
import type { UiCategory } from "@/lib/shopify/mappers";

export async function CategoryGrid({ categories }: { categories: UiCategory[] }) {
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8">
      <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">
        {t("categoryGrid.title")}
      </h2>

      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible lg:grid-cols-7">
        {categories.map((cat) => (
          <Link
            key={cat.handle}
            href={`/collections/${cat.handle}`}
            className="flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-full"
          >
            <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-cream text-brand-teal">
              {cat.image ? (
                <Image src={cat.image.url} alt={cat.image.alt} fill sizes="64px" className="object-cover" />
              ) : (
                <Icon name={categoryIcons[cat.handle] ?? "spice"} className="h-7 w-7" />
              )}
            </span>
            <span className="text-xs font-semibold text-brand-teal-dark">
              {cat.title || t(`nav.${cat.handle}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
