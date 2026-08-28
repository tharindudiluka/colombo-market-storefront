export const collectionByHandleQuery = /* GraphQL */ `
  query CollectionByHandle($handle: String!, $first: Int!, $language: LanguageCode)
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
