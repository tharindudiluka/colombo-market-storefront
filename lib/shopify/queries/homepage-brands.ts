export const homepageBrandsQuery = /* GraphQL */ `
  query HomepageBrands($after: String, $language: LanguageCode) @inContext(language: $language) {
    metaobjects(type: "homepage_brand", first: 100, after: $after) {
      nodes {
        id
        fields {
          key value
          reference { ... on MediaImage { image { url altText width height } } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
