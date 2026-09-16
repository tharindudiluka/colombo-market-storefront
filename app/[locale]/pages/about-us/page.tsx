import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutUsPage() {
  const t = await getTranslations("about");
  const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />
      <main className="flex-1 pb-12 sm:pb-16">
        <Breadcrumbs items={[{ label: t("title") }]} />

        <section className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-10">
          <div className="relative isolate min-h-[32rem] overflow-hidden rounded-2xl bg-brand-teal-dark sm:min-h-[37.5rem]">
            <Image
              src="/about-market-hero.png"
              alt={t("heroImageAlt")}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[68%_center]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-brand-teal-dark via-brand-teal-dark/80 to-brand-teal-dark/15" />
            <div className="relative flex min-h-[32rem] max-w-2xl flex-col justify-end px-6 py-8 text-white sm:min-h-[37.5rem] sm:px-12 sm:py-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">{t("eyebrow")}</p>
              <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-6xl">{t("heroTitle")}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{t("heroBody")}</p>
              <Link
                href="/collections"
                className="mt-7 inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-teal-dark transition hover:bg-brand-cream"
              >
                {t("heroCta")}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[var(--layout-max-width)] gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terracotta">{t("storyEyebrow")}</p>
          <div>
            <h2 className="max-w-3xl font-heading text-3xl font-extrabold tracking-tight text-brand-teal-dark sm:text-5xl">
              {t("storyTitle")}
            </h2>
            <div className="mt-7 grid max-w-3xl gap-5 text-base leading-7 text-brand-teal-dark/75 sm:text-lg sm:leading-8">
              <p>{t("storyOne")}</p>
              <p>{t("storyTwo")}</p>
              <p>{t("storyThree")}</p>
              <p>{t("storyFour")}</p>
              <p>{t("storyFive")}</p>
              <p>{t("storySix")}</p>
              <p>{t("storySeven")}</p>
              <p>{t("storyEight")}</p>
            </div>
          </div>
        </section>

        <section className="bg-brand-cream/60 py-14 sm:py-20">
          <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terracotta">{t("valuesEyebrow")}</p>
              <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-brand-teal-dark sm:text-5xl">
                {t("valuesTitle")}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {(["care", "discovery", "community"] as const).map((value, index) => (
                <article key={value} className="glass p-6 sm:p-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-sm font-extrabold text-white">
                    0{index + 1}
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-extrabold text-brand-teal-dark">{t(`values.${value}.title`)}</h3>
                  <p className="mt-3 leading-7 text-brand-teal-dark/70">{t(`values.${value}.body`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[var(--layout-max-width)] gap-8 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center sm:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terracotta">{t("visitEyebrow")}</p>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-brand-teal-dark sm:text-5xl">{t("visitTitle")}</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-teal-dark/75 sm:text-lg sm:leading-8">{t("visitBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-brand-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-teal-dark">
                {t("directions")}
              </a>
              <Link href="/contact" className="rounded-full border border-brand-teal px-5 py-3 text-sm font-bold text-brand-teal-dark transition hover:bg-brand-teal hover:text-white">
                {t("contactCta")}
              </Link>
            </div>
          </div>
          <aside className="glass p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terracotta">{t("storeLabel")}</p>
            <p className="mt-5 font-heading text-2xl font-extrabold text-brand-teal-dark">{site.name}</p>
            <address className="mt-3 not-italic text-base leading-7 text-brand-teal-dark/75">
              {address}<br />{site.address.country}
            </address>
            <p className="mt-6 border-t border-brand-teal-dark/10 pt-5 text-sm leading-6 text-brand-teal-dark/70">{t("storeNote")}</p>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
