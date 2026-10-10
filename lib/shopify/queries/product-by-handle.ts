export const productByHandleQuery = /* GraphQL */ `
  query ProductByHandle($handle: String!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      productType
      tags
      ingredients: metafield(namespace: "custom", key: "ingredients") { type value }
      legalName: metafield(namespace: "custom", key: "legal_name") { type value }
      storage: metafield(namespace: "custom", key: "storage") { type value }
      origin: metafield(namespace: "custom", key: "origin") { type value }
      manufacturerDistributor: metafield(namespace: "custom", key: "manufacturer_distributor") { type value }
      nutrition: metafield(namespace: "custom", key: "nutrition") { type value }
      availableForSale
      seo {
        title
        description
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      options {
        id
        name
        optionValues {
          name
        }
      }
      variants(first: 25) {
        edges {
          node {
            sku
            barcode
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
          }
        }
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
      collections(first: 1) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  }
`;
