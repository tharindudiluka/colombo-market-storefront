import { getTranslations } from "next-intl/server";

export async function SeoContent() {
  const t = await getTranslations("seoContent");

  return (
    <section className="bg-brand-cream">
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-brand-teal-dark/80">
        <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-3 leading-relaxed">{t("paragraph1")}</p>
        <p className="mt-3 leading-relaxed">{t("paragraph2")}</p>
      </div>
    </section>
  );
}
