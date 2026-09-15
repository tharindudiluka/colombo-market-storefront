import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { pageHandles, pageHref } from "@/config/pages";
import { getNavigationCollections } from "@/lib/shopify/navigation";

export async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const collections = await getNavigationCollections(locale.toUpperCase() as "DE" | "EN");
  const shopLinks = collections.slice(0, 4).map((collection) => ({
    label: collection.title,
    href: `/collections/${collection.handle}`,
  }));
  const supportLinks = t.raw("footer.support") as string[];
  const companyLinks = t.raw("footer.company") as string[];
  const supportHrefs = [
    pageHref(pageHandles.deliveryInfo),
    pageHref(pageHandles.returnsRefunds),
    "/account/orders",
    "/contact",
  ];
  const companyHrefs = [
    pageHref(pageHandles.about),
    pageHref(pageHandles.careers),
    pageHref(pageHandles.sourcing),
    pageHref(pageHandles.blog),
  ];

  return (
    <footer className="bg-brand-teal-dark text-white">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-heading inline-block rounded-md bg-white/10 px-3 py-1.5 text-base font-extrabold tracking-wide">
              {site.wordmark}
            </span>
            <p className="mt-3 text-sm text-white/60">{t("footer.tagline")}</p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/50">
              {t("footer.shopTitle")}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/80 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/50">
              {t("footer.supportTitle")}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {supportLinks.map((label, index) => (
                <li key={label}>
                  <Link href={supportHrefs[index]} className="text-sm text-white/80 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/50">
              {t("footer.companyTitle")}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {companyLinks.map((label, index) => (
                <li key={label}>
                  <Link href={companyHrefs[index]} className="text-sm text-white/80 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {site.name}. {t("footer.copyright")}
          </p>
          <div className="flex gap-3 text-xs text-white/50">
            <Link href={pageHref(pageHandles.privacy)} className="hover:text-white">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href={pageHref(pageHandles.terms)} className="hover:text-white">
              {t("footer.termsOfService")}
            </Link>
            <Link href={pageHref(pageHandles.imprint)} className="hover:text-white">
              {t("footer.imprint")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
