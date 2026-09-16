/** Shopify page handles used by the footer. Keep these aligned with the Pages
 * and menus configured in the Shopify admin. */
export const pageHandles = {
  contact: "contact",
  about: "about-us",
  privacy: "datenschutz",
  terms: "agb",
  imprint: "impressum",
} as const;

export const pageHref = (handle: string) => `/pages/${handle}` as const;

export const policyHandles = {
  privacy: "privacy-policy",
  contact: "contact-information",
  refund: "refund-policy",
  terms: "terms-of-service",
  shipping: "shipping-policy",
  legalNotice: "legal-notice",
} as const;

export const policyHref = (handle: string) => `/policies/${handle}` as const;
