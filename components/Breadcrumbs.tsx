import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { storefrontUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export type BreadcrumbItem = { label: string; href?: string };

export async function Breadcrumbs({ items, currentPath }: { items: BreadcrumbItem[]; currentPath?: string }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const realPath = currentPath && items.length > 0 && items.slice(0, -1).every(item => item.href);

  return (
    <>
    {realPath && <JsonLd data={{
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [{ label: t("breadcrumbs.home"), href: "/" }, ...items].map((item, index, path) => ({
        "@type": "ListItem", position: index + 1, name: item.label,
        item: storefrontUrl(locale, index === path.length - 1 ? currentPath! : item.href!),
      })),
    }} />}
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-4 text-xs text-brand-teal-dark/60 sm:text-sm"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-brand-teal-dark hover:underline">
            {t("breadcrumbs.home")}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-teal-dark hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "truncate text-brand-teal-dark" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}
