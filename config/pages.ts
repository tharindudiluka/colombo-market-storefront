/** Shopify page handles used by the footer. Keep these aligned with the Pages
 * and menus configured in the Shopify admin. */
export const pageHandles = {
  deliveryInfo: "delivery-info",
  returnsRefunds: "returns-refunds",
  contact: "contact",
  about: "about-us",
  careers: "careers",
  sourcing: "sourcing",
  blog: "blog",
  privacy: "datenschutz",
  terms: "agb",
  imprint: "impressum",
} as const;

export const pageHref = (handle: string) => `/pages/${handle}` as const;
