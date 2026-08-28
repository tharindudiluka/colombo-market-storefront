const cartFragment = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              product {
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

export const cartQuery = /* GraphQL */ `
  query Cart($cartId: ID!, $language: LanguageCode) @inContext(country: DE, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${cartFragment}
`;

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($input: CartInput, $language: LanguageCode) @inContext(country: DE, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesAddMutation = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesUpdateMutation = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesRemoveMutation = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode)
  @inContext(country: DE, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;
