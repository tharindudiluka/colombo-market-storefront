import { getTranslations } from "next-intl/server";
import { brands } from "@/lib/content/brands";

export async function BrandStrip() {
  const t = await getTranslations("brandStrip");

  return (
    <section className="bg-brand-cream py-6">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-teal-dark/60">
          {t("title")}
        </p>
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          {brands.map((brand) => (
            <span
              key={brand}
              className="shrink-0 rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-teal-dark"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
