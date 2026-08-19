import { getTranslations } from "next-intl/server";

export async function HelpButton() {
  const t = await getTranslations("helpButton");

  return (
    <button
      aria-label={t("ariaLabel")}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-terracotta text-white shadow-lg sm:h-14 sm:w-14"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 5h16v10H8l-4 4V5z" />
      </svg>
    </button>
  );
}
