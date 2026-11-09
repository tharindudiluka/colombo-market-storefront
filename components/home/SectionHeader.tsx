import type { ReactNode } from "react";

/**
 * The single heading pattern for homepage sections: compact title with a short green marker, optional supporting line,
 * an optional action line under the title ("view all"), and an optional right-hand slot (carousel arrows). Pure presentation, so it works from server and client
 * components alike.
 */
export function SectionHeader({ id, title, eyebrow, subtitle, action, children }: { id: string; title: string; eyebrow?: string; subtitle?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
      <div className="min-w-0 max-w-full">
        {eyebrow && <p className="mb-0.5 pl-[14px] text-xs font-bold uppercase tracking-widest text-brand-teal-dark/70">{eyebrow}</p>}
        <h2 id={id} className="flex items-center gap-2.5 text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[22px]">
          <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-brand-teal" />
          <span className="min-w-0">{title}</span>
        </h2>
        {subtitle && <p className="mt-1 pl-[14px] text-xs text-neutral-500 sm:text-sm">{subtitle}</p>}
        {action && <div className="pl-[14px]">{action}</div>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2 sm:ml-auto">{children}</div>}
    </div>
  );
}

/** Shared class for the right-hand "view all" link so every section aligns identically. */
export const viewAllLinkClass =
  "inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-neutral-900 underline decoration-1 underline-offset-4 hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

/** Rounded "view all" button placed under a product row, aligned with the row's right arrow. */
export const viewAllButtonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand-teal bg-white px-5 text-sm font-bold text-brand-teal-dark shadow-sm transition duration-200 hover:bg-brand-teal hover:text-white hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none";
