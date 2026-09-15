export const pageByHandleQuery = /* GraphQL */ `
  query PageByHandle($handle: String!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      bodyHtml
      seo {
        title
        description
      }
    }
  }
`;
