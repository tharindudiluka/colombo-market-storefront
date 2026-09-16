import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";

export default async function WishlistPage() {
  const t = await getTranslations("wishlist");

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />
      <main className="flex-1 pb-12 sm:pb-16">
        <Breadcrumbs items={[{ label: t("title") }]} />
        <section className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-6 sm:pt-10">
          <h1 className="font-heading text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-sm text-brand-teal-dark/70 sm:text-base">{t("subtitle")}</p>
          <div className="mt-7">
            <WishlistPageClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
