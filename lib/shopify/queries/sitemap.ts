export function sitemapResourcesQuery(resource: "products" | "collections" | "pages") {
  return /* GraphQL */ `
    query SitemapResources($after: String, $language: LanguageCode!)
    @inContext(country: DE, language: $language) {
      ${resource}(first: 250, after: $after) {
        nodes { handle updatedAt }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
}
