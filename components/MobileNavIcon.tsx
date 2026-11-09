import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { KumaioIcon } from "@/components/KumaioIcon";
import type { MobileNavigationIconName } from "@/config/mobile-navigation";

/**
 * Icons of the mobile menu, one clear food symbol per department. Line style matches the existing icon set (24px grid,
 * 1.6 stroke, round caps); rice, pulses and wheat are drawn here, the rest come from the shared icon components.
 */
export function MobileNavIcon({ name, className }: { name: MobileNavigationIconName; className?: string }) {
  const props = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "riceBowl":
      // Bowl with a mound of rice and a few grains.
      return <svg {...props}><path d="M3.5 12.5h17a8.5 8.5 0 0 1-17 0Z" /><path d="M6.5 12.5C7 8.5 9.2 6 12 6s5 2.5 5.5 6.5" /><path d="M10 9.6l.9.7M13.3 8.7l.8.9M11.7 11.2l.8.4" /></svg>;
    case "pulses":
      // Two beans and two lentils.
      return <svg {...props}><ellipse cx="8.5" cy="9" rx="4.4" ry="2.7" transform="rotate(-35 8.5 9)" /><ellipse cx="15.5" cy="15" rx="4.4" ry="2.7" transform="rotate(-35 15.5 15)" /><circle cx="17.5" cy="6.5" r="1.8" /><circle cx="6.5" cy="17.5" r="1.8" /></svg>;
    case "wheat":
      // Ear of wheat for flour, semolina and flatbreads.
      return <svg {...props}><path d="M12 21V9" /><path d="M12 8.5c-1.4-1.3-1.4-3.7 0-5.5 1.4 1.8 1.4 4.2 0 5.5Z" /><path d="M12 13c-3.2 0-4.8-2-4.8-4.5 3.1 0 4.8 1.8 4.8 4.5ZM12 13c3.2 0 4.8-2 4.8-4.5-3.1 0-4.8 1.8-4.8 4.5Z" /><path d="M12 18c-3.2 0-4.8-2-4.8-4.5 3.1 0 4.8 1.8 4.8 4.5ZM12 18c3.2 0 4.8-2 4.8-4.5-3.1 0-4.8 1.8-4.8 4.5Z" /></svg>;
    case "kumaio":
      return <KumaioIcon className={className} />;
    default:
      return <HomepageCategoryIcon name={name} className={className} />;
  }
}
