import { defineRouting } from "next-intl/routing";
import { site } from "@/config/site";

export const routing = defineRouting({
  locales: site.locale.supported,
  defaultLocale: site.locale.default,
  localePrefix: "as-needed",
  localeDetection: false,
});
