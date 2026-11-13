"use client";

import { useEffect } from "react";

/**
 * Scrolls to the URL hash once the page content has mounted. These pages stream their content in after the document
 * loads, so the browser's own fragment scroll can run before the target exists. The destination's CSS scroll-margin
 * keeps its heading clear of the sticky header. Renders nothing.
 */
export function HashScroll() {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    let id = raw;
    try {
      id = decodeURIComponent(raw);
    } catch {
      /* keep the raw value */
    }
    const target = document.getElementById(id);
    if (!target) return;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
