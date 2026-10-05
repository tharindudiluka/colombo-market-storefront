export const navigationMenuQuery = /* GraphQL */ `
  query NavigationMenu($handle: String!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    shop { primaryDomain { url } }
    menu(handle: $handle) {
      title
      items {
        id
        title
        url
        type
        resource { ... on Collection { handle } ... on Page { handle } ... on Product { handle } }
        items {
          id
          title
          url
          type
          resource { ... on Collection { handle } ... on Page { handle } ... on Product { handle } }
          items {
            id
            title
            url
            type
            resource { ... on Collection { handle } ... on Page { handle } ... on Product { handle } }
          }
        }
      }
    }
  }
`;
