"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavigationEntry } from "@/lib/shopify/navigation";

function containsPath(entry: NavigationEntry, pathname: string): boolean {
  return entry.href === pathname || entry.children.some((child) => containsPath(child, pathname));
}

function DownCaret() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0"
      aria-hidden
    >
      <path d="m3.75 7.5 6.25 6.25 6.25-6.25" />
    </svg>
  );
}

function RightCaret() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0"
      aria-hidden
    >
      <path d="m7.5 3.75 6.25 6.25-6.25 6.25" />
    </svg>
  );
}

function SubmenuEntry({ entry, pathname }: { entry: NavigationEntry; pathname: string }) {
  const active = containsPath(entry, pathname);
  const hasChildren = entry.children.length > 0;
  const itemClassName = `flex h-[var(--layout-menu-row-height)] w-full items-center justify-between gap-1 px-5 text-left font-sans text-[15px] leading-6 transition-colors hover:bg-neutral-50 hover:text-black ${
    active ? "text-black" : "text-neutral-600"
  }`;

  return (
    <li className="group/submenu relative">
      {entry.href && entry.href !== "#" ? (
        <Link
          href={entry.href}
          aria-current={entry.href === pathname ? "page" : undefined}
          aria-haspopup={hasChildren ? "menu" : undefined}
          className={itemClassName}
        >
          <span>{entry.title}</span>
          {hasChildren && <RightCaret />}
        </Link>
      ) : (
        <button type="button" className={itemClassName}>
          <span>{entry.title}</span>
          {hasChildren && <RightCaret />}
        </button>
      )}

      {hasChildren && (
        <ul
          role="menu"
          className="invisible absolute left-full top-[var(--layout-menu-nested-offset)] z-40 w-[var(--layout-menu-width)] border border-neutral-200 bg-white py-6 opacity-0 transition-[opacity,visibility] duration-150 group-hover/submenu:visible group-hover/submenu:opacity-100 group-focus-within/submenu:visible group-focus-within/submenu:opacity-100"
        >
          {entry.children.map((child) => (
            <SubmenuEntry key={child.id} entry={child} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TopLevelEntry({ entry, pathname }: { entry: NavigationEntry; pathname: string }) {
  const active = containsPath(entry, pathname);
  const hasChildren = entry.children.length > 0;
  const itemClassName = `flex h-full items-center gap-2 border-b-2 px-6 font-navigation text-sm font-bold leading-6 whitespace-nowrap transition-colors hover:border-brand-teal hover:bg-brand-cream/40 hover:text-brand-teal-dark focus-visible:outline-2 focus-visible:outline-brand-teal ${
    active ? "border-brand-teal text-brand-teal-dark" : "border-transparent text-brand-teal-dark"
  }`;

  return (
    <li className="group/menu relative flex h-[var(--layout-desktop-nav-height)] items-center">
      {entry.href && entry.href !== "#" ? (
        <Link
          href={entry.href}
          aria-current={entry.href === pathname ? "page" : undefined}
          aria-haspopup={hasChildren ? "menu" : undefined}
          className={itemClassName}
        >
          <span>{entry.title}</span>
          {hasChildren && <DownCaret />}
        </Link>
      ) : (
        <button type="button" aria-haspopup={hasChildren ? "menu" : undefined} className={itemClassName}>
          <span>{entry.title}</span>
          {hasChildren && <DownCaret />}
        </button>
      )}

      {hasChildren && (
        <div className="invisible absolute left-0 top-full z-40 w-[var(--layout-menu-width)] opacity-0 transition-[opacity,visibility] duration-150 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100">
          <ul role="menu" className="border border-neutral-200 bg-white py-6">
            {entry.children.map((child) => (
              <SubmenuEntry key={child.id} entry={child} pathname={pathname} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function NavMenuClient({ entries = [] }: { entries?: NavigationEntry[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav className="storefront-nav relative z-30 hidden h-[var(--layout-nav-height)] bg-transparent lg:block" aria-label={t("desktopMenuLabel")}>
      <div className="mx-auto flex h-full max-w-[var(--layout-max-width)] items-center overflow-visible px-[var(--layout-page-padding)]">
        <ul className="flex h-full min-w-0 flex-wrap items-center overflow-visible">
          {entries.map((entry) => (
            <TopLevelEntry key={entry.id} entry={entry} pathname={pathname} />
          ))}

        </ul>
      </div>
    </nav>
  );
}
