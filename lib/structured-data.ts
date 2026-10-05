import { site } from "@/config/site";
import { storefrontOrigin, storefrontUrl } from "@/lib/seo";
import type { UiProductDetail } from "@/lib/shopify/mappers";

function gtin(barcode: string | null): Record<string, string> {
  if (!barcode || !/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(barcode)) return {};
  const digits = [...barcode].map(Number);
  const checksum = digits.slice(0, -1).reverse().reduce((sum, digit, index) =>
    sum + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - checksum % 10) % 10 === digits.at(-1)
    ? { [`gtin${barcode.length}`]: barcode } : {};
}

export function productStructuredData(product: UiProductDetail, locale: string) {
  const url = storefrontUrl(locale, `/products/${product.handle}`);
  const onlyVariant = product.variants.length === 1 ? product.variants[0] : null;
  return {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`,
    name: product.title, description: product.description, url,
    ...(product.images.length ? { image: product.images.map(image => image.url) } : {}),
    ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
    ...(onlyVariant?.sku ? { sku: onlyVariant.sku } : {}),
    ...gtin(onlyVariant?.barcode ?? null),
    offers: product.variants.map(variant => ({
      "@type": "Offer",
      "@id": `${url}#offer-${variant.id.split("/").at(-1)}`,
      ...(variant.title !== "Default Title" ? { name: variant.title } : {}),
      ...(variant.sku ? { sku: variant.sku } : {}),
      url,
      price: variant.price.amount, priceCurrency: variant.price.currencyCode,
      availability: `https://schema.org/${variant.availableForSale ? "InStock" : "OutOfStock"}`,
    })),
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org", "@type": "Organization",
    "@id": `${storefrontOrigin}/#organization`, name: site.name, url: `${storefrontOrigin}/`,
    logo: new URL(site.logo, storefrontOrigin).href,
    address: {
      "@type": "PostalAddress", streetAddress: site.address.street,
      postalCode: site.address.postalCode, addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    sameAs: [site.social.instagram],
  };
}
