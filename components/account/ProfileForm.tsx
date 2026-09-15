"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/customer/actions";
import { useAccount } from "@/components/account/AccountProvider";
import type { UiCustomer } from "@/lib/shopify/mappers";

const inputClassName = "rounded-lg border border-black/10 px-3 py-2 text-sm font-normal";
const labelClassName = "flex flex-col gap-1 text-sm font-semibold text-brand-teal-dark";

export function ProfileForm({ customer }: { customer: UiCustomer }) {
  const t = useTranslations("account.profile");
  const { refreshCustomer } = useAccount();
  const [firstName, setFirstName] = useState(customer.firstName);
  const [lastName, setLastName] = useState(customer.lastName);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await updateProfile({ firstName, lastName });
        await refreshCustomer();
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <label className={labelClassName}>
        {t("firstName")}
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("lastName")}
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClassName} />
      </label>
      <label className={labelClassName}>
        {t("email")}
        <input
          value={customer.email ?? ""}
          disabled
          className={`${inputClassName} bg-brand-cream text-brand-teal-dark/60`}
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-brand-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-teal-dark disabled:opacity-60"
      >
        {isPending ? t("saving") : t("save")}
      </button>
      {status === "saved" && <p className="text-sm text-brand-teal">{t("saved")}</p>}
      {status === "error" && <p className="text-sm text-brand-terracotta">{t("error")}</p>}
    </form>
  );
}
