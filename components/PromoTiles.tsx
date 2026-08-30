import { getTranslations } from "next-intl/server";
import { promoTileMeta } from "@/lib/content/homepage";

type PromoTileText = { title: string; subtitle: string };

export async function PromoTiles() {
  const t = await getTranslations("promo");
  const tileTexts = t.raw("tiles") as PromoTileText[];
  const tiles = promoTileMeta.map((meta, i) => ({ ...meta, ...tileTexts[i] }));

  return (
    <div className="grid grid-cols-2 gap-3 md:h-full md:grid-cols-1 md:grid-rows-2">
      {tiles.map((tile) => (
        <a
          key={tile.id}
          href={tile.href}
          className={`flex aspect-[2/1] flex-col justify-end rounded-2xl p-3 text-white md:aspect-auto md:p-4 ${tile.accent}`}
        >
          <p className="text-xs font-bold leading-tight sm:text-base">{tile.title}</p>
          <p className="mt-1 hidden text-xs text-white/85 sm:block sm:text-sm">{tile.subtitle}</p>
        </a>
      ))}
    </div>
  );
}
