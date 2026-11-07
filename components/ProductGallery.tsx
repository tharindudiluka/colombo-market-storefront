"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Product image gallery. One scroll-snap strip serves every screen: phones swipe it (with dots underneath), larger
 * screens use the thumbnails, and each picture zooms in slightly on hover. Images are always shown whole.
 */
export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt: string }[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const t = useTranslations("product.gallery");
  const many = images.length > 1;

  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    const onScroll = () => setActiveIndex(Math.round(element.scrollLeft / Math.max(1, element.clientWidth)));
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (index: number) => strip.current?.scrollTo({ left: index * strip.current.clientWidth, behavior: "smooth" });

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-brand-teal-dark/10 bg-stone-50 shadow-sm">
        {images.length > 0 ? (
          <div ref={strip} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" aria-roledescription={many ? "carousel" : undefined} aria-label={many ? t("label") : undefined}>
            {images.map((image, index) => (
              <div key={image.url} className="group relative aspect-square w-full shrink-0 snap-center overflow-hidden" aria-roledescription={many ? "slide" : undefined} aria-label={many ? `${index + 1} / ${images.length}` : undefined}>
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1400px) 650px, (min-width: 1024px) 46vw, (min-width: 768px) 700px, 100vw"
                  className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:p-10 lg:p-12"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-brand-teal-dark/40">{title}</div>
        )}

        {many && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
            {images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                aria-label={t("image", { title, number: index + 1 })}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className="flex h-6 w-4 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-brand-teal"
              >
                <span className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-5 bg-brand-teal" : "w-2 bg-neutral-400/70"}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {many && (
        <div className="hidden gap-3 overflow-x-auto pb-1 md:flex" role="group" aria-label={t("label")}>
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.url}
                type="button"
                aria-label={t("image", { title, number: index + 1 })}
                aria-pressed={isActive}
                onClick={() => goTo(index)}
                className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-white transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none ${
                  isActive ? "border-brand-teal ring-2 ring-brand-teal/40" : "border-brand-teal-dark/10 opacity-80 hover:border-brand-teal/50 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-contain p-2" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
