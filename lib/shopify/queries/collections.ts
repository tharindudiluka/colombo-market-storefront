import { categoryHandles } from "@/config/collections";

/**
 * Builds one aliased `collection(handle: ...)` field per entry in config/collections.ts,
 * so the query itself never hardcodes a handle — adding/removing a category is a config
 * edit, not a query edit. The alias is each entry's labelKey (already a valid GraphQL
 * name), and the response is keyed the same way.
 */
export function buildHomeCollectionsQuery() {
  const fields = categoryHandles
    .map(
      ({ handle, labelKey }) => `
      ${labelKey}: collection(handle: "${handle}") {
        id
        handle
        title
        image {
          url
          altText
        }
      }`
    )
    .join("\n");

  return /* GraphQL */ `
    query HomeCollections($language: LanguageCode) @inContext(language: $language) {
      ${fields}
    }
  `;
}
