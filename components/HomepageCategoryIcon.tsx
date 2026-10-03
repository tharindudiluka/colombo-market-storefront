import { Icon, type IconName } from "@/components/Icon";

export type HomepageCategoryIconName = IconName | "bread" | "mortar" | "vegetables" | "candy" | "wheatFree";

/** Food-specific homepage additions use the existing icon system's line style. */
export function HomepageCategoryIcon({ name, className }: { name: HomepageCategoryIconName; className?: string }) {
  const props = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "bread":
      return <svg {...props}><path d="M5 10C1 9 2 3 7 4c2-2 8-2 10 0 5-1 6 5 2 6v10H5V10Z" /><path d="m9 8-1 3m5-4-1 3m5-2-1 3M5 16h14" /></svg>;
    case "mortar":
      return <svg {...props}><path d="M3 11h18c-1 6-4 9-9 9s-8-3-9-9ZM7 21h10M12 11l5-7a2 2 0 0 1 3 2l-4 5" /><path d="M6 8h.01M9 6h.01" /></svg>;
    case "vegetables":
      return <svg {...props}><path d="M8 20c-5-3-5-8-2-10-1-4 3-6 6-3 3-3 7-1 6 3 3 2 3 7-2 10H8Z" /><path d="M12 21V9m0 7-4-4m4 1 3-3m-3 9 4-3" /></svg>;
    case "candy":
      return <svg {...props}><rect x="7" y="8" width="10" height="8" rx="3" /><path d="m7 10-4-3v10l4-3m10-4 4-3v10l-4-3M10 8l4 8" /></svg>;
    case "wheatFree":
      return <svg {...props}><path d="M12 4v16M12 8C8 8 7 6 7 4c3 0 5 1 5 4ZM12 12c4 0 5-2 5-4-3 0-5 1-5 4ZM12 16c-4 0-5-2-5-4 3 0 5 1 5 4ZM3 3l18 18" /></svg>;
    default:
      return <Icon name={name} className={className} />;
  }
}
