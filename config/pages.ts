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

// Local frontend-authored page destinations for existing Shopify menu items.
// Menu IDs stay the same across locales; hierarchy and labels remain in Shopify.
export const localMenuPageHrefs: Partial<Record<string, string>> = {
  "gid://shopify/MenuItem/808947941723": pageHref(pageHandles.about),
};

export const policyHandles = {
  privacy: "privacy-policy",
  contact: "contact-information",
  refund: "refund-policy",
  terms: "terms-of-service",
  shipping: "shipping-policy",
  legalNotice: "legal-notice",
} as const;

/** Stable section ids on the shipping policy and About page, targeted by the homepage benefit cards. */
export const shippingAnchors = { costs: "shipping-costs", freeShipping: "free-shipping", delivery: "delivery-germany" } as const;
/**
 * How the shipping policy's headings map to the stable ids above. The policy is merchant-written in Shopify and its
 * headings differ per language. Prefix entries also catch headings such as "Free shipping from 39,99 EUR".
 */
export const shippingPolicyHeadingAnchors: Record<string, string> = {
  versandkosten: shippingAnchors.costs,
  "shipping-costs": shippingAnchors.costs,
  lieferzeit: shippingAnchors.delivery,
  "shipping-methods-delivery-times": shippingAnchors.delivery,
};
export const shippingPolicyFreeShippingPrefixes: Record<string, string> = {
  "free-shipping": shippingAnchors.freeShipping,
  "kostenloser-versand": shippingAnchors.freeShipping,
  "kostenlose-lieferung": shippingAnchors.freeShipping,
  versandkostenfrei: shippingAnchors.freeShipping,
};
export const aboutAnchors = { storeDirections: "store-directions" } as const;

export const policyHref = (handle: string) => `/policies/${handle}` as const;
