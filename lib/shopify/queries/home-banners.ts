/**
 * Both the hero (`home_banners`) and the promo tiles (`home_sub_banners`) are
 * merchant-managed metaobjects with the same shape: one `image` file field plus an
 * optional `link` single-line-text field. The `type` is a hardcoded literal, not
 * user input.
 */
function bannersQuery(type: string) {
  return /* GraphQL */ `
    query ${type === "home_banners" ? "HomeBanners" : "HomeSubBanners"}($language: LanguageCode)
    @inContext(country: DE, language: $language) {
      metaobjects(type: "${type}", first: 10) {
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
}

export const homeBannersQuery = bannersQuery("home_banners");
export const homeSubBannersQuery = bannersQuery("home_sub_banners");
