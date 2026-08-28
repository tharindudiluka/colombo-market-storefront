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
    <ul className="mt-5 flex flex-col gap-2.5 border-t border-black/10 pt-5 text-xs text-brand-teal-dark/75 sm:text-sm">
      <li className="flex items-center gap-2.5">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-gold">
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8L2.2 9.5l6.9-.7z" />
        </svg>
        {t("rating")}
      </li>
      <li className="flex items-center gap-2.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-brand-teal">
          <path d="M2 7h11v9H2z" />
          <path d="M13 10h4l4 3v3h-8z" />
          <circle cx="6.5" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
        {t("delivery", { threshold })}
      </li>
      <li className="flex items-center gap-2.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-brand-teal">
          <path d="M4 10v9h16v-9" />
          <path d="M2.5 10 5 4h14l2.5 6z" />
          <path d="M9 19v-5h6v5" />
        </svg>
        {t("pickup")}
      </li>
    </ul>
  );
}
