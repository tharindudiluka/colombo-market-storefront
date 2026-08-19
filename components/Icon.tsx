export type IconName =
  | "chili"
  | "leaf"
  | "grain"
  | "sweet"
  | "spice"
  | "dal"
  | "snack"
  | "ghee"
  | "tea"
  | "paneer";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "chili":
      return (
        <svg {...props}>
          <path d="M9 4c2 0 3 1.5 3 3.5 0 3-6 3.5-8 8-1 2.2 1 4.2 3.2 3.2 4.5-2 5.8-8 5.8-11" />
          <path d="M9 4c-1.2-1.2-2.6-1.6-4-1" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...props}>
          <path d="M4 20c8 0 14-6 14-14V4h-2C8 4 4 10 4 18v2z" />
          <path d="M4 20 14 10" />
        </svg>
      );
    case "grain":
      return (
        <svg {...props}>
          <ellipse cx="12" cy="12" rx="4" ry="8" />
          <path d="M12 4v16" />
        </svg>
      );
    case "sweet":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="7" />
          <path d="M9 10c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 2-3 2-3 .3-3 2 1.3 3 3 3 3-1.3 3-3" />
        </svg>
      );
    case "spice":
      return (
        <svg {...props}>
          <path d="M6 10h12l-1.5 9h-9L6 10z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" />
        </svg>
      );
    case "dal":
      return (
        <svg {...props}>
          <path d="M4 12a8 4 0 0 0 16 0" />
          <path d="M4 12a8 4 0 0 1 16 0" />
          <circle cx="9" cy="12" r="0.8" fill="currentColor" />
          <circle cx="13" cy="13" r="0.8" fill="currentColor" />
          <circle cx="15" cy="11" r="0.8" fill="currentColor" />
        </svg>
      );
    case "snack":
      return (
        <svg {...props}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 9h6M9 13h6M9 17h3" />
        </svg>
      );
    case "ghee":
      return (
        <svg {...props}>
          <path d="M7 3h10l-1 4H8L7 3z" />
          <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7z" />
        </svg>
      );
    case "tea":
      return (
        <svg {...props}>
          <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
          <path d="M17 9h1a3 3 0 0 1 0 6h-1" />
          <path d="M8 4c0 1-1 1-1 2M12 4c0 1-1 1-1 2" />
        </svg>
      );
    case "paneer":
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="12" rx="1.5" />
          <path d="M4 10h16M9 6v12M14 6v12" />
        </svg>
      );
    default:
      return null;
  }
}
