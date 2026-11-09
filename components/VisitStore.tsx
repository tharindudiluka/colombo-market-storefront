import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function VisitStore() {
  const t = await getTranslations("visitStore");

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-8 sm:py-10">
      <div className="mx-auto grid max-w-[var(--layout-max-width)] items-center gap-8 px-4 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <Image
          src={site.storefrontImage.src}
          width={site.storefrontImage.width}
          height={site.storefrontImage.height}
          alt={t("imageAlt")}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full rounded-lg"
        />

        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-teal-dark/80 sm:text-sm">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-heading text-xl font-extrabold leading-tight text-brand-teal-dark sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-teal-dark/80 sm:text-base">
            {t("body")}
          </p>
          <p className="mt-4 text-base font-semibold text-brand-teal-dark">{t("pickup")}</p>
          <address className="mt-6 text-base leading-relaxed not-italic text-brand-teal-dark">
            <span className="block font-bold">{t("storeName")}</span>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block underline decoration-brand-teal-dark/30 underline-offset-4 transition-colors hover:text-brand-teal focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              {t("address")}
            </a>
          </address>
        </div>
      </div>
    </section>
  );
}
