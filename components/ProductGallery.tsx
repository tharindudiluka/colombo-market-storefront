"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt: string }[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-cream">
        {active ? (
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-teal-dark/40">
            {title}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-20 sm:shrink-0 sm:flex-col sm:overflow-visible">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.url}
                type="button"
                aria-label={`${title} ${index + 1}`}
                aria-current={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors sm:h-20 sm:w-20 ${
                  isActive ? "border-brand-teal" : "border-black/10 hover:border-black/30"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
