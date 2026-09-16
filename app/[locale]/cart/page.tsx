import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return { title: t("title") };
}

export default async function CartPage() {
  const t = await getTranslations("cart");
  return <div className="flex min-h-full flex-col bg-white"><AnnouncementBar /><Header /><NavMenu /><main className="flex-1 pb-12 sm:pb-16"><Breadcrumbs items={[{ label: t("title") }]} /><section className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-10"><h1 className="font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">{t("title")}</h1><div className="mt-8"><CartPageClient /></div></section></main><Footer /></div>;
}
