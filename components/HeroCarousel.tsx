"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { heroSlideMeta } from "@/lib/content/homepage";

type HeroSlideText = { eyebrow: string; title: string; body: string; cta: string };

export function HeroCarousel() {
  const t = useTranslations("hero");
  const slideTexts = t.raw("slides") as HeroSlideText[];
  const slides = heroSlideMeta.map((meta, i) => ({ ...meta, ...slideTexts[i] }));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <div
      className={`relative flex h-56 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white sm:h-72 sm:p-8 ${slide.accent}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
        {slide.eyebrow}
      </p>
      <h2 className="font-heading mt-2 max-w-xs text-2xl font-extrabold leading-tight sm:text-3xl">
        {slide.title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-white/90">{slide.body}</p>
      <a
        href={slide.href}
        className="mt-4 w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-teal-dark"
      >
        {slide.cta}
      </a>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={t("slideLabel", { number: i + 1 })}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
