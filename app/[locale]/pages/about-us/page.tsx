import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { viewAllButtonClass } from "@/components/home/SectionHeader";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { delivery, formatEuro } from "@/config/delivery";
import { categoryImages } from "@/config/category-images";
import { canonicalMetadata } from "@/lib/seo";
import { pageHandles, pageHref, policyHandles, policyHref } from "@/config/pages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { ...canonicalMetadata(locale, pageHref(pageHandles.about)), title: t("metaTitle"), description: t("metaDescription") };
}

// Collection handles come from the live menu (see config/category-images.ts for the card images).
const shelves = [
  { key: "rice", handle: "reis" },
  { key: "lentils", handle: "linsen-und-bohnen" },
  { key: "spices", handle: "gewuerze" },
  { key: "flour", handle: "mehl-asiatische-fladenbrote" },
  { key: "sauces", handle: "saucen-kochzutaten" },
  { key: "snacks", handle: "snacks-suesses" },
  { key: "frozen", handle: "frozen-food" },
] as const;

const meals = [
  { key: "rice", links: [["rice", "ponni-reis"], ["lentils", "rote-linsen"], ["curry", "curry-mixtures-currymischungen"], ["coconut", "saucen-speiseole-ghee"], ["sambol", "pickles-chutney-sambol"]] },
  { key: "dal", links: [["dal", "toor-dal"], ["basmati", "basmati-reis"], ["masala", "curry-mixtures-currymischungen"], ["cardamom", "kardamom"], ["papadam", "papadams"]] },
] as const;

const eyebrow = "text-xs font-bold uppercase tracking-[0.16em] text-brand-teal";
const h2 = "mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-teal-dark sm:text-4xl";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-teal px-6 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-brand-teal-dark hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none";
const chevron = (
  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
);
const factIcon = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-5 w-5", "aria-hidden": true };

