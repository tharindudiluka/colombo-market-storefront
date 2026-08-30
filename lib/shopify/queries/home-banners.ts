export const homeBannersQuery = /* GraphQL */ `
  query HomeBanners($language: LanguageCode) @inContext(country: DE, language: $language) {
    metaobjects(type: "home_banners", first: 10) {
      edges {
        node {
          id
          handle
          image: field(key: "image") {
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          link: field(key: "link") {
            value
          }
        }
      }
    }
  }
`;
