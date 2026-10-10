import { normalizeStorefrontUrl } from "@/lib/shopify/storefront-url";
import type {
  ShopifyCart,
  ShopifyCollection,
  ShopifyCollectionDetail,
  ShopifyCustomer,
  ShopifyCustomerAddress,
  ShopifyHomeBannerNode,
  ShopifyHomepageBrand,
  ShopifyOrder,
  ShopifyProductDetail,
  ShopifyProductNode,
  ShopifyProductVariant,
} from "@/lib/shopify/types";

/**
 * Normalized shape presentation components consume. Components never import a Shopify
 * type directly — this is the seam that keeps ProductTile/ProductRow/CategoryGrid
 * decoupled from the Storefront API's GraphQL shape.
 */
export type UiProduct = {
  quickAddVariantId?: string | null;
  quickAddVariants?: { id: string; title: string; availableForSale: boolean; price: UiProduct["price"]; compareAtPrice: UiProduct["compareAtPrice"] }[];
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
    quickAddVariantId: node.variants?.nodes.length === 1 && node.variants.nodes[0].availableForSale ? node.variants.nodes[0].id : null,
    quickAddVariants: node.variants?.nodes.map(variant => ({
      id: variant.id, title: variant.title, availableForSale: variant.availableForSale,
      price: { amount: Number(variant.price.amount), currencyCode: variant.price.currencyCode },
      compareAtPrice: variant.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(variant.price.amount)
        ? { amount: Number(variant.compareAtPrice.amount), currencyCode: variant.compareAtPrice.currencyCode } : null,
    })),
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

export type UiProductVariant = {
  sku: string | null;
  barcode: string | null;
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  price: { amount: number; currencyCode: string };
  compareAtPrice: { amount: number; currencyCode: string } | null;
  image: { url: string; alt: string } | null;
  unitPrice: { amount: number; currencyCode: string; referenceValue: number; referenceUnit: string } | null;
};

export type UiNutrientKey = "energy" | "fat" | "saturatedFat" | "carbohydrates" | "sugars" | "protein" | "fiber" | "salt";

export type UiProductInformation = {
  ingredients: string | null;
  legalName: string | null;
  storage: string | null;
  origin: string | null;
  manufacturerDistributor: string | null;
  nutrition: { basis: string; rows: { key: UiNutrientKey; value: string }[] } | null;
};

function toUiProductInformation(node: ShopifyProductDetail): UiProductInformation {
  function text(field: { type: string; value: string } | null | undefined): string | null {
    if (!field || !["single_line_text_field", "multi_line_text_field"].includes(field.type)) return null;
    return field.value.trim() || null;
  }

  let nutrition: UiProductInformation["nutrition"] = null;
  if (node.nutrition?.type === "json") {
    try {
      const data: unknown = JSON.parse(node.nutrition.value);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const values = data as Record<string, unknown>;
        const basis = typeof values.basis === "string" ? values.basis.trim() : "";
        const keys: UiNutrientKey[] = ["energy", "fat", "saturatedFat", "carbohydrates", "sugars", "protein", "fiber", "salt"];
        const rows = keys.flatMap((key) => {
          const value = values[key];
          // Values must include their verified units; never infer units from a number.
          return typeof value === "string" && value.trim() ? [{ key, value: value.trim() }] : [];
        });
        if (basis && rows.length) nutrition = { basis, rows };
      }
    } catch {
      // Incomplete/malformed optional merchant data must not break the product page.
    }
  }

  return {
    ingredients: text(node.ingredients), legalName: text(node.legalName),
    storage: text(node.storage), origin: text(node.origin),
    manufacturerDistributor: text(node.manufacturerDistributor), nutrition,
  };
}

export type UiProductDetail = {
  information: UiProductInformation;
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string | null;
  productType: string | null;
  tags: string[];
  images: { url: string; alt: string }[];
  options: { name: string; values: string[] }[];
  variants: UiProductVariant[];
  price: { amount: number; currencyCode: string };
  compareAtPrice: { amount: number; currencyCode: string } | null;
  availableForSale: boolean;
  breadcrumbCategory: { handle: string; title: string } | null;
  seo: { title: string | null; description: string | null };
};

