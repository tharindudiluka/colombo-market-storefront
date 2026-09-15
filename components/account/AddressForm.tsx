"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createAddress, updateAddress, type AddressInput } from "@/lib/customer/actions";
import type { UiAddress } from "@/lib/shopify/mappers";

const inputClassName = "rounded-lg border border-black/10 px-3 py-2 text-sm font-normal";
const labelClassName = "flex flex-col gap-1 text-sm font-semibold text-brand-teal-dark";

export function AddressForm({ address }: { address?: UiAddress }) {
  const t = useTranslations("account.addresses");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AddressInput>({
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    address1: address?.address1 ?? "",
    address2: address?.address2 ?? "",
    city: address?.city ?? "",
    zip: address?.postalCode ?? "",
    provinceCode: address?.province ?? "",
    countryCode: address?.country ?? "DE",
    phoneNumber: address?.phone ?? "",
  });

  function update<K extends keyof AddressInput>(key: K, value: AddressInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (address) {
          await updateAddress(address.id, form);
        } else {
          await createAddress(form);
        }
        router.push("/account/addresses");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <label className={labelClassName}>
        {t("firstName")}
        <input
          required
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("lastName")}
        <input
          required
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("address1")}
        <input
          required
          value={form.address1}
          onChange={(e) => update("address1", e.target.value)}
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("address2")}
        <input value={form.address2} onChange={(e) => update("address2", e.target.value)} className={inputClassName} />
      </label>
      <label className={labelClassName}>
        {t("city")}
        <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClassName} />
      </label>
      <label className={labelClassName}>
        {t("postalCode")}
        <input required value={form.zip} onChange={(e) => update("zip", e.target.value)} className={inputClassName} />
      </label>
      <label className={labelClassName}>
        {t("province")}
        <input
          value={form.provinceCode}
          onChange={(e) => update("provinceCode", e.target.value)}
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("country")}
        <input
          required
          value={form.countryCode}
          onChange={(e) => update("countryCode", e.target.value)}
          className={inputClassName}
        />
      </label>
      <label className={labelClassName}>
        {t("phone")}
        <input
          value={form.phoneNumber}
          onChange={(e) => update("phoneNumber", e.target.value)}
          className={inputClassName}
        />
      </label>
      {error && <p className="text-sm text-brand-terracotta">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-brand-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-teal-dark disabled:opacity-60"
      >
        {isPending ? t("saving") : t("save")}
      </button>
    </form>
  );
}
