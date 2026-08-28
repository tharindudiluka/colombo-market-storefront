import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = { label: string; href?: string };

export async function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const t = await getTranslations();

  return (
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
  );
}
