"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt: string }[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("product.gallery");
  const active = images[activeIndex] ?? null;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-brand-teal-dark/10 bg-stone-50">
        {active ? (
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt || title}
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 1400px) 650px, (min-width: 1024px) 46vw, (min-width: 768px) 700px, 100vw"
            className="object-contain p-6 sm:p-10 lg:p-12"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-teal-dark/40">
            {title}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2" role="group" aria-label={t("label")}>
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.url}
                type="button"
                aria-label={t("image", { title, number: index + 1 })}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:h-20 sm:w-20 ${
                  isActive ? "border-brand-teal ring-1 ring-brand-teal" : "border-brand-teal-dark/10 hover:border-brand-teal/50"
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
