"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * A hero item is either a merchant-managed banner image (from the `home_banners`
 * Shopify metaobject) or the built-in gradient + copy slide used as a fallback
 * when no banners are configured.
 */
export type HeroItem =
  | { kind: "image"; id: string; url: string; alt: string; href: string | null }
  | {
      kind: "content";
      id: string;
      href: string;
      accent: string;
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
    };

const AUTO_ADVANCE_MS = 5000;
const RESUME_DELAY_MS = 4000;

/**
 * A merchant banner image, optionally clickable. The first image carries live copy;
 * the link (if any) comes from the metaobject's `link` field: an internal path
 * (`/collections/x`) routes client-side; anything else opens in a new tab.
 */
function HeroImageSlide({
  url,
  alt,
  href,
  priority,
}: {
  url: string;
  alt: string;
  href: string | null;
  priority: boolean;
}) {
  const t = useTranslations("hero.mainBanner");
  const className = "relative block h-full w-full shrink-0 snap-center";
  const image = (
    <Image
      src={url}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 768px) 66vw, 100vw"
      className="object-cover"
    />
  );

  if (priority) {
    return (
      <div className={className}>
        {href ? href.startsWith("/") ? (
          <Link href={href} className="absolute inset-0" aria-label={alt}>{image}</Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={alt}>{image}</a>
        ) : image}
        <div className="hero-banner-copy absolute inset-y-0 flex flex-col justify-center text-brand-teal-dark">
          <h1 className="font-heading font-extrabold tracking-tight">{t("heading")}</h1>
          <p>{t("body")}</p>
          <Link href="/collections" className="w-fit rounded-full bg-brand-teal font-bold text-white transition-colors hover:bg-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-dark">
            {t("cta")}
          </Link>
        </div>
      </div>
    );
  }

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

export function HeroCarouselClient({ items }: { items: HeroItem[] }) {
  const t = useTranslations("hero");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const count = items.length;

  const goToSlide = (index: number) => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const target = ((index % count) + count) % count;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  // Auto-advance — paused while the pointer/finger is on the banner or just left it.
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      const el = scrollerRef.current;
      if (pausedRef.current || !el || el.clientWidth === 0) return;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: ((current + 1) % count) * el.clientWidth, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count]);

  // Keep the dot indicator in sync with manual scrolling / swiping.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let debounce: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (el.clientWidth > 0) setActive(Math.round(el.scrollLeft / el.clientWidth));
      }, 100);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(debounce);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const scheduleResume = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  };

  if (count === 0) return null;

  return (
    <div className="relative aspect-[5/2] w-full overflow-hidden rounded-2xl">
      <div
        ref={scrollerRef}
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {items.map((item, i) =>
          item.kind === "image" ? (
            <HeroImageSlide
              key={item.id}
              url={item.url}
              alt={item.alt}
              href={item.href}
              priority={i === 0}
            />
          ) : (
            <div
              key={item.id}
              className={`flex h-full w-full shrink-0 snap-center flex-col justify-center bg-gradient-to-br p-5 text-white md:p-8 ${item.accent}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {item.eyebrow}
              </p>
              <h2 className="font-heading mt-1.5 max-w-xs text-xl font-extrabold leading-tight sm:mt-2 sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-2 hidden max-w-sm text-sm text-white/90 sm:block">{item.body}</p>
              <a
                href={item.href}
                className="mt-3 w-fit rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-teal-dark sm:mt-4 sm:py-2"
              >
                {item.cta}
              </a>
            </div>
          ),
        )}
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              aria-label={t("slideLabel", { number: i + 1 })}
              aria-current={i === active}
              onClick={() => {
                pause();
                goToSlide(i);
                scheduleResume();
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
