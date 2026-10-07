import { HomepageCategoryIcon, type HomepageCategoryIconName } from "@/components/HomepageCategoryIcon";

export type DiscoveryIconName = HomepageCategoryIconName | "peppercorns" | "cardamom" | "cinnamon" | "coconut" | "flour" | "wheat" | "flatbread" | "batter";

// Small catalog-specific additions, matching the existing line icon family.
export function CollectionDiscoveryIcon({ name, className }: { name: DiscoveryIconName; className?: string }) {
  const props = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "peppercorns": return <svg {...props}><circle cx="8" cy="8" r="3" /><circle cx="16" cy="10" r="3" /><circle cx="10" cy="17" r="3" /><path d="m7 7 1-1m7 3 1-1m-7 8 1-1" /></svg>;
    case "cardamom": return <svg {...props}><path d="M5 19C1 11 5 5 10 3c3 7 1 13-5 16Zm11 1c-4-5-3-11 2-15 5 5 4 11-2 15ZM5 19l5-16m6 17 2-15" /></svg>;
    case "cinnamon": return <svg {...props}><path d="m5 18 9-13c1-2 5 0 4 2L9 20c-1 2-5 0-4-2Zm2-1 9-13m-4 16 9-12M5 18c2-2 5 0 4 2" /></svg>;
    case "coconut": return <svg {...props}><path d="M3 12c0 5 4 9 9 9s9-4 9-9H3Z" /><ellipse cx="12" cy="12" rx="9" ry="4" /><ellipse cx="12" cy="12" rx="6" ry="2" /><path d="m6 17 1 2m10-2-1 2M8 5l2 2m5-4-1 3" /></svg>;
    case "flour": return <svg {...props}><path d="M7 3h10l-1 5c5 7 5 13-4 13S3 15 8 8L7 3ZM8 8h8M8 15h8" /><path d="M12 10v8m-2-6 2 2 2-2" /></svg>;
    case "wheat": return <svg {...props}><path d="M12 3v18M12 8C8 8 7 6 7 3c3 0 5 2 5 5Zm0 4c4 0 5-2 5-5-3 0-5 2-5 5Zm0 4c-4 0-5-2-5-5 3 0 5 2 5 5Zm0 4c4 0 5-2 5-5-3 0-5 2-5 5Z" /></svg>;
    case "flatbread": return <svg {...props}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M3 14c0 4 18 4 18 0M7 10h.01M12 8h.01M16 12h.01M10 14h.01" /></svg>;
    case "batter": return <svg {...props}><path d="M3 12h18c-1 6-4 9-9 9s-8-3-9-9Zm9 0 7-9M7 6v2m4-4v3" /></svg>;
    default: return <HomepageCategoryIcon name={name} className={className} />;
  }
}
