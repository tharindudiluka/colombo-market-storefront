"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { getCurrentCustomer } from "@/lib/customer/actions";
import type { UiCustomer } from "@/lib/shopify/mappers";

type AccountContextValue = {
  customer: UiCustomer | null;
  isPending: boolean;
  refreshCustomer: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({
  initialCustomer,
  children,
}: {
  initialCustomer: UiCustomer | null;
  children: ReactNode;
}) {
  const [customer, setCustomer] = useState<UiCustomer | null>(initialCustomer);
  const [isPending, startTransition] = useTransition();

  function refreshCustomer() {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          setCustomer(await getCurrentCustomer());
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return (
    <AccountContext.Provider value={{ customer, isPending, refreshCustomer }}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within an AccountProvider");
  return ctx;
}
