import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountProvider } from "@/components/account/AccountProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { getCart } from "@/lib/cart/actions";
import { getCurrentCustomer } from "@/lib/customer/actions";
import type { LanguageCode } from "@/lib/shopify/types";
import "../globals.css";

// Matches spice_clone's original font setup: Geist Sans feeds both the heading and
// body tokens (spice_clone had no separate heading font), Geist Mono is exposed for
// parity but unused in the UI, same as the original.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const language = locale.toUpperCase() as LanguageCode;
  const [initialCart, initialCustomer] = await Promise.all([getCart(language), getCurrentCustomer()]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <WishlistProvider>
            <CartProvider initialCart={initialCart} language={language}>
              <AccountProvider initialCustomer={initialCustomer}>
                {children}
                <CartDrawer />
              </AccountProvider>
            </CartProvider>
          </WishlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
