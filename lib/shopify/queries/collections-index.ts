export const collectionsIndexQuery = /* GraphQL */ `
  query CollectionsIndex($first: Int!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;
