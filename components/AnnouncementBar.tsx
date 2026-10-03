import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { AnnouncementBarClient } from "./AnnouncementBarClient";

export async function AnnouncementBar() {
  const t = await getTranslations("announcementBar");
  const locale = await getLocale();
  const threshold = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: site.currency,
  }).format(site.delivery.freeDeliveryThreshold);

  const items = [
    t("freeDelivery", { threshold }),
    t("pickup"),
  ];

  return <AnnouncementBarClient items={items} regionLabel={t("region")} />;
}
