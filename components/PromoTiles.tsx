import { getTranslations } from "next-intl/server";
import { promoTileMeta } from "@/lib/content/homepage";

type PromoTileText = { title: string; subtitle: string };

export async function PromoTiles() {
  const t = await getTranslations("promo");
  const tileTexts = t.raw("tiles") as PromoTileText[];
  const tiles = promoTileMeta.map((meta, i) => ({ ...meta, ...tileTexts[i] }));

  return (
    <div className="grid h-56 grid-cols-2 gap-3 sm:h-72">
      {tiles.map((tile) => (
        <a
          key={tile.id}
          href={tile.href}
          className={`flex flex-col justify-end rounded-2xl p-4 text-white ${tile.accent}`}
        >
          <p className="text-sm font-bold sm:text-base">{tile.title}</p>
          <p className="mt-1 text-xs text-white/85 sm:text-sm">{tile.subtitle}</p>
        </a>
      ))}
    </div>
  );
}
