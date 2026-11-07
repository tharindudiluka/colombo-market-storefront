import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { Link } from "@/i18n/navigation";
import { delivery, formatEuro } from "@/config/delivery";
import { pageHandles, pageHref, policyHandles, policyHref } from "@/config/pages";

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-5 w-5", "aria-hidden": true };

/** One contained strip of four equal delivery facts (2 x 2 on phones), icon and text centred. Each cell links to the shipping policy (pickup: About us). Amounts come from config/delivery.ts. */
export async function HomeTrustStrip() {
  const t = await getTranslations("homePage.trust");
  const locale = await getLocale();
  const values = { threshold: formatEuro(delivery.freeShippingThreshold, locale), rate: formatEuro(delivery.flatShippingRate, locale) };
  const items = [
    { key: "shipping", href: policyHref(policyHandles.shipping), icon: <Icon name="package" className="h-5 w-5" />, text: t("shipping", values) },
    { key: "free", href: policyHref(policyHandles.shipping), icon: <Icon name="tag" className="h-5 w-5" />, text: t("free", values) },
    { key: "germany", href: policyHref(policyHandles.shipping), icon: <svg {...svg}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>, text: t("germany") },
    { key: "pickup", href: pageHref(pageHandles.about), icon: <Icon name="store" className="h-5 w-5" />, text: t("pickup") },
  ];

  return (
    <section aria-label={t("label")} className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-7">
      <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.key}
            className="border-neutral-200 [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:[&:nth-child(-n+2)]:border-b-0 lg:last:border-r-0"
          >
            <Link
              href={item.href}
              className="group flex h-full flex-col items-center justify-center gap-2 px-3 py-4 text-center text-[13px] font-semibold leading-snug text-neutral-800 transition-colors duration-300 hover:bg-brand-teal hover:text-white focus-visible:bg-brand-teal focus-visible:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cta motion-reduce:transition-none sm:flex-row sm:gap-3 sm:px-4 sm:py-5 sm:text-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal transition duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white group-focus-visible:bg-white/20 group-focus-visible:text-white motion-reduce:transition-none motion-reduce:group-hover:scale-100">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
