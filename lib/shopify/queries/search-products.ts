export const searchProductsQuery = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!, $language: LanguageCode, $after: String, $withText: Boolean! = false)
  @inContext(country: DE, language: $language) {
    products(first: $first, after: $after, query: $query, sortKey: RELEVANCE) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          vendor
          handle
          title
          productType
          tags
          description @include(if: $withText)
          availableForSale
          variants(first: 2) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
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
`;
