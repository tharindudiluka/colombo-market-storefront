import { getLocale } from "next-intl/server";
import { getNavigationEntries } from "@/lib/shopify/navigation";
import { NavMenuClient } from "@/components/NavMenuClient";

export async function NavMenu() {
  const locale = await getLocale();
  const entries = await getNavigationEntries(locale.toUpperCase() as "DE" | "EN");
  return <NavMenuClient entries={entries} />;
}
