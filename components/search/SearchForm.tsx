"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SearchForm({ className }: { className?: string }) {
  const t = useTranslations("header");
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center rounded-full border border-black/10 bg-brand-cream px-4 py-2 ${className ?? ""}`}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="w-full bg-transparent text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/50 focus:outline-none"
      />
      <button type="submit" aria-label={t("searchPlaceholder")} className="shrink-0 text-brand-teal-dark/70">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
