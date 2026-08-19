import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function AnnouncementBar() {
  const t = await getTranslations("announcementBar");
  const locale = await getLocale();
  const threshold = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: site.currency,
  }).format(site.delivery.freeDeliveryThreshold);

  return (
    <div className="bg-brand-gold text-brand-teal-dark text-xs sm:text-sm font-medium">
      <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center justify-center gap-1 px-4 py-2 text-center sm:justify-between">
        <span className="hidden items-center gap-1 sm:flex">
          <span aria-hidden>★</span> {t("rating")}
        </span>
        <span>{t("pickup")}</span>
        <span className="hidden sm:inline">{t("freeDelivery", { threshold })}</span>
      </div>
    </div>
  );
}
