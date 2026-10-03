export const collectionProductsQuery = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!, $language: LanguageCode, $includeQuickAdd: Boolean! = false)
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
            variants(first: 2) @include(if: $includeQuickAdd) {
              nodes { id availableForSale }
            }
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
