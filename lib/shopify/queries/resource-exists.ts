// Keep the pre-stream route check small: page data is still fetched by the page.
export const productExistsQuery = `
  query ProductExists($handle: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    resource: product(handle: $handle) { id }
  }
`;

export const collectionExistsQuery = `
  query CollectionExists($handle: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    resource: collection(handle: $handle) { id }
  }
`;
