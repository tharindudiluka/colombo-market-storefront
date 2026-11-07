import { getLocale, getTranslations } from "next-intl/server";
import { delivery, formatEuro } from "@/config/delivery";

/** Short editorial intro (one H2, two paragraphs); the only place the homepage spells out the offer in running text. */
export async function HomeIntro() {
  const t = await getTranslations("homePage.intro");
  const locale = await getLocale();
  const values = { threshold: formatEuro(delivery.freeShippingThreshold, locale), rate: formatEuro(delivery.flatShippingRate, locale) };

  return (
    <section aria-labelledby="home-intro-title" className="border-t border-neutral-200 bg-brand-cream/60">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:py-14">
        <h2 id="home-intro-title" className="text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-2xl">{t("title")}</h2>
        <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-[15px] sm:leading-7">{t("p1")}</p>
        <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-[15px] sm:leading-7">{t("p2", values)}</p>
      </div>
    </section>
  );
}
