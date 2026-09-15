"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { deleteAddress, setDefaultAddress } from "@/lib/customer/actions";
import type { UiAddress } from "@/lib/shopify/mappers";

export function AddressList({ addresses }: { addresses: UiAddress[] }) {
  const t = useTranslations("account.addresses");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deleteAddress(id);
      router.refresh();
    });
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      await setDefaultAddress(id);
      router.refresh();
    });
  }

  return (
    <ul className="flex flex-col gap-4">
      {addresses.map((address) => (
        <li key={address.id} className="rounded-xl border border-black/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="text-sm text-brand-teal-dark">
              <p className="font-semibold">
                {address.firstName} {address.lastName}
                {address.isDefault && (
                  <span className="ml-2 rounded-full bg-brand-cream px-2 py-0.5 text-xs font-bold text-brand-teal-dark/70">
                    {t("default")}
                  </span>
                )}
              </p>
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.postalCode} {address.city}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
              <Link
                href={`/account/addresses/${encodeURIComponent(address.id)}/edit`}
                className="font-semibold text-brand-teal-dark underline"
              >
                {t("edit")}
              </Link>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={isPending}
                  className="font-semibold text-brand-teal-dark/70 underline disabled:opacity-40"
                >
                  {t("setDefault")}
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                disabled={isPending}
                className="font-semibold text-brand-terracotta underline disabled:opacity-40"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
