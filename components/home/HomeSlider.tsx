"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CarouselArrow } from "@/components/CarouselArrow";
import { homeSlides, placeholderSlideCount, type HomeSlide, type HomeSlideImage } from "@/config/home-slides";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

type Resolved = { image: HomeSlideImage | null; ratio: number | null };

function resolve(slide: HomeSlide | null, locale: string): Resolved {
  const image = slide?.image ? (locale === "en" && slide.image.en ? slide.image.en : slide.image.de) : null;
  return { image, ratio: image ? image.width / image.height : null };
}

/**
 * One slide. The banner is always shown whole (object-contain); any leftover side strip takes the slide's
 * `background` colour (matched to the banner's edge in config/home-slides.ts), so nothing is cropped and no bars show.
 */
function SlideBody({ image, index }: { image: HomeSlideImage | null; index: number }) {
  if (!image) return <div aria-hidden className="h-full w-full bg-neutral-100" />;
  return (
    <span className="relative block h-full w-full overflow-hidden" style={{ background: image.background ?? "#ffffff" }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={index === 0}
        sizes="(min-width: 1280px) 1376px, 100vw"
        className={`object-contain ${image.mobile ? "hidden sm:block" : ""}`}
      />
      {image.mobile && (
        <Image src={image.mobile.src} alt={image.alt} fill priority={index === 0} sizes="100vw" className="object-cover sm:hidden" />
      )}
    </span>
  );
}

/** Promotional slider: swipe/scroll-snap track, arrows, dots and keyboard arrows. Slides are configured in config/home-slides.ts. */
export function HomeSlider() {
  const t = useTranslations("homePage.slider");
  const locale = useLocale();
  const slides: (HomeSlide | null)[] = homeSlides.length ? homeSlides : Array.from({ length: placeholderSlideCount }, () => null);
  const resolved = slides.map((slide) => resolve(slide, locale));
  // The slider reserves one box (the widest banner ratio, i.e. the shortest height), so switching slides never moves the page.
  const ratios = resolved.flatMap((entry) => (entry.ratio ? [entry.ratio] : []));
  const boxRatio = ratios.length ? Math.max(...ratios) : 5 / 2;
  // Phones switch to a square slider only when every slide ships a mobile image (see config/home-slides.ts).
  const squareOnPhone = resolved.length > 0 && resolved.every((entry) => Boolean(entry.image?.mobile));
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const element = track.current;
    if (!element) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    element.scrollTo({ left: clamped * element.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setActive(Math.round(element.scrollLeft / Math.max(1, element.clientWidth)));
    element.addEventListener("scroll", update, { passive: true });
    return () => element.removeEventListener("scroll", update);
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
  }

  const many = slides.length > 1;
  const slideLinkClass = "block h-full w-full focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-brand-teal";
  const linkLabel = (slide: HomeSlide) => (slide.linkLabel ? (locale === "en" ? slide.linkLabel.en : slide.linkLabel.de) : undefined);

  return (
    <section aria-roledescription="carousel" aria-label={t("label")} className="relative -mx-4 sm:mx-0">
      <div
        ref={track}
        role="group"
        tabIndex={0}
        aria-label={t("label")}
        onKeyDown={onKeyDown}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto sm:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
      >
        {slides.map((slide, index) => {
          const body = <SlideBody image={resolved[index].image} index={index} />;
          return (
            <div
              key={slide?.id ?? `placeholder-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
              style={{ "--slide-ratio": boxRatio } as CSSProperties}
              className={`w-full shrink-0 snap-center overflow-hidden border-y border-neutral-200 sm:border-x ${squareOnPhone ? "aspect-square sm:aspect-[var(--slide-ratio)]" : "aspect-[var(--slide-ratio)]"}`}
            >
              {slide?.href ? (
                isExternal(slide.href) ? (
                  <a href={slide.href} aria-label={linkLabel(slide)} className={slideLinkClass}>{body}</a>
                ) : (
                  <Link href={slide.href} aria-label={linkLabel(slide)} className={slideLinkClass}>{body}</Link>
                )
              ) : (
                body
              )}
            </div>
          );
        })}
      </div>

      {many && (
        <>
          <CarouselArrow direction="left" label={t("previous")} state={active <= 0 ? "disabled" : "active"} onClick={() => goTo(active - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 max-sm:hidden" />
          <CarouselArrow direction="right" label={t("next")} state={active >= slides.length - 1 ? "disabled" : active <= 0 ? "muted" : "active"} onClick={() => goTo(active + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 max-sm:hidden" />
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide?.id ?? `dot-${index}`}
                type="button"
                aria-label={t("goTo", { number: index + 1 })}
                aria-current={index === active}
                onClick={() => goTo(index)}
                className="flex h-6 w-4 items-center justify-center focus-visible:outline-2 focus-visible:outline-brand-teal"
              >
                <span className={`h-2 rounded-full transition-all ${index === active ? "w-5 bg-brand-teal" : "w-2 bg-neutral-400/70"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
