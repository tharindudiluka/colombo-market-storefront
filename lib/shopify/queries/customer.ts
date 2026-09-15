/**
 * Queries/mutations against the Customer Account API — a different GraphQL schema from
 * the Storefront API (no `@inContext` directive here). Field/mutation names below are
 * best-effort based on Shopify's documented shape; verify against the live schema
 * (introspection via Shopify's GraphiQL) once a real Client ID exists, before relying on
 * this in production.
 */

export const customerQuery = /* GraphQL */ `
  query Customer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
    }
  }
`;

export const customerUpdateMutation = /* GraphQL */ `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const orderFields = /* GraphQL */ `
  id
  name
  number
  processedAt
  financialStatus
  fulfillments(first: 1) {
    edges {
      node {
        status
      }
    }
  }
  totalPrice {
    amount
    currencyCode
  }
  lineItems(first: 10) {
    edges {
      node {
        title
        quantity
        image {
          url
          altText
        }
      }
    }
  }
`;

export const customerOrdersQuery = /* GraphQL */ `
  query CustomerOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ${orderFields}
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const customerOrderQuery = /* GraphQL */ `
  query CustomerOrder($id: ID!) {
    order(id: $id) {
      ${orderFields}
      subtotal {
        amount
        currencyCode
      }
      totalShipping {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        zip
        provinceCode
        countryCode
        phoneNumber
      }
    }
  }
`;

export const customerAddressesQuery = /* GraphQL */ `
  query CustomerAddresses {
    customer {
      defaultAddress {
        id
      }
      addresses(first: 20) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            zip
            provinceCode
            countryCode
            phoneNumber
          }
        }
      }
    }
  }
`;

export const customerAddressCreateMutation = /* GraphQL */ `
  mutation CustomerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const customerAddressUpdateMutation = /* GraphQL */ `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const customerAddressDeleteMutation = /* GraphQL */ `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

export const customerDefaultAddressUpdateMutation = /* GraphQL */ `
  mutation CustomerDefaultAddressUpdate($addressId: ID!) {
    customerDefaultAddressUpdate(addressId: $addressId) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
