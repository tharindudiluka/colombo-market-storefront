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
  | "paneer"
  | "fish"
  | "snowflake"
  | "jar"
  | "rice"
  | "tag"
  | "store"
  | "cookie"
  | "bottle"
  | "package";

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
    case "cookie":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="8" cy="9" r="1" /><circle cx="15" cy="8" r="1" /><circle cx="12" cy="14" r="1" /><circle cx="7" cy="16" r="1" /><circle cx="17" cy="15" r="1" /></svg>;
    case "bottle":
      return <svg {...props}><path d="M9 3h6v5l3 4v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7l3-4V3ZM9 6h6M6 13h12M6 17h12" /></svg>;
    case "package":
      return <svg {...props}><path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10M7.5 5l9 4" /></svg>;
    case "store":
      return <svg {...props}><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0M9 20v-6h6v6" /></svg>;
    case "fish":
      return <svg {...props}><path d="M4 12c4-7 11-7 15 0-4 7-11 7-15 0Z" /><path d="m19 12 3-4v8l-3-4M9 7c2 3 2 7 0 10" /><circle cx="6.5" cy="11" r="0.5" fill="currentColor" /></svg>;
    case "snowflake":
      return <svg {...props}><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M7 19l1-4-4-1M17 5l-1 4 4 1" /></svg>;
    case "jar":
      return <svg {...props}><rect x="6" y="7" width="12" height="14" rx="3" /><path d="M7 3h10v4H7zM6 12h12M6 17h12" /></svg>;
    case "rice":
      return <svg {...props}><path d="M4 12h16a8 8 0 0 1-16 0ZM6 12c0-4 12-4 12 0M9 5l1 2M14 4l-1 2M17 6l-1 2" /></svg>;
    case "tag":
      return <svg {...props}><path d="m3 4 8-1 10 10-8 8L3 11V4Z" /><circle cx="7" cy="7" r="1" /></svg>;
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
