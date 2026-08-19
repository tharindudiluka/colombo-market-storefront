export const shopInfoQuery = /* GraphQL */ `
  query ShopInfo($language: LanguageCode) @inContext(language: $language) {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`;
