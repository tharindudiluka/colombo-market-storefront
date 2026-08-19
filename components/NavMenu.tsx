import { getTranslations } from "next-intl/server";
import { navHandles } from "@/lib/content/nav";

export async function NavMenu() {
  const t = await getTranslations("nav");

  return (
    <nav className="hidden border-t border-black/5 bg-white md:block">
      <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center gap-6 px-4 py-2.5 text-sm font-semibold text-brand-teal-dark">
        {navHandles.map((handle) => (
          <a
            key={handle}
            href={`/collections/${handle}`}
            className="whitespace-nowrap transition-colors hover:text-brand-terracotta"
          >
            {t(handle)}
          </a>
        ))}
      </div>
    </nav>
  );
}
