export const productRecommendationsQuery = /* GraphQL */ `
  query ProductRecommendations($productId: ID!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      handle
      title
      availableForSale
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;
