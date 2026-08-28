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

export type ShopifySEO = {
  title: string | null;
  description: string | null;
};

export type ShopifyCollectionDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  seo: ShopifySEO;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProductNode }[] };
};

export type CollectionByHandleResult = {
  collection: ShopifyCollectionDetail | null;
};

export type ShopifyUnitPriceMeasurement = {
  quantityUnit: string | null;
  quantityValue: number;
  referenceUnit: string | null;
  referenceValue: number;
} | null;

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  optionValues: { name: string }[];
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
  unitPrice: ShopifyMoney | null;
  unitPriceMeasurement: ShopifyUnitPriceMeasurement;
};

export type ShopifyProductDetail = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  seo: ShopifySEO;
  images: { edges: { node: ShopifyImage }[] };
  options: ShopifyProductOption[];
  variants: { edges: { node: ShopifyProductVariant }[] };
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney } | null;
  collections: { edges: { node: { handle: string; title: string } }[] };
};

export type ProductByHandleResult = {
  product: ShopifyProductDetail | null;
};

export type ProductRecommendationsResult = {
  productRecommendations: ShopifyProductNode[] | null;
};

export type SearchProductsResult = {
  products: { edges: { node: ShopifyProductNode }[] };
};

export type ShopifyCartMerchandise = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
  price: ShopifyMoney;
  product: { title: string; handle: string };
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: ShopifyCartMerchandise;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney };
  lines: { edges: { node: ShopifyCartLine }[] };
};

export type CartUserError = { field: string[] | null; message: string };

export type CartCreateResult = {
  cartCreate: { cart: ShopifyCart | null; userErrors: CartUserError[] };
};
export type CartLinesAddResult = {
  cartLinesAdd: { cart: ShopifyCart | null; userErrors: CartUserError[] };
};
export type CartLinesUpdateResult = {
  cartLinesUpdate: { cart: ShopifyCart | null; userErrors: CartUserError[] };
};
export type CartLinesRemoveResult = {
  cartLinesRemove: { cart: ShopifyCart | null; userErrors: CartUserError[] };
};
export type CartQueryResult = {
  cart: ShopifyCart | null;
};