function toUiVariant(node: ShopifyProductVariant, fallbackAlt: string): UiProductVariant {
  const compareAtAmount = node.compareAtPrice?.amount;
  const priceAmount = node.price.amount;
  const isOnSale = compareAtAmount !== undefined && Number(compareAtAmount) > Number(priceAmount);

  return {
    sku: node.sku || null,
    barcode: node.barcode || null,
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    // Storefront token doesn't have unauthenticated_read_product_inventory granted yet —
    // see colombo_frontend/README.md setup step 2.3. Null is the documented "unknown" state
    // everywhere this is consumed (QuantityStepper/BuyBox treat it as unbounded).
    quantityAvailable: null,
    selectedOptions: node.selectedOptions,
    price: { amount: Number(priceAmount), currencyCode: node.price.currencyCode },
    compareAtPrice: isOnSale
      ? { amount: Number(compareAtAmount), currencyCode: node.compareAtPrice!.currencyCode }
      : null,
    image: node.image ? { url: node.image.url, alt: node.image.altText ?? fallbackAlt } : null,
    unitPrice:
      node.unitPrice && node.unitPriceMeasurement
        ? {
            amount: Number(node.unitPrice.amount),
            currencyCode: node.unitPrice.currencyCode,
            referenceValue: node.unitPriceMeasurement.referenceValue,
            referenceUnit: node.unitPriceMeasurement.referenceUnit ?? node.unitPriceMeasurement.quantityUnit ?? "",
          }
        : null,
  };
}

export function toUiProductDetail(node: ShopifyProductDetail): UiProductDetail {
  const compareAtAmount = node.compareAtPriceRange?.minVariantPrice.amount;
  const priceAmount = node.priceRange.minVariantPrice.amount;
  const isOnSale = compareAtAmount !== undefined && Number(compareAtAmount) > Number(priceAmount);
  const breadcrumbEdge = node.collections.edges[0];

  return {
    information: toUiProductInformation(node),
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    vendor: node.vendor || null,
    productType: node.productType || null,
    tags: node.tags,
    images: node.images.edges.map((edge) => ({
      url: edge.node.url,
      alt: edge.node.altText ?? node.title,
    })),
    options: node.options.map((option) => ({
      name: option.name,
      values: option.optionValues.map((value) => value.name),
    })),
    variants: node.variants.edges.map((edge) => toUiVariant(edge.node, node.title)),
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
    breadcrumbCategory: breadcrumbEdge
      ? { handle: breadcrumbEdge.node.handle, title: breadcrumbEdge.node.title }
      : null,
    seo: { title: node.seo.title, description: node.seo.description },
  };
}

export type UiCartLine = {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  variantTitle: string | null;
  selectedOptions: { name: string; value: string }[];
  image: { url: string; alt: string } | null;
  price: { amount: number; currencyCode: string };
  lineTotal: { amount: number; currencyCode: string };
  availableForSale: boolean;
};

export type UiCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: { amount: number; currencyCode: string };
  total: { amount: number; currencyCode: string };
  lines: UiCartLine[];
};

export function toUiCart(cart: ShopifyCart): UiCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: {
      amount: Number(cart.cost.subtotalAmount.amount),
      currencyCode: cart.cost.subtotalAmount.currencyCode,
    },
    total: {
      amount: Number(cart.cost.totalAmount.amount),
      currencyCode: cart.cost.totalAmount.currencyCode,
    },
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      title: node.merchandise.product.title,
      handle: node.merchandise.product.handle,
      variantTitle: node.merchandise.title !== "Default Title" ? node.merchandise.title : null,
      selectedOptions: node.merchandise.selectedOptions,
      image: node.merchandise.image
        ? {
            url: node.merchandise.image.url,
            alt: node.merchandise.image.altText ?? node.merchandise.product.title,
          }
        : null,
      price: {
        amount: Number(node.merchandise.price.amount),
        currencyCode: node.merchandise.price.currencyCode,
      },
      lineTotal: {
        amount: Number(node.cost.totalAmount.amount),
        currencyCode: node.cost.totalAmount.currencyCode,
      },
      availableForSale: node.merchandise.availableForSale,
    })),
  };
}

export type UiBanner = {
  id: string;
  image: { url: string; alt: string; width: number | null; height: number | null };
  href: string | null;
};

/**
 * `home_banners` metaobject → UI banner. Entries with no image reference resolve to
 * null so the caller can filter them out. `href` comes from the optional `link` field
 * (a path like `/collections/x` or an absolute URL); blank/missing → null.
 */
