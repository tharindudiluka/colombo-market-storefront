import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function TrustBadges() {
  const t = await getTranslations("product.trust");
  const locale = await getLocale();
  const threshold = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: site.currency,
  }).format(site.delivery.freeDeliveryThreshold);

  return (
    <ul className="mt-5 grid gap-2 text-sm leading-relaxed text-brand-teal-dark/80 sm:grid-cols-2">
      <li className="flex items-center gap-3 rounded-xl border border-brand-teal-dark/10 bg-brand-cream/20 px-4 py-3">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-brand-teal">
          <path d="M2 7h11v9H2z" />
          <path d="M13 10h4l4 3v3h-8z" />
          <circle cx="6.5" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
        {t("delivery", { threshold })}
      </li>
      <li className="flex items-center gap-3 rounded-xl border border-brand-teal-dark/10 bg-brand-cream/20 px-4 py-3">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-brand-teal">
          <path d="M4 10v9h16v-9" />
          <path d="M2.5 10 5 4h14l2.5 6z" />
          <path d="M9 19v-5h6v5" />
        </svg>
        {t("pickup")}
      </li>
    </ul>
  );
}
