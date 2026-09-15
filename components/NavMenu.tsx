import { getLocale } from "next-intl/server";
import { getNavigationCollections } from "@/lib/shopify/navigation";
import { NavMenuClient } from "@/components/NavMenuClient";

export async function NavMenu() {
  const locale = await getLocale();
  const collections = await getNavigationCollections(locale.toUpperCase() as "DE" | "EN");
  return <NavMenuClient collections={collections} />;
}
