"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";

function formatMoney(amount: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(amount);
}

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { cart, isOpen, isPending, closeCart, updateItem, removeItem } = useCart();

  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeCartRef = useRef(closeCart);
  useEffect(() => {
    closeCartRef.current = closeCart;
  }, [closeCart]);

  // Remember the last focused element outside the drawer. "Add to cart" disables its button while
  // the request is pending, which drops focus to <body> before the drawer opens.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (el instanceof HTMLElement && !el.closest("[role='dialog']")) lastFocusedRef.current = el;
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  // Modal behaviour while open: move focus in, trap Tab / Shift+Tab, make the rest of the
  // page inert, close on Escape, and hand focus back to whatever opened the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const root = rootRef.current;
    const dialog = dialogRef.current;
    if (!root || !dialog) return;

    const active = document.activeElement;
    const trigger =
      active instanceof HTMLElement && active !== document.body ? active : lastFocusedRef.current;

    const inerted: Element[] = [];
    for (const el of Array.from(root.parentElement?.children ?? [])) {
      if (el === root || el.hasAttribute("inert")) continue;
      if (["SCRIPT", "STYLE", "LINK", "NEXT-ROUTE-ANNOUNCER"].includes(el.tagName)) continue;
      el.setAttribute("inert", "");
      inerted.push(el);
    }

    closeButtonRef.current?.focus();

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCartRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.getAttribute("aria-disabled") !== "true" && el.offsetParent !== null,
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((el) => el.removeAttribute("inert"));
      if (trigger && trigger.isConnected) trigger.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];

  return (
    <div ref={rootRef} className="fixed inset-0 z-50">
      <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={t("title")} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <span className="text-lg font-bold text-brand-teal-dark">
            {t("title")}
            {cart && cart.totalQuantity > 0 ? ` (${cart.totalQuantity})` : ""}
          </span>
          <button ref={closeButtonRef} type="button" aria-label={t("close")} onClick={closeCart} className="-m-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-brand-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
            <p className="text-sm text-brand-teal-dark/70">{t("empty")}</p>
            <Link href="/collections" onClick={closeCart} className="rounded-full bg-brand-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-teal-dark">
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3 border-b border-black/5 py-4 last:border-b-0">
                  <Link
                    href={`/products/${line.handle}`}
                    onClick={closeCart}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream"
                  >
                    {line.image && (
                      <Image
                        src={line.image.url}
                        alt={line.image.alt}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${line.handle}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-brand-teal-dark"
                    >
                      {line.title}
                    </Link>
                    {line.variantTitle && <p className="text-xs text-brand-teal-dark/60">{line.variantTitle}</p>}
                    {!line.availableForSale && (
                      <p className="mt-1 text-xs font-semibold text-brand-terracotta">{t("soldOut")}</p>
                    )}
                    <p className="mt-1 text-sm font-bold text-brand-teal-dark">
                      {formatMoney(line.price.amount, line.price.currencyCode, locale)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        value={line.quantity}
                        max={null}
                        onChange={(next) => updateItem(line.id, next)}
                        label={t("quantityLabel")}
                      />
                      <button
                        onClick={() => removeItem(line.id)}
                        disabled={isPending}
                        className="text-xs font-semibold text-brand-teal-dark/60 underline hover:text-brand-terracotta disabled:opacity-40"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-black/10 px-5 py-4">
              <Link href="/cart" onClick={closeCart} className="mb-3 block text-center text-sm font-semibold text-brand-teal underline">{t("viewCart")}</Link>
              <div className="mb-3 flex items-center justify-between text-sm font-semibold text-brand-teal-dark">
                <span>{t("subtotal")}</span>
                <span>{cart && formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode, locale)}</span>
              </div>
              <p className="mb-3 text-xs text-brand-teal-dark/60">{t("taxNote")}</p>
              <a
                href={cart?.checkoutUrl ?? "#"}
                aria-disabled={isPending}
                className={`block w-full rounded-full py-3.5 text-center text-sm font-bold text-white transition-colors sm:text-base ${
                  isPending ? "pointer-events-none bg-brand-teal/60" : "bg-brand-teal hover:bg-brand-teal-dark"
                }`}
              >
                {t("checkout")}
              </a>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 block w-full rounded-full border-2 border-brand-teal py-3 text-center text-sm font-bold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:text-base"
              >
                {t("keepShopping")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