export function toUiBanner(node: ShopifyHomeBannerNode): UiBanner | null {
  const image = node.image?.reference?.image;
  if (!image) return null;
  const href = node.link?.value?.trim();
  return {
    id: node.id,
    image: {
      url: image.url,
      alt: image.altText ?? "",
      width: image.width ?? null,
      height: image.height ?? null,
    },
    href: href ? normalizeStorefrontUrl(href) : null,
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

export type UiCollectionDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  image: { url: string; alt: string } | null;
  seo: { title: string | null; description: string | null };
  products: UiProduct[];
};

export function toUiCollectionDetail(collection: ShopifyCollectionDetail): UiCollectionDetail {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    descriptionHtml: collection.descriptionHtml,
    image: collection.image
      ? { url: collection.image.url, alt: collection.image.altText ?? collection.title }
      : null,
    seo: { title: collection.seo.title, description: collection.seo.description },
    products: collection.products.edges.map((edge) => toUiProduct(edge.node)),
  };
}

// --- Customer Account API ---------------------------------------------------------

export type UiCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
};

export function toUiCustomer(node: ShopifyCustomer): UiCustomer {
  return {
    id: node.id,
    firstName: node.firstName ?? "",
    lastName: node.lastName ?? "",
    email: node.emailAddress?.emailAddress ?? null,
    phone: node.phoneNumber?.phoneNumber ?? null,
  };
}

export type UiAddress = {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  postalCode: string;
  province: string | null;
  country: string | null;
  phone: string | null;
  isDefault: boolean;
};

export function toUiAddress(node: ShopifyCustomerAddress, defaultAddressId?: string | null): UiAddress {
  return {
    id: node.id,
    firstName: node.firstName ?? "",
    lastName: node.lastName ?? "",
    address1: node.address1 ?? "",
    address2: node.address2 ?? null,
    city: node.city ?? "",
    postalCode: node.zip ?? "",
    province: node.provinceCode ?? null,
    country: node.countryCode ?? null,
    phone: node.phoneNumber ?? null,
    isDefault: defaultAddressId ? node.id === defaultAddressId : false,
  };
}

export type UiOrderLineItem = {
  title: string;
  quantity: number;
  image: { url: string; alt: string } | null;
  price: { amount: number; currencyCode: string } | null;
};

export type UiOrder = {
  id: string;
  name: string;
  number: number;
  date: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  total: { amount: number; currencyCode: string };
  subtotal: { amount: number; currencyCode: string } | null;
  shipping: { amount: number; currencyCode: string } | null;
  tax: { amount: number; currencyCode: string } | null;
  lineItems: UiOrderLineItem[];
  shippingAddress: UiAddress | null;
};

export function toUiOrder(node: ShopifyOrder): UiOrder {
  return {
    id: node.id,
    name: node.name,
    number: node.number,
    date: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillments.edges[0]?.node.status ?? null,
    total: { amount: Number(node.totalPrice.amount), currencyCode: node.totalPrice.currencyCode },
    subtotal: node.subtotal
      ? { amount: Number(node.subtotal.amount), currencyCode: node.subtotal.currencyCode }
      : null,
    shipping: node.totalShipping
      ? { amount: Number(node.totalShipping.amount), currencyCode: node.totalShipping.currencyCode }
      : null,
    tax: node.totalTax ? { amount: Number(node.totalTax.amount), currencyCode: node.totalTax.currencyCode } : null,
    lineItems: node.lineItems.edges.map(({ node: item }) => ({
      title: item.title,
      quantity: item.quantity,
      image: item.image ? { url: item.image.url, alt: item.image.altText ?? item.title } : null,
      price: item.price ? { amount: Number(item.price.amount), currencyCode: item.price.currencyCode } : null,
    })),
    shippingAddress: node.shippingAddress ? toUiAddress(node.shippingAddress) : null,
  };
}

export type UiHomepageBrand = {
  id: string; name: string; vendor: string; order: number;
  logo: { url: string; alt: string; width?: number; height?: number };
};

export function toUiHomepageBrand(node: ShopifyHomepageBrand): UiHomepageBrand | null {
  const fields = Object.fromEntries(node.fields.map(field => [field.key, field]));
  const name = fields.brand_name?.value?.trim();
  const vendor = fields.vendor?.value?.trim();
  const image = fields.logo?.reference?.image;
  if (fields.active?.value !== "true" || !name || !vendor || !image?.url) return null;
  const order = Number(fields.display_order?.value);
  return { id: node.id, name, vendor, order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
    logo: { url: image.url, alt: image.altText || name, width: image.width, height: image.height } };
}
