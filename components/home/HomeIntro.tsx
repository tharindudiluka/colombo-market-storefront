import { getLocale, getTranslations } from "next-intl/server";
import { delivery, formatEuro } from "@/config/delivery";

/** Short editorial intro (one H2, two paragraphs); the only place the homepage spells out the offer in running text. */
export async function HomeIntro() {
  const t = await getTranslations("homePage.intro");
  const locale = await getLocale();
  const values = { threshold: formatEuro(delivery.freeShippingThreshold, locale), rate: formatEuro(delivery.flatShippingRate, locale) };

  return (
    <section aria-labelledby="home-intro-title" className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
        <h2 id="home-intro-title" className="text-lg font-bold leading-tight text-neutral-900 sm:text-xl">{t("title")}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-neutral-700 sm:text-[15px] sm:leading-7">{t("p1")}</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-neutral-700 sm:text-[15px] sm:leading-7">{t("p2", values)}</p>
      </div>
    </section>
  );
}
