import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getCurrentCustomer } from "@/lib/customer/actions";

const navLinkClassName =
  "rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-brand-teal-dark hover:bg-brand-cream whitespace-nowrap";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const customer = await getCurrentCustomer();

  // Defense-in-depth alongside proxy.ts's route protection — belt-and-suspenders in case
  // the middleware is ever bypassed. `/api/auth/login` is outside the locale segment, so
  // this uses next/navigation's redirect, not the locale-aware one from i18n/navigation.
  if (!customer) {
    redirect(`/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(`/${locale === "en" ? "en/" : ""}account`)}`);
  }

  const t = await getTranslations("account.nav");

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />

      <main className="flex-1">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
            <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              <Link href="/account" className={navLinkClassName}>
                {t("profile")}
              </Link>
              <Link href="/account/orders" className={navLinkClassName}>
                {t("orders")}
              </Link>
              <Link href="/account/addresses" className={navLinkClassName}>
                {t("addresses")}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className={`w-full ${navLinkClassName}`}>
                  {t("logout")}
                </button>
              </form>
            </nav>
            <div>{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
