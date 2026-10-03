"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { UiHomepageBrand } from "@/lib/shopify/mappers";

export function BrandStripClient({ brands }: { brands: UiHomepageBrand[] }) {
  const t = useTranslations("brandStrip");
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ previous: false, next: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setPosition({ previous: element.scrollLeft > 1, next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [brands]);
  return <section className="border-y border-brand-teal/10 bg-white/60" aria-labelledby="brands-title">
    <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 sm:py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="brands-title" className="font-heading text-2xl font-extrabold text-brand-teal-dark sm:text-3xl">{t("title")}</h2>
          <p className="mt-2 text-sm text-brand-teal-dark/70">{t("subtitle")}</p>
        </div>
        {(position.previous || position.next) && <div className="flex gap-2">
          {([[-1, "previous"], [1, "next"]] as const).map(([direction, key]) => <button type="button" key={key} aria-label={t(key)} aria-controls="brand-cards" disabled={!position[key]} onClick={() => track.current?.scrollBy({ left: direction * track.current.clientWidth })} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/25 text-brand-teal-dark transition hover:bg-brand-cream disabled:opacity-30"><span aria-hidden>{direction < 0 ? "←" : "→"}</span></button>)}
        </div>}
      </div>
      <div ref={track} id="brand-cards" tabIndex={0} role="region" aria-label={t("title")} className="brand-track no-scrollbar mt-6 pb-2">
        {brands.map((brand) => <Link key={brand.id} href={{ pathname: "/search", query: { vendor: brand.vendor } }} className="brand-card group flex h-44 min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-brand-teal/10 bg-white p-4 text-center transition hover:border-brand-teal/30 hover:shadow-sm sm:h-48">
          <span className="relative block h-24 w-full sm:h-28"><Image src={brand.logo.url} alt={brand.logo.alt} fill sizes="(min-width: 1280px) 280px, (min-width: 640px) 180px, 120px" className="object-contain" /></span>
          <span className="text-sm font-semibold text-brand-teal-dark sm:text-base">{brand.name}</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
