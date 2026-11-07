"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import { CarouselArrow } from "@/components/CarouselArrow";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { SectionHeader, viewAllButtonClass } from "@/components/home/SectionHeader";
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
  /**
   * From lg up, place "view all" right after the last card, centred on the product images, when the whole row plus the
   * button fits. When it does not fit it stays below the row, so the cards are never squeezed.
   */
  viewAllBeside?: boolean;
};

/**
 * Titled horizontal product row: scroll-snap track (swipe on phones) with round arrow buttons at its left and right
 * edges, centred on the product images, a slider track with a draggable thumb under the row showing how far it scrolls,
 * and a "view all" button below the row aligned with the right arrow. Used by every homepage product row.
 */
export function HomeProductRow({ id, title, subtitle, href, viewAll, previous, next, locale, products, eager = false, viewAllBeside = false }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const buttonWidth = useRef(170);
  // True while the cards and the button fit on one line; only used when viewAllBeside is set.
  const [fitsBeside, setFitsBeside] = useState(true);
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  // Arrows are assumed necessary until measured, so the reserved edge space does not jump for the common long row.
  const [edge, setEdge] = useState({ scrollable: true, atStart: true, atEnd: false });
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
      setEdge({ scrollable: max > 1, atStart: element.scrollLeft <= 1, atEnd: element.scrollLeft >= max - 1 });
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
    const fit = () => {
      if (!viewAllBeside) return;
      const container = wrap.current;
      const card = element.querySelector("li");
      if (!container || !card) return;
      const measured = buttonRef.current?.offsetWidth ?? 0;
      if (measured > 0) buttonWidth.current = measured;
      const gap = parseFloat(getComputedStyle(element).columnGap) || 14;
      const cards = products.length * (card as HTMLElement).offsetWidth + (products.length - 1) * gap;
      setFitsBeside(cards + 16 + gap + buttonWidth.current <= container.clientWidth);
    };
    const observer = new ResizeObserver(() => { update(); fit(); });
    observer.observe(element);
    if (wrap.current) observer.observe(wrap.current);
    element.addEventListener("scroll", onScroll, { passive: true });
    update();
    fit();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [products, viewAllBeside]);

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

  const chevron = (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
  );
  const viewAllLink = (
    <Link ref={buttonRef} href={href} className={`${viewAllButtonClass} shrink-0`}>
      {viewAll}
      {chevron}
    </Link>
  );

  // From sm up the arrows sit at the row edges, so the track leaves room for them. On phones they move below the row.
  // When the row and the "view all" button fit on one line at lg+, the arrows are not needed and neither is their gutter.
  const gutter = edge.scrollable ? (viewAllBeside && fitsBeside ? "sm:mx-14 lg:mx-0" : "sm:mx-14") : "";

  return (
    <section
      aria-labelledby={id}
      className="mx-auto max-w-[var(--layout-max-width)] px-4"
      onPointerEnter={() => { hovering.current = true; reveal(); }}
      onPointerLeave={() => { hovering.current = false; concealSoon(400); }}
      onFocus={reveal}
      onBlur={() => concealSoon(800)}
    >
      {/* One self-contained block per row: a divider above, generous space around it, tight spacing inside. */}
      <div className="mt-8 border-t border-neutral-200 pt-8 sm:mt-10 sm:pt-10">
        <SectionHeader id={id} title={title} subtitle={subtitle} />
        <div ref={wrap} className="relative mt-4 flex flex-wrap items-center gap-x-2 gap-y-4 [--card:152px] sm:mt-5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-4 sm:gap-y-2 sm:[--card:184px] lg:[--card:212px]">
          <ul
            ref={track}
            role="group"
            aria-labelledby={id}
            tabIndex={0}
            className={`no-scrollbar order-1 flex w-[calc(100%+1rem)] max-w-none snap-x gap-2.5 overflow-x-auto pb-1 pr-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:order-none sm:col-span-2 sm:w-auto sm:gap-3.5 sm:pr-0 ${gutter}`}
          >
            {products.map((product, index) => (
              <li key={product.id} className="w-[var(--card)] shrink-0 snap-start">
                <HomeProductCard product={product} locale={locale} priority={eager && index < 4} />
              </li>
            ))}
            {viewAllBeside && (
              <li className={`hidden shrink-0 snap-start self-start ml-4 mt-[calc(var(--card)/2-1.375rem)] ${fitsBeside ? "lg:flex" : ""}`}>
                {viewAllLink}
              </li>
            )}
          </ul>
          {edge.scrollable && (
            <>
              <CarouselArrow direction="left" label={previous} state={edge.atStart ? "disabled" : "active"} onClick={() => move(-1)} className="order-2 sm:absolute sm:left-0 sm:top-[calc(var(--card)/2)] sm:order-none sm:-translate-y-1/2" />
              <CarouselArrow direction="right" label={next} state={edge.atEnd ? "disabled" : edge.atStart ? "muted" : "active"} onClick={() => move(1)} className="order-3 sm:absolute sm:right-0 sm:top-[calc(var(--card)/2)] sm:order-none sm:-translate-y-1/2" />
            </>
          )}
          {/* Desktop only: the slider track shares the last line with the "view all" button. */}
          {bar.show && (
            <div
              ref={rail}
              aria-hidden
              onClick={(event) => jumpTo(event.clientX)}
              className={`relative hidden h-1.5 min-w-0 cursor-pointer rounded-full bg-neutral-200 transition-opacity duration-300 sm:block ${edge.scrollable ? "sm:ml-14" : "sm:col-start-1"} ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
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
          <Link
            ref={viewAllBeside ? undefined : buttonRef}
            href={href}
            className={`${viewAllButtonClass} order-4 ml-auto shrink-0 sm:order-none sm:col-start-2 sm:ml-0 ${viewAllBeside && fitsBeside ? "lg:hidden" : ""}`}
          >
            {viewAll}
            {chevron}
          </Link>
        </div>
      </div>
    </section>
  );
}
