"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { navHandles } from "@/lib/content/nav";
import { categoryIcons } from "@/lib/content/categories";

export function NavMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="hidden border-b border-black/5 bg-white md:block">
      <div className="no-scrollbar mx-auto flex max-w-[var(--layout-max-width)] items-center gap-1.5 overflow-x-auto px-4 py-2.5">
        {navHandles.map((handle) => {
          const href = `/collections/${handle}`;
          const isActive = pathname === href;
          const isOffers = handle === "angebote";

          const tone = isOffers
            ? "bg-brand-terracotta text-white shadow-sm hover:bg-brand-terracotta/90"
            : isActive
              ? "bg-brand-cream text-brand-teal-dark"
              : "text-brand-teal-dark/75 hover:bg-brand-cream hover:text-brand-teal-dark";

          return (
            <Link
              key={handle}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.97] ${tone}`}
            >
              <Icon
                name={categoryIcons[handle] ?? "leaf"}
                className={`h-4 w-4 transition-opacity ${
                  isOffers ? "opacity-90" : "opacity-55 group-hover:opacity-100"
                }`}
              />
              {t(handle)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
