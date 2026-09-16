import { shopifyFetch } from "@/lib/shopify/client";
import { shopPoliciesQuery } from "@/lib/shopify/queries/shop-policies";
import type { LanguageCode, ShopPoliciesResult, ShopifyShopPolicy } from "@/lib/shopify/types";

export const policyFields = {
  "privacy-policy": "privacyPolicy",
  "contact-information": "contactInformation",
  "refund-policy": "refundPolicy",
  "terms-of-service": "termsOfService",
  "shipping-policy": "shippingPolicy",
  "legal-notice": "legalNotice",
} as const;

export type PolicyHandle = keyof typeof policyFields;

export function isPolicyHandle(handle: string): handle is PolicyHandle {
  return handle in policyFields;
}

export async function getShopPolicy(handle: PolicyHandle, language: LanguageCode): Promise<ShopifyShopPolicy | null> {
  const data = await shopifyFetch<ShopPoliciesResult>({
    query: shopPoliciesQuery,
    variables: { language },
    tags: ["shop-policies"],
  });
  return data.shop[policyFields[handle]];
}
