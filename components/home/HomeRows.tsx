import { getLocale, getTranslations } from "next-intl/server";
import { HomeProductRow } from "@/components/home/HomeProductRow";
import { sriLankaAllHandle } from "@/config/sri-lanka";
import type { HomeRow } from "@/lib/catalog/home-rows";

/** Renders the collection-backed and Sri Lankan product rows; titles come from messages, links from the row's collection. */
export async function HomeRows({ rows, from, to }: { rows: HomeRow[]; from: number; to: number }) {
  const t = await getTranslations("homePage.rows");
  const locale = await getLocale();

  return (
    <>
      {rows.slice(from, to).map((row, index) => (
        <HomeProductRow
          key={row.key}
          id={`home-row-${row.key}`}
          title={t(`titles.${row.key}`)}
          subtitle={row.key === "sriLanka" ? t("sriLankaSubtitle") : undefined}
          href={row.handle ? `/collections/${row.handle}` : `/collections/${sriLankaAllHandle}`}
          viewAll={t("viewAll")}
          previous={t("previous")}
          next={t("next")}
          locale={locale}
          products={row.products}
          eager={from === 0 && index === 0}
        />
      ))}
    </>
  );
}
