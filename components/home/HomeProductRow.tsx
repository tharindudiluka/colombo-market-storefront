"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { SectionHeader, viewAllLinkClass } from "@/components/home/SectionHeader";
import type { UiProduct } from "@/lib/shopify/mappers";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  viewAll: string;
  previous: string;
  next: string;
  locale: string;
  products: UiProduct[];
  /** The first row above the fold loads its first images eagerly. */
  eager?: boolean;
};

/**
 * Titled horizontal product row: scroll-snap track (swipe on phones), "view all" and arrow buttons in the header, and a
 * slider track with a draggable thumb under the row showing how far it scrolls.
 */
export function HomeProductRow({ id, title, subtitle, href, viewAll, previous, next, locale, products, eager = false }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  const [edge, setEdge] = useState({ previous: false, next: false });
  const [bar, setBar] = useState({ show: false, width: 100, left: 0 });
  // The slider track only appears while the row is hovered, focused, scrolling or being dragged, then fades out.
  const [active, setActive] = useState(false);
  const hovering = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function reveal() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setActive(true);
  }
  function concealSoon(delay: number) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!hovering.current && !drag.current) setActive(false);
    }, delay);
  }

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const max = element.scrollWidth - element.clientWidth;
      const width = Math.min(100, (element.clientWidth / Math.max(1, element.scrollWidth)) * 100);
      setEdge({ previous: element.scrollLeft > 1, next: element.scrollLeft < max - 1 });
      setBar({ show: max > 1, width, left: max > 0 ? (element.scrollLeft / max) * (100 - width) : 0 });
    };
    const onScroll = () => {
      update();
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setActive(true);
      hideTimer.current = setTimeout(() => {
        if (!hovering.current && !drag.current) setActive(false);
      }, 1200);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [products]);

  const move = (direction: number) => track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.85, behavior: "smooth" });

  // Slider track: drag the thumb, or click the track to jump there.
  function jumpTo(clientX: number) {
    const element = track.current;
    const railElement = rail.current;
    if (!element || !railElement) return;
    const rect = railElement.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    element.scrollTo({ left: ratio * (element.scrollWidth - element.clientWidth), behavior: "smooth" });
  }
  function onThumbDown(event: PointerEvent<HTMLSpanElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, scroll: track.current?.scrollLeft ?? 0 };
  }
  function onThumbMove(event: PointerEvent<HTMLSpanElement>) {
    const element = track.current;
    const railElement = rail.current;
    if (!drag.current || !element || !railElement) return;
    const scale = element.scrollWidth / railElement.getBoundingClientRect().width;
    element.scrollLeft = drag.current.scroll + (event.clientX - drag.current.x) * scale;
  }

  const arrow = "hidden h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:opacity-40 disabled:hover:bg-neutral-100 sm:flex";

  return (
    <section
      aria-labelledby={id}
      className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-7 sm:pt-8"
      onPointerEnter={() => { hovering.current = true; reveal(); }}
      onPointerLeave={() => { hovering.current = false; concealSoon(400); }}
      onFocus={reveal}
      onBlur={() => concealSoon(800)}
    >
      <SectionHeader id={id} title={title} subtitle={subtitle}>
        <Link href={href} className={viewAllLinkClass}>{viewAll}</Link>
        <button type="button" aria-label={previous} disabled={!edge.previous} onClick={() => move(-1)} className={arrow}><span aria-hidden>←</span></button>
        <button type="button" aria-label={next} disabled={!edge.next} onClick={() => move(1)} className={arrow}><span aria-hidden>→</span></button>
      </SectionHeader>
      <ul
        ref={track}
        role="group"
        aria-labelledby={id}
        tabIndex={0}
        className="no-scrollbar -mx-4 mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:mx-0 sm:gap-3.5 sm:px-0"
      >
        {products.map((product, index) => (
          <li key={product.id} className="w-[152px] shrink-0 snap-start sm:w-[184px] lg:w-[212px]">
            <HomeProductCard product={product} locale={locale} priority={eager && index < 4} />
          </li>
        ))}
      </ul>
      {bar.show && (
        <div
          ref={rail}
          aria-hidden
          onClick={(event) => jumpTo(event.clientX)}
          className={`relative mt-2 h-1.5 cursor-pointer rounded-full bg-neutral-200 transition-opacity duration-300 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <span
            onPointerDown={onThumbDown}
            onPointerMove={onThumbMove}
            onPointerUp={() => { drag.current = null; if (!hovering.current) concealSoon(800); }}
            onClick={(event) => event.stopPropagation()}
            style={{ width: `${bar.width}%`, left: `${bar.left}%` }}
            className="absolute inset-y-0 cursor-grab touch-none rounded-full bg-neutral-500 hover:bg-neutral-600 active:cursor-grabbing"
          />
        </div>
      )}
    </section>
  );
}