export default async function AboutUsPage() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const threshold = formatEuro(delivery.freeShippingThreshold, locale);
  const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

  const facts = [
    { key: "location", icon: <svg {...factIcon}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg> },
    { key: "delivery", icon: <svg {...factIcon}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg> },
    { key: "pickup", icon: <svg {...factIcon}><path d="M4 9l1.5-5h13L20 9M4 9h16M4 9v11h16V9M9 20v-6h6v6" /></svg> },
  ] as const;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Breadcrumbs currentPath={pageHref(pageHandles.about)} items={[{ label: t("title") }]} />

        {/* Opening: who we are, what shoppers can find, where we are, with two clear next steps. */}
        <section className="bg-brand-cream">
          <div className="mx-auto grid max-w-[var(--layout-max-width)] items-center gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
            <div>
              <p className={eyebrow}>{t("eyebrow")}</p>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-teal-dark sm:text-5xl lg:text-6xl">{t("heroTitle")}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">{t("heroBody")}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/collections" className={primaryButton}>{t("heroBrowse")}{chevron}</Link>
                <a href="#visit" className={`${viewAllButtonClass} justify-center`}>{t("heroVisit")}</a>
              </div>
            </div>
            <Image
              src={site.storefrontImage.src}
              width={site.storefrontImage.width}
              height={site.storefrontImage.height}
              alt={t("photoAlt")}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-auto w-full rounded-2xl border border-neutral-200 object-cover shadow-md"
            />
          </div>
          <div className="border-t border-neutral-200/80 bg-white/60">
            <ul className="mx-auto grid max-w-[var(--layout-max-width)] gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4 sm:py-4">
              {facts.map((fact) => (
                <li key={fact.key} className="flex items-center gap-3 py-1.5 text-sm font-semibold text-neutral-800">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">{fact.icon}</span>
                  <span>{t(`facts.${fact.key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Short introduction in a comfortable reading column. */}
        <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className={eyebrow}>{t("introEyebrow")}</p>
              <h2 className={h2}>{t("introTitle")}</h2>
            </div>
            <div className="max-w-2xl space-y-5 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              <p>{t("introOne")}</p>
              <p>{t("introTwo")}</p>
              <p>{t("introThree")}</p>
            </div>
          </div>
        </section>

        {/* What shoppers can find: linked collection cards. */}
        <section aria-labelledby="about-shelves" className="border-y border-neutral-200 bg-brand-cream/60 py-14 sm:py-20">
          <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
            <div className="max-w-2xl">
              <p className={eyebrow}>{t("shelvesEyebrow")}</p>
              <h2 id="about-shelves" className={h2}>{t("shelvesTitle")}</h2>
              <p className="mt-4 text-base leading-7 text-neutral-700 sm:text-lg">{t("shelvesBody")}</p>
            </div>
            <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {shelves.map(({ key, handle }) => {
                const image = categoryImages[handle];
                return (
                  <li key={key}>
                    <Link
                      href={`/collections/${handle}`}
                      className="group flex h-full gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-col sm:gap-0 sm:p-0"
                    >
                      {image && (
                        <Image
                          src={image.src}
                          width={image.width}
                          height={image.height}
                          alt=""
                          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 96px"
                          className="h-24 w-24 shrink-0 rounded-lg object-contain sm:h-auto sm:w-full sm:rounded-none"
                        />
                      )}
                      <span className="flex min-w-0 flex-1 flex-col sm:p-5">
                        <span className="font-heading text-lg font-extrabold leading-snug text-brand-teal-dark">{t(`shelves.${key}.title`)}</span>
                        <span className="mt-1.5 text-sm leading-6 text-neutral-600">{t(`shelves.${key}.body`)}</span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-brand-teal-dark transition-colors group-hover:text-brand-teal">
                          {t("shelfCta")}
                          {chevron}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Concrete examples: two meals built from the current assortment. */}
        <section aria-labelledby="about-meals" className="mx-auto max-w-[var(--layout-max-width)] px-4 py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className={eyebrow}>{t("mealsEyebrow")}</p>
            <h2 id="about-meals" className={h2}>{t("mealsTitle")}</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2 lg:gap-6">
            {meals.map((meal) => (
              <article key={meal.key} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">{t(`meals.${meal.key}.title`)}</h3>
                <p className="mt-3 text-base leading-7 text-neutral-700">{t(`meals.${meal.key}.body`)}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {meal.links.map(([label, handle]) => (
                    <li key={label}>
                      <Link
                        href={`/collections/${handle}`}
                        className="inline-flex min-h-11 items-center rounded-full border border-brand-teal/30 bg-white px-4 text-sm font-semibold text-brand-teal-dark transition duration-200 hover:border-brand-teal hover:bg-brand-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none"
                      >
                        {t(`meals.${meal.key}.links.${label}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Practical: ordering online and visiting the shop. */}
        <section id="visit" aria-labelledby="about-visit" className="scroll-mt-28 border-t border-neutral-200 bg-brand-cream/60 py-14 sm:py-20">
          <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
            <div className="max-w-2xl">
              <p className={eyebrow}>{t("visitEyebrow")}</p>
              <h2 id="about-visit" className={h2}>{t("visitTitle")}</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2 lg:gap-6">
              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">{t("orderTitle")}</h3>
                <p className="mt-3 text-base leading-7 text-neutral-700">{t("orderBody", { threshold })}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-auto lg:pt-6">
                  <Link href="/collections" className={primaryButton}>{t("shopCta")}{chevron}</Link>
                  <Link href={policyHref(policyHandles.shipping)} className={`${viewAllButtonClass} justify-center`}>{t("orderCta")}</Link>
                </div>
              </article>

              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">{t("storeTitle")}</h3>
                <p className="mt-3 text-base leading-7 text-neutral-700">{t("storeBody")}</p>
                <address className="mt-5 space-y-1 text-base not-italic leading-7 text-neutral-800">
                  <span className="block font-bold text-brand-teal-dark">{site.name}</span>
                  <span className="block">{address}</span>
                  <span className="block">{locale === "de" ? "Deutschland" : site.address.country}</span>
                </address>
                <dl className="mt-4 grid gap-1 text-base leading-7">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <dt className="font-semibold text-neutral-800">{t("phoneLabel")}:</dt>
                    <dd><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center font-semibold text-brand-teal-dark underline underline-offset-4 hover:text-brand-teal focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{site.contact.phone}</a></dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <dt className="font-semibold text-neutral-800">{t("emailLabel")}:</dt>
                    <dd className="min-w-0 break-all"><a href={`mailto:${site.contact.email}`} className="inline-flex min-h-11 items-center font-semibold text-brand-teal-dark underline underline-offset-4 hover:text-brand-teal focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{site.contact.email}</a></dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-auto lg:pt-6">
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={primaryButton}>{t("directions")}{chevron}</a>
                  <Link href="/contact" className={`${viewAllButtonClass} justify-center`}>{t("contactCta")}</Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
