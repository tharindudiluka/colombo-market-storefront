import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FooterGroupsClient } from "@/components/FooterGroupsClient";
import { site } from "@/config/site";
import { footerCollectionHandles } from "@/config/collections";
import { pageHandles, pageHref, policyHandles, policyHref } from "@/config/pages";

const footerLinkClass = "inline-flex min-h-11 items-center py-2 text-sm leading-relaxed text-white/85 underline-offset-4 transition hover:text-category-turmeric hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-category-turmeric sm:text-base";
const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/colombomarketgermany/" },
  { name: "Instagram", href: "https://www.instagram.com/colombo_market/" },
];

function FooterArtwork() {
  return <>
    <svg aria-hidden="true" focusable="false" viewBox="0 0 240 240" className="footer-leaves pointer-events-none absolute right-0 top-0 h-16 w-16 opacity-90 lg:h-36 lg:w-36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path className="fill-brand-teal" d="M218 12C144 17 83 65 86 128C87 151 95 168 109 178C169 169 212 121 218 68C220 46 220 28 218 12Z" />
      <path className="fill-brand-gold/20" d="M218 12C158 71 132 116 109 178C169 169 212 121 218 68C220 46 220 28 218 12Z" />
      <path className="stroke-category-sage/35" strokeWidth="2" d="M80 212Q141 103 218 12M109 174Q95 151 96 125M126 143Q109 120 116 94M147 111Q132 89 148 63M168 81Q157 60 176 39M109 174Q147 166 169 147M126 143Q164 135 190 111M147 111Q184 100 207 72M168 81Q196 65 216 39" />
      <path className="stroke-brand-gold/60" strokeWidth="2" d="M24 220Q39 170 57 112" />
      <path className="fill-brand-gold/65" d="M34 184C12 180 5 166 9 153C28 156 35 170 34 184ZM40 164C57 165 73 153 72 138C54 139 42 151 40 164ZM46 143C30 138 25 125 29 112C44 116 49 129 46 143ZM53 122C70 122 80 109 78 98C62 100 55 111 53 122Z" />
    </svg>
  </>;
}

function ServiceIcon({ pickup = false }: { pickup?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-category-turmeric" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {pickup ? <><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0M9 20v-6h6v6" /></> : <><path d="M3 5h11v12H3ZM14 9h4l3 4v4h-7M3 9h5" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>}
  </svg>;
}

export async function Footer() {
  const t = await getTranslations();
  const shopLinks = [
    { label: t("footer.allCategories"), href: "/collections" },
    ...Object.entries(footerCollectionHandles).map(([key, handle]) => ({ label: t(`footer.${key}`), href: `/collections/${handle}` })),
  ];
  const serviceLinks = [
    ...(site.features.customerAccounts ? [{ label: (t.raw("footer.support") as string[])[0], href: "/account/orders" }] : []),
    { label: (t.raw("footer.support") as string[])[1], href: "/contact" },
    { label: t("footer.shippingPolicy"), href: policyHref(policyHandles.shipping) },
    { label: t("footer.refundPolicy"), href: policyHref(policyHandles.refund) },
  ];
  const companyLinks = [
    { label: (t.raw("footer.company") as string[])[0], href: pageHref(pageHandles.about) },
    { label: t("footer.privacyPolicy"), href: policyHref(policyHandles.privacy) },
    { label: t("footer.imprint"), href: policyHref(policyHandles.legalNotice) },
    { label: t("footer.termsOfService"), href: policyHref(policyHandles.terms) },
  ];
  const groups = [
    { key: "shop", title: t("footer.shopTitle"), links: shopLinks },
    { key: "service", title: t("footer.serviceTitle"), links: serviceLinks },
    { key: "company", title: t("footer.companyTitle"), links: companyLinks },
  ];

  return <footer className="storefront-footer relative isolate bg-brand-teal-dark text-white">
    <FooterArtwork />
    <div className="relative mx-auto max-w-screen-2xl px-6 sm:px-8">
      <div className="grid gap-3 border-b border-white/15 py-4 sm:grid-cols-2 sm:gap-5 sm:py-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3"><ServiceIcon /><p className="text-sm font-medium text-white/90 sm:text-base">{t("footer.shippingService")}</p></div>
        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3"><ServiceIcon pickup /><p className="text-sm font-medium text-white/90 sm:text-base">{t("footer.pickupService")}</p></div>
      </div>
      <div className="grid gap-0 py-5 md:grid-cols-2 md:gap-8 md:py-9 lg:grid-cols-5 lg:gap-10 lg:py-12">
        <div className="lg:col-span-2 lg:pr-8">
          <Link href="/" aria-label={t("footer.homeLabel")} className="inline-flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-category-turmeric">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 md:h-20 md:w-20"><Image src={site.logo} alt="" width={120} height={120} sizes="80px" className="h-full w-full object-contain" /></span>
            <span className="font-heading text-lg font-extrabold tracking-wide text-white sm:text-xl">{site.wordmark}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 md:mt-5 md:text-base">{t("footer.tagline")}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-category-sage md:mt-3">{t("footer.pickupNote")}</p>
          <address className="mb-5 mt-3 text-sm leading-relaxed not-italic text-category-sage md:mb-0 md:mt-4">{site.address.street}<br />{site.address.postalCode} {site.address.city}</address>
          <nav aria-label={t("footer.followUs")} className="mb-4 flex items-center gap-3 md:mb-0 md:mt-3">
            <span className="text-sm font-medium text-category-turmeric">{t("footer.followUs")}</span>
            <div className="flex gap-2">
              {socialLinks.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={t("footer.socialLinkLabel", { platform: name })} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-category-turmeric transition-colors hover:border-category-turmeric/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-category-turmeric">
                {name === "Facebook" ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8Z" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>}
              </a>)}
            </div>
          </nav>
        </div>
        <FooterGroupsClient groups={groups.map(group => ({key: group.key, title: group.title, content: <ul className="px-1 pb-2 md:mt-3 md:space-y-1 md:px-0 md:pb-0">{group.links.map(link => <li key={link.href}><Link href={link.href} className={footerLinkClass}>{link.label}</Link></li>)}</ul>}))} />
      </div>
      <div className="flex flex-col gap-1 border-t border-white/15 py-4 md:flex-row md:items-center md:justify-between md:gap-3 md:py-5">
        <p className="text-sm leading-relaxed text-white/75">© {new Date().getFullYear()} {site.name}. {t("footer.copyright")}</p>
        <Link href={policyHref(policyHandles.contact)} className={footerLinkClass}>{t("footer.contactInformation")}</Link>
      </div>
    </div>
  </footer>;
}
