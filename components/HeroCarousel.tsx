import { getLocale, getTranslations } from "next-intl/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { homeBannersQuery } from "@/lib/shopify/queries/home-banners";
import { toUiBanner, type UiBanner } from "@/lib/shopify/mappers";
import { heroSlideMeta } from "@/lib/content/homepage";
import type { HomeBannersResult, LanguageCode } from "@/lib/shopify/types";
import { HeroCarouselClient, type HeroItem } from "@/components/HeroCarouselClient";

type HeroSlideText = { eyebrow: string; title: string; body: string; cta: string };

async function getBanners(language: LanguageCode): Promise<UiBanner[]> {
  try {
    const data = await shopifyFetch<HomeBannersResult>({
      query: homeBannersQuery,
      variables: { language },
      tags: ["homepage"],
    });
    return data.metaobjects.edges
      .map((edge) => toUiBanner(edge.node))
      .filter((banner): banner is UiBanner => banner !== null);
  } catch {
    // Metaobject not defined / storefront access not granted — fall back below.
    return [];
  }
}

export async function HeroCarousel() {
  const locale = await getLocale();
  const language = locale.toUpperCase() as LanguageCode;
  const t = await getTranslations("hero");

  const banners = await getBanners(language);

  const items: HeroItem[] =
    banners.length > 0
      ? banners.map((banner) => ({
          kind: "image",
          id: banner.id,
          url: banner.image.url,
          alt: banner.image.alt,
          href: banner.href,
        }))
      : heroSlideMeta.map((meta, i) => {
          const text = (t.raw("slides") as HeroSlideText[])[i];
          return {
            kind: "content",
            id: meta.id,
            href: meta.href,
            accent: meta.accent,
            ...text,
          };
        });

  return <HeroCarouselClient items={items} />;
}
