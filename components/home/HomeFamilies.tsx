import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Link } from "@/i18n/navigation";
import type { homeFamilies } from "@/config/home-families";

export async function HomeFamilies({ families }: { families: readonly (typeof homeFamilies)[number][] }) {
  const t = await getTranslations("homePage.families");
  if (!families.length) return null;

  return (
    <section aria-labelledby="home-families-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-10 sm:pb-12">
      <div className="mt-8 border-t border-neutral-200 pt-8 sm:mt-10 sm:pt-10">
        <SectionHeader id="home-families-title" title={t("title")} subtitle={t("subtitle")} />
        <ul className="mt-3 flex flex-wrap gap-2">
          {families.map((family) => (
            <li key={family.handle}>
              <Link href={`/collections/${family.handle}`} className="inline-flex min-h-11 items-center rounded-full border border-brand-teal/30 bg-white px-5 py-2 text-sm font-semibold text-brand-teal-dark shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-teal hover:bg-brand-teal hover:text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                {t(`items.${family.labelKey}`)}
              </Link>
            </li>
          ))}
        </ul>
        </div>
    </section>
  );
}
