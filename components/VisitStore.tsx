import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function VisitStore() {
  const t = await getTranslations("visitStore");

  return (
    <section className="bg-brand-cream/70 py-10 sm:py-12 lg:py-16">
      <div className="mx-auto grid max-w-[var(--layout-max-width)] items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
        <Image
          src={site.storefrontImage.src}
          width={site.storefrontImage.width}
          height={site.storefrontImage.height}
          alt={t("imageAlt")}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full rounded-xl"
        />

        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-widest text-brand-teal-dark/80 sm:text-sm">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-brand-teal-dark sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-teal-dark/80">
            {t("body")}
          </p>
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
