import type { ReactNode } from "react";

/**
 * The single heading pattern for homepage sections: compact title with a short green marker, optional supporting line,
 * an optional action line under the title ("view all"), and an optional right-hand slot (carousel arrows). Pure presentation, so it works from server and client
 * components alike.
 */
export function SectionHeader({ id, title, subtitle, action, children }: { id: string; title: string; subtitle?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 id={id} className="flex items-center gap-2.5 text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[22px]">
          <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-brand-teal" />
          <span className="min-w-0">{title}</span>
        </h2>
        {subtitle && <p className="mt-1 pl-[14px] text-xs text-neutral-500 sm:text-sm">{subtitle}</p>}
        {action && <div className="pl-[14px]">{action}</div>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

/** Shared class for the right-hand "view all" link so every section aligns identically. */
export const viewAllLinkClass =
  "inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-neutral-900 underline decoration-1 underline-offset-4 hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";
