import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Link } from "@/i18n/navigation";
import type { homeFamilies } from "@/config/home-families";

export async function HomeFamilies({ families }: { families: readonly (typeof homeFamilies)[number][] }) {
  const t = await getTranslations("homePage.families");
  if (!families.length) return null;

  return (
    <section aria-labelledby="home-families-title" className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-8 pt-7 sm:pb-10 sm:pt-8">
      <SectionHeader id="home-families-title" title={t("title")} subtitle={t("subtitle")} />
      <ul className="mt-3 flex flex-wrap gap-2">
        {families.map((family) => (
          <li key={family.handle}>
            <Link href={`/collections/${family.handle}`} className="inline-flex min-h-11 items-center rounded-full bg-brand-cta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta">
              {t(`items.${family.labelKey}`)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
