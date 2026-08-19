export type LanguageCode = "DE" | "EN";

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney } | null;
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  image: ShopifyImage | null;
};

export type ShopInfo = {
  shop: {
    name: string;
    description: string | null;
    primaryDomain: { url: string };
  };
};

export type CollectionProductsResult = {
  collection: {
    title: string;
    products: { edges: { node: ShopifyProductNode }[] };
  } | null;
};
