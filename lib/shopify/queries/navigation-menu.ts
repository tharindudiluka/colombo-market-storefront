export const navigationMenuQuery = /* GraphQL */ `
  query NavigationMenu($handle: String!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    menu(handle: $handle) {
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
          }
        }
      }
    }
  }
`;
