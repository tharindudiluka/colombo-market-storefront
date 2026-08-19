import type { ShopifyCollection, ShopifyProductNode } from "@/lib/shopify/types";

/**
 * Normalized shape presentation components consume. Components never import a Shopify
 * type directly — this is the seam that keeps ProductCard/ProductRow/CategoryGrid
 * decoupled from the Storefront API's GraphQL shape.
 */
export type UiProduct = {
  id: string;
  handle: string;
  title: string;
  image: { url: string; alt: string } | null;
  price: { amount: number; currencyCode: string };
  compareAtPrice: { amount: number; currencyCode: string } | null;
  availableForSale: boolean;
};

export type UiCategory = {
  handle: string;
  title: string;
  image: { url: string; alt: string } | null;
};

export function toUiProduct(node: ShopifyProductNode): UiProduct {
  const compareAtAmount = node.compareAtPriceRange?.minVariantPrice.amount;
  const priceAmount = node.priceRange.minVariantPrice.amount;
  const isOnSale = compareAtAmount !== undefined && Number(compareAtAmount) > Number(priceAmount);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    image: node.featuredImage
      ? { url: node.featuredImage.url, alt: node.featuredImage.altText ?? node.title }
      : null,
    price: {
      amount: Number(priceAmount),
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
    },
    compareAtPrice: isOnSale
      ? {
          amount: Number(compareAtAmount),
          currencyCode: node.compareAtPriceRange!.minVariantPrice.currencyCode,
        }
      : null,
    availableForSale: node.availableForSale,
  };
}

export function toUiCategory(collection: ShopifyCollection): UiCategory {
  return {
    handle: collection.handle,
    title: collection.title,
    image: collection.image
      ? { url: collection.image.url, alt: collection.image.altText ?? collection.title }
      : null,
  };
}
