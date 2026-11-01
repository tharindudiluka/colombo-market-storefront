import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { delivery, formatEuro } from "@/config/delivery";

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-[18px] w-[18px]", "aria-hidden": true };

/** One contained strip of four equal delivery facts (2 x 2 on phones). Amounts come from config/delivery.ts. */
export async function HomeTrustStrip() {
  const t = await getTranslations("homePage.trust");
  const locale = await getLocale();
  const values = { threshold: formatEuro(delivery.freeShippingThreshold, locale), rate: formatEuro(delivery.flatShippingRate, locale) };
  const items = [
    { key: "shipping", icon: <Icon name="package" className="h-[18px] w-[18px]" />, text: t("shipping", values) },
    { key: "free", icon: <Icon name="tag" className="h-[18px] w-[18px]" />, text: t("free", values) },
    { key: "germany", icon: <svg {...svg}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>, text: t("germany") },
    { key: "pickup", icon: <Icon name="store" className="h-[18px] w-[18px]" />, text: t("pickup") },
  ];

  return (
    <section aria-label={t("label")} className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-7">
      <ul className="grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200 bg-white lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-center gap-2.5 border-neutral-200 px-3 py-3 text-xs font-semibold leading-snug text-neutral-800 sm:px-4 sm:text-[13px] [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:[&:nth-child(-n+2)]:border-b-0 lg:last:border-r-0"
          >
            <span className="shrink-0 text-brand-teal">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
