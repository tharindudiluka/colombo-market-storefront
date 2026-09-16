export const collectionByHandleQuery = /* GraphQL */ `
  query CollectionByHandle(
    $handle: String!
    $first: Int!
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean!
  )
  @inContext(country: DE, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      products(first: $first, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
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
