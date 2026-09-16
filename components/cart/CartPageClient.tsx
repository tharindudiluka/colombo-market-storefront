"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";

function money(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function CartPageClient() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { cart, isPending, updateItem, removeItem } = useCart();
  const lines = cart?.lines ?? [];

  if (!lines.length) {
    return <div className="glass py-16 text-center"><p className="text-brand-teal-dark/70">{t("empty")}</p><Link href="/collections" className="mt-5 inline-flex rounded-full bg-brand-teal px-5 py-3 text-sm font-bold text-white">{t("continueShopping")}</Link></div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <ul className="glass divide-y divide-brand-teal-dark/10 px-5 sm:px-7">
        {lines.map((line) => (
          <li key={line.id} className="flex gap-4 py-5">
            <Link href={`/products/${line.handle}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
              {line.image && <Image src={line.image.url} alt={line.image.alt} width={96} height={96} className="h-full w-full object-cover" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${line.handle}`} className="font-bold text-brand-teal-dark">{line.title}</Link>
              {line.variantTitle && <p className="mt-1 text-sm text-brand-teal-dark/60">{line.variantTitle}</p>}
              <p className="mt-2 text-sm font-bold text-brand-teal-dark">{money(line.lineTotal.amount, line.lineTotal.currencyCode, locale)}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <QuantityStepper value={line.quantity} max={null} onChange={(quantity) => updateItem(line.id, quantity)} label={t("quantityLabel")} />
                <button onClick={() => removeItem(line.id)} disabled={isPending} className="text-sm font-semibold text-brand-teal-dark/65 underline hover:text-brand-terracotta disabled:opacity-40">{t("remove")}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="glass p-6">
        <div className="flex items-center justify-between font-bold text-brand-teal-dark"><span>{t("subtotal")}</span><span>{cart && money(cart.subtotal.amount, cart.subtotal.currencyCode, locale)}</span></div>
        <p className="mt-3 text-xs leading-5 text-brand-teal-dark/60">{t("taxNote")}</p>
        <a href={cart?.checkoutUrl} className="mt-6 block rounded-full bg-brand-teal px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-teal-dark">{t("checkout")}</a>
      </aside>
    </div>
  );
}
