import type { MetadataRoute } from "next";
import { storefrontOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Next.js JS/CSS/image assets must stay crawlable for rendered-page indexing.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/_vercel/"] },
    // Personal/search routes remain crawlable so their meta noindex can be read.
    sitemap: `${storefrontOrigin}/sitemap.xml`,
  };
}
