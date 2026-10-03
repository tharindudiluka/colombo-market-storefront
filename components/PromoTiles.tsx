import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { shopifyFetch } from "@/lib/shopify/client";
import { homeSubBannersQuery } from "@/lib/shopify/queries/home-banners";
import { toUiBanner, type UiBanner } from "@/lib/shopify/mappers";
import { dailyDelightBannerId, kumaioBannerId, promoTileMeta } from "@/lib/content/homepage";
import { promoCollectionHandles } from "@/config/collections";
import type { HomeBannersResult, LanguageCode } from "@/lib/shopify/types";

type PromoTileText = { title: string; subtitle: string };

function BrandPromoTile({ banner, copy, brand }: {
  banner: UiBanner;
  brand: "kumaio" | "dailyDelight";
  copy: { heading: string; body: string; cta: string };
}) {
  return (
    <div className={`kumaio-banner ${brand === "dailyDelight" ? "daily-delight-banner" : ""} relative col-span-2 overflow-hidden rounded-2xl md:col-span-1`}>
      <div className="kumaio-artwork relative" style={{ aspectRatio: `${banner.image.width ?? 3} / ${banner.image.height ?? 1}` }}>
        <Image src={banner.image.url} alt={banner.image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="kumaio-copy">
        <h2 className="font-heading font-bold">{copy.heading}</h2>
        <p>{copy.body}</p>
        <Link href={`/collections/${promoCollectionHandles[brand]}`} className="kumaio-cta inline-flex w-fit items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
          {copy.cta}
        </Link>
      </div>
    </div>
  );
}

async function getSubBanners(language: LanguageCode): Promise<UiBanner[]> {
  try {
    const data = await shopifyFetch<HomeBannersResult>({
      query: homeSubBannersQuery,
      variables: { language },
      tags: ["homepage"],
      revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
    });
    return data.metaobjects.edges
      .map((edge) => toUiBanner(edge.node))
      .filter((banner): banner is UiBanner => banner !== null);
  } catch {
    // `home_sub_banners` not defined / storefront access not granted — fall back below.
    return [];
  }
}

/**
 * A merchant sub-banner image, optionally clickable — nothing layered on top. An
 * internal `link` path routes client-side; anything else opens in a new tab.
 */
function PromoImageTile({
  url,
  alt,
  href,
}: {
  url: string;
  alt: string;
  href: string | null;
}) {
  // Matches spicevillage.eu: 2:1 tiles sitting 2-up on mobile, then stacked at
  // 7:2 (the ~3.5:1 artwork ratio) in the right column on desktop.
  const className =
    "relative block aspect-[2/1] overflow-hidden rounded-2xl md:aspect-[7/2]";
  const image = (
    <Image
      src={url}
      alt={alt}
      fill
      sizes="(min-width: 768px) 40vw, 50vw"
      className="object-cover"
    />
  );

  if (!href) return <div className={className}>{image}</div>;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {image}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {image}
    </a>
  );
}

/** Built-in gradient + copy tiles, shown when no `home_sub_banners` are configured. */
async function FallbackTiles() {
  const t = await getTranslations("promo");
  const tileTexts = t.raw("tiles") as PromoTileText[];
  const tiles = promoTileMeta.map((meta, i) => ({ ...meta, ...tileTexts[i] }));

  return (
    <>
      {tiles.map((tile) => (
        <a
          key={tile.id}
          href={tile.href}
          className={`flex aspect-[2/1] flex-col justify-end rounded-2xl p-3 text-white md:aspect-[7/2] md:p-4 ${tile.accent}`}
        >
          <p className="text-xs font-bold leading-tight sm:text-base">{tile.title}</p>
          <p className="mt-1 hidden text-xs text-white/85 sm:block sm:text-sm">{tile.subtitle}</p>
        </a>
      ))}
    </>
  );
}

export async function PromoTiles() {
  const locale = await getLocale();
  const language = locale.toUpperCase() as LanguageCode;
  const banners = await getSubBanners(language);
  const t = await getTranslations("promo.kumaio");
  const daily = await getTranslations("promo.dailyDelight");

  return (
    <div className="promo-stack grid grid-cols-2 gap-3 md:grid-cols-1">
      {banners.length > 0 ? (
        banners.map((banner) => banner.id === kumaioBannerId ? (
          <BrandPromoTile key={banner.id} brand="kumaio" banner={banner} copy={{ heading: t("heading"), body: t("body"), cta: t("cta") }} />
        ) : banner.id === dailyDelightBannerId ? (
          <BrandPromoTile key={banner.id} brand="dailyDelight" banner={banner} copy={{ heading: daily("heading"), body: daily("body"), cta: daily("cta") }} />
        ) : (
          <PromoImageTile
            key={banner.id}
            url={banner.image.url}
            alt={banner.image.alt}
            href={banner.href}
          />
        ))
      ) : (
        <FallbackTiles />
      )}
    </div>
  );
}
