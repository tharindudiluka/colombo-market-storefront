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
  vendor?: string;
  variants?: { nodes: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; compareAtPrice: { amount: string; currencyCode: string } | null }[] };
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

export type ShopifyShopPolicy = {
  title: string;
  body: string;
  handle: string;
};

export type ShopPoliciesResult = {
  shop: {
    privacyPolicy: ShopifyShopPolicy | null;
    contactInformation: ShopifyShopPolicy | null;
    refundPolicy: ShopifyShopPolicy | null;
    termsOfService: ShopifyShopPolicy | null;
    shippingPolicy: ShopifyShopPolicy | null;
    legalNotice: ShopifyShopPolicy | null;
  };
};

export type CollectionProductsResult = {
  collection: {
    title: string;
    products: { edges: { node: ShopifyProductNode }[] };
  } | null;
};

export type CollectionsIndexResult = {
  collections: { nodes: ShopifyCollection[] };
};

export type ShopifyMenuItem = {
  id: string;
  title: string;
  url: string | null;
  type: string;
  resource?: { handle: string } | null;
  items?: ShopifyMenuItem[];
};

export type NavigationMenuResult = {
  shop: { primaryDomain: { url: string } };
  menu: { title: string; items: ShopifyMenuItem[] } | null;
};

export type ShopifySEO = {
  title: string | null;
  description: string | null;
};

export type ShopifyPage = {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  bodyHtml: string;
  seo: ShopifySEO;
};

export type PageByHandleResult = {
  page: ShopifyPage | null;
};

export type ShopifyCollectionDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  seo: ShopifySEO;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProductNode }[];
    filters: ShopifyProductFilter[];
  };
};

export type ShopifyProductFilter = {
  id: string;
  label: string;
  type: string;
  values: { id: string; label: string; count: number; input: unknown }[];
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
  sku: string | null;
  barcode: string | null;
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

export type ShopifyProductInformationMetafield = { type: string; value: string };

export type ShopifyProductDetail = {
  ingredients?: ShopifyProductInformationMetafield | null;
  legalName?: ShopifyProductInformationMetafield | null;
  storage?: ShopifyProductInformationMetafield | null;
  origin?: ShopifyProductInformationMetafield | null;
  manufacturerDistributor?: ShopifyProductInformationMetafield | null;
  nutrition?: ShopifyProductInformationMetafield | null;
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
  products: { edges: { node: ShopifyProductNode }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
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

export type ShopifyMetaobjectImageField = {
  reference: { image: ShopifyImage } | null;
} | null;

export type ShopifyHomeBannerNode = {
  id: string;
  handle: string;
  image: ShopifyMetaobjectImageField;
  link: { value: string } | null;
};

export type HomeBannersResult = {
  metaobjects: { edges: { node: ShopifyHomeBannerNode }[] };
};

// --- Customer Account API ---------------------------------------------------------
// Separate schema from the Storefront API above (no @inContext, different ID scoping).

export type ShopifyCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  phoneNumber: { phoneNumber: string } | null;
};

export type CustomerUserError = { field: string[] | null; message: string };

export type CustomerQueryResult = {
  customer: ShopifyCustomer | null;
};

export type CustomerUpdateResult = {
  customerUpdate: { customer: ShopifyCustomer | null; userErrors: CustomerUserError[] };
};

export type ShopifyCustomerAddress = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip: string | null;
  provinceCode: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
};

export type ShopifyOrderLineItem = {
  title: string;
  quantity: number;
  image: ShopifyImage | null;
  price?: ShopifyMoney;
};

export type ShopifyOrder = {
  id: string;
  name: string;
  number: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillments: { edges: { node: { status: string } }[] };
  totalPrice: ShopifyMoney;
  subtotal?: ShopifyMoney;
  totalShipping?: ShopifyMoney;
  totalTax?: ShopifyMoney;
  lineItems: { edges: { node: ShopifyOrderLineItem }[] };
  shippingAddress?: ShopifyCustomerAddress | null;
};

export type CustomerOrdersResult = {
  customer: {
    orders: {
      edges: { node: ShopifyOrder }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } | null;
};

export type CustomerOrderResult = {
  order: ShopifyOrder | null;
};

export type CustomerAddressesResult = {
  customer: {
    defaultAddress: { id: string } | null;
    addresses: { edges: { node: ShopifyCustomerAddress }[] };
  } | null;
};

export type CustomerAddressCreateResult = {
  customerAddressCreate: { customerAddress: { id: string } | null; userErrors: CustomerUserError[] };
};
export type CustomerAddressUpdateResult = {
  customerAddressUpdate: { customerAddress: { id: string } | null; userErrors: CustomerUserError[] };
};
export type CustomerAddressDeleteResult = {
  customerAddressDelete: { deletedAddressId: string | null; userErrors: CustomerUserError[] };
};
export type CustomerDefaultAddressUpdateResult = {
  customerDefaultAddressUpdate: { customer: { id: string } | null; userErrors: CustomerUserError[] };
};

export type ShopifyHomepageBrand = {
  id: string;
  fields: { key: string; value: string | null; reference: { image?: ShopifyImage | null } | null }[];
};
export type HomepageBrandsResult = {
  metaobjects: { nodes: ShopifyHomepageBrand[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
};
