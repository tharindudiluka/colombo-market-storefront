import { getTranslations } from "next-intl/server";
import { navHandles } from "@/lib/content/nav";
import { site } from "@/config/site";

export async function Footer() {
  const t = await getTranslations();
  const shopLinks = navHandles
    .slice(0, 4)
    .map((handle) => ({ label: t(`nav.${handle}`), href: `/collections/${handle}` }));
  const supportLinks = t.raw("footer.support") as string[];
  const companyLinks = t.raw("footer.company") as string[];

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
              {supportLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-white/80 hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/50">
              {t("footer.companyTitle")}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {companyLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-white/80 hover:text-white">
                    {label}
                  </a>
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
            <a href="#" className="hover:text-white">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:text-white">
              {t("footer.termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
