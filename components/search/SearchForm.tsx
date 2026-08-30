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
      className={`group flex items-center gap-2.5 rounded-full bg-neutral-100 px-4 py-2.5 transition-all focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 focus-within:ring-brand-teal/30 ${className ?? ""}`}
    >
      <button
        type="submit"
        aria-label={t("searchPlaceholder")}
        className="shrink-0 text-neutral-400 transition-colors group-focus-within:text-brand-teal-dark"
      >
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
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="w-full bg-transparent text-sm text-brand-teal-dark placeholder:text-neutral-400 focus:outline-none"
      />
    </form>
  );
}
