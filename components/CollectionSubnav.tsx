import { Link } from "@/i18n/navigation";
import type { NavigationEntry } from "@/lib/shopify/navigation";

type Trail = { parent: NavigationEntry | null; options: NavigationEntry[] };

/** Subcategory chips: the page's own children, or its siblings (with a link back to the parent) when it is a leaf. */
function resolveTrail(entries: NavigationEntry[], href: string): Trail | null {
  for (const entry of entries) {
    if (entry.href === href) return entry.children.length ? { parent: null, options: entry.children } : null;
    if (entry.children.some((child) => child.href === href)) return { parent: entry, options: entry.children };
  }
  return null;
}

export function CollectionSubnav({ entries, href, allLabel, label }: { entries: NavigationEntry[]; href: string; allLabel: string; label: string }) {
  const trail = resolveTrail(entries, href);
  if (!trail) return null;
  const chip = "inline-flex min-h-10 items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";
  return (
    <nav aria-label={label} className="mx-auto max-w-[var(--layout-max-width)] px-4 pb-3">
      <ul className="flex flex-wrap gap-2">
        {trail.parent && (
          <li>
            <Link href={trail.parent.href} className={`${chip} border-brand-teal/25 text-brand-teal-dark hover:bg-brand-cream`}>{allLabel}</Link>
          </li>
        )}
        {trail.options.map((option) => {
          const current = option.href === href;
          return (
            <li key={option.id}>
              <Link
                href={option.href}
                aria-current={current ? "page" : undefined}
                className={`${chip} ${current ? "border-brand-teal-dark bg-brand-teal-dark text-white" : "border-brand-teal/25 text-brand-teal-dark hover:bg-brand-cream"}`}
              >
                {option.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
