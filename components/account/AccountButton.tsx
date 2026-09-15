"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAccount } from "@/components/account/AccountProvider";

const buttonClassName =
  "flex h-10 w-10 items-center justify-center rounded-full text-brand-teal-dark transition-colors hover:bg-brand-cream active:scale-95 sm:h-11 sm:w-11";

function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-7 sm:w-7"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function AccountButton() {
  const t = useTranslations("header");
  const locale = useLocale();
  const { customer } = useAccount();

  if (customer) {
    return (
      <Link href="/account" aria-label={t("accountLabel")} className={buttonClassName}>
        <AccountIcon />
      </Link>
    );
  }

  // Plain <a>, not i18n/navigation's Link — the target is a non-locale API route.
  return (
    <a href={`/api/auth/login?locale=${locale}`} aria-label={t("accountLabel")} className={buttonClassName}>
      <AccountIcon />
    </a>
  );
}
