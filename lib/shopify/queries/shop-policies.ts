export const shopPoliciesQuery = /* GraphQL */ `
  query ShopPolicies($language: LanguageCode)
  @inContext(country: DE, language: $language) {
    shop {
      privacyPolicy { title body handle }
      contactInformation { title body handle }
      refundPolicy { title body handle }
      termsOfService { title body handle }
      shippingPolicy { title body handle }
      legalNotice { title body handle }
    }
  }
`;
