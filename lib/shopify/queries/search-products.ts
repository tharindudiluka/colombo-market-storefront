export const searchProductsQuery = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!, $language: LanguageCode, $after: String)
  @inContext(country: DE, language: $language) {
    products(first: $first, after: $after, query: $query, sortKey: RELEVANCE) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          vendor
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
