export const navigationCollectionsQuery = /* GraphQL */ `
  query NavigationCollections($first: Int!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    collections(first: $first, sortKey: TITLE) {
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
