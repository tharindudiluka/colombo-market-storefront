"use server";

import { customerAccountFetch } from "@/lib/shopify/customer-client";
import {
  customerAddressCreateMutation,
  customerAddressDeleteMutation,
  customerAddressesQuery,
  customerAddressUpdateMutation,
  customerDefaultAddressUpdateMutation,
  customerOrderQuery,
  customerOrdersQuery,
  customerQuery,
  customerUpdateMutation,
} from "@/lib/shopify/queries/customer";
import { getAccessToken, getValidAccessToken } from "@/lib/customer/session";
import { toUiAddress, toUiCustomer, toUiOrder, type UiAddress, type UiCustomer, type UiOrder } from "@/lib/shopify/mappers";
import type {
  CustomerAddressCreateResult,
  CustomerAddressDeleteResult,
  CustomerAddressesResult,
  CustomerAddressUpdateResult,
  CustomerDefaultAddressUpdateResult,
  CustomerOrderResult,
  CustomerOrdersResult,
  CustomerQueryResult,
  CustomerUpdateResult,
} from "@/lib/shopify/types";

export type AddressInput = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  provinceCode?: string;
  countryCode: string;
  phoneNumber?: string;
};

// Reads below use the read-only token (see lib/customer/session.ts) since they're called
// directly during Server Component render, where Next.js forbids writing cookies —
// proxy.ts refreshes the token proactively before the request reaches render. A fetch
// failure (e.g. a token that went stale despite that) is treated the same as "not logged
// in" rather than crashing the page.

export async function getCurrentCustomer(): Promise<UiCustomer | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const data = await customerAccountFetch<CustomerQueryResult>({ query: customerQuery, accessToken });
    return data.customer ? toUiCustomer(data.customer) : null;
  } catch {
    return null;
  }
}

export async function getCustomerOrders(
  cursor?: string
): Promise<{ orders: UiOrder[]; hasNextPage: boolean; endCursor: string | null }> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { orders: [], hasNextPage: false, endCursor: null };

  try {
    const data = await customerAccountFetch<CustomerOrdersResult>({
      query: customerOrdersQuery,
      variables: { first: 10, after: cursor ?? null },
      accessToken,
    });
    const connection = data.customer?.orders;
    return {
      orders: (connection?.edges ?? []).map((edge) => toUiOrder(edge.node)),
      hasNextPage: connection?.pageInfo.hasNextPage ?? false,
      endCursor: connection?.pageInfo.endCursor ?? null,
    };
  } catch {
    return { orders: [], hasNextPage: false, endCursor: null };
  }
}

export async function getCustomerOrder(id: string): Promise<UiOrder | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const data = await customerAccountFetch<CustomerOrderResult>({
      query: customerOrderQuery,
      variables: { id },
      accessToken,
    });
    return data.order ? toUiOrder(data.order) : null;
  } catch {
    return null;
  }
}

export async function getCustomerAddresses(): Promise<UiAddress[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const data = await customerAccountFetch<CustomerAddressesResult>({
      query: customerAddressesQuery,
      accessToken,
    });
    const defaultId = data.customer?.defaultAddress?.id ?? null;
    return (data.customer?.addresses.edges ?? []).map((edge) => toUiAddress(edge.node, defaultId));
  } catch {
    return [];
  }
}

// Mutations below are only ever invoked via client-triggered transitions/form submits —
// genuine Server Action calls, where writing the refreshed session cookie is allowed.

export async function updateProfile(input: { firstName: string; lastName: string }): Promise<UiCustomer> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not logged in.");

  const data = await customerAccountFetch<CustomerUpdateResult>({
    query: customerUpdateMutation,
    variables: { input },
    accessToken,
  });
  if (data.customerUpdate.userErrors.length > 0 || !data.customerUpdate.customer) {
    throw new Error(data.customerUpdate.userErrors.map((e) => e.message).join("; ") || "Could not update profile.");
  }
  return toUiCustomer(data.customerUpdate.customer);
}

export async function createAddress(input: AddressInput): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not logged in.");

  const data = await customerAccountFetch<CustomerAddressCreateResult>({
    query: customerAddressCreateMutation,
    variables: { address: input },
    accessToken,
  });
  if (data.customerAddressCreate.userErrors.length > 0) {
    throw new Error(data.customerAddressCreate.userErrors.map((e) => e.message).join("; ") || "Could not save address.");
  }
}

export async function updateAddress(id: string, input: AddressInput): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not logged in.");

  const data = await customerAccountFetch<CustomerAddressUpdateResult>({
    query: customerAddressUpdateMutation,
    variables: { addressId: id, address: input },
    accessToken,
  });
  if (data.customerAddressUpdate.userErrors.length > 0) {
    throw new Error(
      data.customerAddressUpdate.userErrors.map((e) => e.message).join("; ") || "Could not update address."
    );
  }
}

export async function deleteAddress(id: string): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not logged in.");

  const data = await customerAccountFetch<CustomerAddressDeleteResult>({
    query: customerAddressDeleteMutation,
    variables: { addressId: id },
    accessToken,
  });
  if (data.customerAddressDelete.userErrors.length > 0) {
    throw new Error(data.customerAddressDelete.userErrors.map((e) => e.message).join("; ") || "Could not delete address.");
  }
}

export async function setDefaultAddress(id: string): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Not logged in.");

  const data = await customerAccountFetch<CustomerDefaultAddressUpdateResult>({
    query: customerDefaultAddressUpdateMutation,
    variables: { addressId: id },
    accessToken,
  });
  if (data.customerDefaultAddressUpdate.userErrors.length > 0) {
    throw new Error(
      data.customerDefaultAddressUpdate.userErrors.map((e) => e.message).join("; ") || "Could not set default address."
    );
  }
}
