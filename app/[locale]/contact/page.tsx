import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";

function getShopifyContactAction() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN. Contact form submissions require the Shopify store domain.");
  }
  return `https://${domain}/contact#contact_form`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const contactAction = getShopifyContactAction();
  const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-12 sm:pb-16">
        <Breadcrumbs items={[{ label: t("title") }]} />
        <section className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-10">
          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-base leading-7 text-brand-teal-dark/75 sm:text-lg">{t("description")}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)] lg:items-start">
            <section className="glass p-5 sm:p-8" aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark">
                {t("formTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-teal-dark/70">{t("formDescription")}</p>

              <form action={contactAction} method="post" className="mt-6 grid gap-5">
                <input type="hidden" name="form_type" value="contact" />
                <input type="hidden" name="utf8" value="✓" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-brand-teal-dark">
                    {t("name")}
                    <input
                      type="text"
                      name={`contact[${t("name")}]`}
                      autoComplete="name"
                      className="rounded-xl border border-brand-teal-dark/15 bg-white/70 px-4 py-3 font-normal text-brand-teal-dark outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-gold/50"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-brand-teal-dark">
                    <span>
                      {t("email")} <span className="text-brand-terracotta">*</span>
                    </span>
                    <input
                      required
                      type="email"
                      name="contact[email]"
                      autoComplete="email"
                      inputMode="email"
                      aria-describedby="contact-email-required"
                      className="rounded-xl border border-brand-teal-dark/15 bg-white/70 px-4 py-3 font-normal text-brand-teal-dark outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-gold/50"
                    />
                  </label>
                </div>
                <span id="contact-email-required" className="-mt-3 text-xs text-brand-teal-dark/60">
                  * {t("requiredHint")}
                </span>

                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-teal-dark">
                  {t("phone")}
                  <input
                    type="tel"
                    name={`contact[${t("phone")}]`}
                    autoComplete="tel"
                    className="rounded-xl border border-brand-teal-dark/15 bg-white/70 px-4 py-3 font-normal text-brand-teal-dark outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-gold/50"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-teal-dark">
                  {t("message")}
                  <textarea
                    name="contact[body]"
                    rows={7}
                    placeholder={t("messagePlaceholder")}
                    className="min-h-40 resize-y rounded-xl border border-brand-teal-dark/15 bg-white/70 px-4 py-3 font-normal text-brand-teal-dark outline-none transition placeholder:text-brand-teal-dark/45 focus:border-brand-teal focus:ring-2 focus:ring-brand-gold/50"
                  />
                </label>

                <button
                  type="submit"
                  className="justify-self-start rounded-full bg-brand-teal px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-teal-dark focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                >
                  {t("submit")}
                </button>
                <p className="text-xs leading-5 text-brand-teal-dark/60">{t("nativeFormHint")}</p>
              </form>
            </section>

            <aside className="glass p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream text-brand-teal-dark" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                  <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <h2 className="mt-5 font-heading text-xl font-extrabold text-brand-teal-dark">{t("locationTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-teal-dark/70">{t("locationDescription")}</p>
              <address className="mt-5 not-italic text-sm font-semibold leading-6 text-brand-teal-dark">
                {site.name}
                <br />
                {address}
                <br />
                {site.address.country}
              </address>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full border border-brand-teal px-5 py-2.5 text-sm font-bold text-brand-teal-dark transition hover:bg-brand-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                {t("directions")}
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
