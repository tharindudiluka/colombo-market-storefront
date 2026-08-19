export const collectionProductsQuery = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        edges {
          node {
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
      }
    }
  }
`;
