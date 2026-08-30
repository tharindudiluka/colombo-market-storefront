"use client";

import { useEffect, useRef, useState } from "react";

const SPEED_PX_PER_SEC = 40;
const RESUME_DELAY_MS = 2000;
// Repeated announcement blocks either side of the visible one. Three blocks —
// one before, one shown, one after — is the minimum for a seam-free loop that
// can also be dragged in either direction.
const BLOCKS = 3;

type AnnouncementBarClientProps = {
  items: string[];
  regionLabel: string;
};

export function AnnouncementBarClient({
  items,
  regionLabel,
}: AnnouncementBarClientProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Number of times the announcement list is repeated. Resolved after mount so
  // one repeat block is always at least as wide as the viewport.
  const [copies, setCopies] = useState(4);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    let cleanup = () => {};

    const measureAndRun = () => {
      const viewport = el.clientWidth;
      const groupWidth = el.scrollWidth / copies;
      // Layout not ready yet — try again on the next frame.
      if (viewport === 0 || groupWidth === 0) {
        frame = requestAnimationFrame(measureAndRun);
        return;
      }

      const perBlock = Math.max(1, Math.ceil(viewport / groupWidth));
      const needed = perBlock * BLOCKS;
      if (needed !== copies) {
        setCopies(needed);
        return;
      }

      const blockWidth = groupWidth * perBlock;

      // Own the scroll position so sub-pixel steps accumulate (browsers would
      // otherwise round a slow `scrollLeft +=` down to nothing).
      let pos = blockWidth;
      el.scrollLeft = pos;

      const loopBack = (value: number) => {
        if (value >= blockWidth * 2) return value - blockWidth;
        if (value < blockWidth) return value + blockWidth;
        return value;
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const onScroll = () => {
          const corrected = loopBack(el.scrollLeft);
          if (corrected !== el.scrollLeft) el.scrollLeft = corrected;
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        cleanup = () => el.removeEventListener("scroll", onScroll);
        return;
      }

      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (pausedRef.current) {
          // Follow the user's manual scroll, still looping seamlessly.
          const corrected = loopBack(el.scrollLeft);
          pos = corrected;
          if (corrected !== el.scrollLeft) el.scrollLeft = corrected;
        } else {
          pos = loopBack(pos + SPEED_PX_PER_SEC * dt);
          el.scrollLeft = pos;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      cleanup = () => cancelAnimationFrame(frame);
    };

    measureAndRun();

    const onResize = () => {
      cleanup();
      cleanup = () => {};
      cancelAnimationFrame(frame);
      measureAndRun();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cleanup();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [copies]);

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

  return (
    <div className="bg-brand-gold text-brand-teal-dark text-xs font-medium sm:text-sm">
      <div
        role="region"
        aria-label={regionLabel}
        className="mx-auto max-w-[var(--layout-max-width)]"
      >
        <div
          ref={scrollerRef}
          onMouseEnter={pause}
          onMouseLeave={scheduleResume}
          onTouchStart={pause}
          onTouchEnd={scheduleResume}
          onWheel={() => {
            pause();
            scheduleResume();
          }}
          onFocusCapture={pause}
          onBlurCapture={scheduleResume}
          className="no-scrollbar flex overflow-x-auto"
        >
          {Array.from({ length: copies }).map((_, copy) => (
            <div
              key={copy}
              aria-hidden={copy !== 0}
              className="flex shrink-0 items-center"
            >
              {items.map((text, i) => (
                <span
                  key={i}
                  className="flex items-center whitespace-nowrap py-2"
                >
                  <span aria-hidden className="px-3 opacity-40">
                    •
                  </span>
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
