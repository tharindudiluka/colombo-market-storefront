export const searchProductsQuery = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    products(first: $first, query: $query, sortKey: RELEVANCE) {
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
`;
