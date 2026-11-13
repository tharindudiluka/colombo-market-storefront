import { getTranslations } from "next-intl/server";
import { HashScroll } from "@/components/HashScroll";
import { preparePolicyHtml, type PolicyHtmlOptions } from "@/lib/policy-content";

/** Pages with at least this many sections get an "On this page" menu; short pages (Impressum, contact) stay simple. */
const TOC_MIN_SECTIONS = 4;

const jumpLink =
  "flex min-h-11 items-center rounded-md py-1 text-sm leading-snug lg:min-h-0 lg:py-2 text-neutral-600 transition-colors hover:text-brand-teal-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

/**
 * Shared layout for Shopify policies and pages: cream title band, centred left-aligned reading column, and a jump menu
 * (sticky side list on desktop, collapsible card on phones) for pages with clear sections. Content wording is untouched.
 */
export async function PolicyLayout({ title, html, options }: { title: string; html: string; options?: PolicyHtmlOptions }) {
  const t = await getTranslations("policyPages");
  const { html: body, toc } = preparePolicyHtml(html, title, options);
  const showToc = toc.length >= TOC_MIN_SECTIONS;

  const list = (
    <ol className="space-y-0.5">
      {toc.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={jumpLink}>{item.title}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <article>
      <HashScroll />
      <header className="border-b border-neutral-200 bg-brand-cream">
        <div className={`mx-auto px-4 py-10 sm:py-14 ${showToc ? "max-w-5xl" : "max-w-3xl"}`}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">{t("eyebrow")}</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-teal-dark sm:text-5xl">{title}</h1>
          <span aria-hidden className="mt-5 block h-1 w-14 rounded-full bg-brand-gold" />
        </div>
      </header>

      <div className={`mx-auto px-4 py-10 sm:py-14 ${showToc ? "max-w-5xl lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14" : "max-w-3xl"}`}>
        {showToc && (
          <>
            <details className="mb-8 rounded-xl border border-neutral-200 bg-brand-cream/60 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 text-sm font-bold text-brand-teal-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
                {t("onThisPage")}
                <span aria-hidden className="text-lg leading-none">+</span>
              </summary>
              <nav aria-label={t("onThisPage")} className="border-t border-neutral-200 px-4 py-2">{list}</nav>
            </details>
            <aside className="hidden lg:block">
              <nav aria-label={t("onThisPage")} className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l-2 border-neutral-200 pl-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">{t("onThisPage")}</p>
                {list}
              </nav>
            </aside>
          </>
        )}
        <div className="policy-prose min-w-0 max-w-[44rem]" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </article>
  );
}
