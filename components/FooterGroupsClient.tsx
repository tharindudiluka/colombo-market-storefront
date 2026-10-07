"use client";

import { useState, type ReactNode } from "react";

/** Links are supplied by the server; CSS keeps the same groups expanded on desktop. */
export function FooterGroupsClient({ groups }: {
  groups: { key: string; title: string; content: ReactNode }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return <>{groups.map(group => <nav key={group.key} aria-labelledby={`footer-${group.key}`} className="border-t border-white/15 md:border-0">
    <h2 id={`footer-${group.key}`} className="text-sm font-semibold uppercase tracking-widest text-category-turmeric">
      <span className="hidden md:block">{group.title}</span>
      <button type="button" aria-expanded={open === group.key} aria-controls={`footer-panel-${group.key}`} onClick={() => setOpen(open === group.key ? null : group.key)} className="flex min-h-14 w-full items-center justify-between gap-4 text-left focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-category-turmeric md:hidden">
        {group.title}
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open === group.key ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
    </h2>
    <div id={`footer-panel-${group.key}`} className="footer-group-panel" data-open={open === group.key}>
      <div className="min-h-0 overflow-hidden">{group.content}</div>
    </div>
  </nav>)}</>;
}
