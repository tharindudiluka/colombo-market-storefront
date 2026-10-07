"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type DepartmentTab = { key: string; title: string; icon: ReactNode };

/** All server-rendered panels stay in the DOM; only visibility changes. */
export function CollectionDiscoveryTabsClient({ tabs, label, panels }: {
  tabs: DepartmentTab[];
  label: string;
  panels: ReactNode[];
}) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % tabs.length; break;
      case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
    buttons.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return <>
    <div className="my-6 rounded-xl border border-brand-teal/10 bg-white/80 p-3 sm:my-8 sm:p-5">
      <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-brand-teal">{label}</p>
      <div role="tablist" aria-label={label} aria-orientation="horizontal" className="collection-discovery-tabs flex gap-2 overflow-x-auto p-1 xl:flex-wrap">
        {tabs.map((tab, index) => <button
          key={tab.key}
          ref={button => { buttons.current[index] = button; }}
          type="button"
          role="tab"
          id={`discovery-tab-${tab.key}`}
          aria-controls={`discovery-panel-${tab.key}`}
          aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)}
          onKeyDown={event => onKeyDown(event, index)}
          className={`inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${selected === index ? "bg-brand-teal-dark text-white" : "bg-category-sage/30 text-brand-teal-dark hover:bg-category-sage"}`}
        >{tab.icon}{tab.title}</button>)}
      </div>
    </div>
    {tabs.map((tab, index) => <div
      key={tab.key}
      role="tabpanel"
      id={`discovery-panel-${tab.key}`}
      aria-labelledby={`discovery-tab-${tab.key}`}
      hidden={selected !== index}
      tabIndex={0}
      className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
    >{panels[index]}</div>)}
  </>;
}
