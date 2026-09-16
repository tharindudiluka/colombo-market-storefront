import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { NavMenu } from "@/components/NavMenu";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { BuyBox } from "@/components/BuyBox";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { ProductRow } from "@/components/ProductRow";
import { Footer } from "@/components/Footer";
import { shopifyFetch } from "@/lib/shopify/client";
import { productByHandleQuery } from "@/lib/shopify/queries/product-by-handle";
import { productRecommendationsQuery } from "@/lib/shopify/queries/product-recommendations";
import { collectionProductsQuery } from "@/lib/shopify/queries/collection-products";
import { toUiProduct, toUiProductDetail } from "@/lib/shopify/mappers";
import type {
  CollectionProductsResult,
  LanguageCode,
  ProductByHandleResult,
  ProductRecommendationsResult,
} from "@/lib/shopify/types";

async function getProduct(handle: string, language: LanguageCode) {
  const data = await shopifyFetch<ProductByHandleResult>({
    query: productByHandleQuery,
    variables: { handle, language },
    tags: ["product", handle],
  });
  return data.product;
}

async function getRelatedProducts(
  productId: string,
  categoryHandle: string | null,
  language: LanguageCode
) {
  const recommendations = await shopifyFetch<ProductRecommendationsResult>({
    query: productRecommendationsQuery,
    variables: { productId, language },
    tags: ["product", productId],
  });

  const fromRecommendations = (recommendations.productRecommendations ?? []).map(toUiProduct);
  if (fromRecommendations.length >= 4 || !categoryHandle) {
    return fromRecommendations;
  }

  const fallback = await shopifyFetch<CollectionProductsResult>({
    query: collectionProductsQuery,
    variables: { handle: categoryHandle, first: 8, language },
    tags: ["collection", categoryHandle],
  });
  const fromCollection = (fallback.collection?.products.edges ?? [])
    .map((edge) => edge.node)
    .filter((node) => node.id !== productId)
    .map(toUiProduct);

  return fromRecommendations.length > 0 ? fromRecommendations : fromCollection;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LanguageCode;
  const product = await getProduct(handle, language);
  if (!product) return {};

  const detail = toUiProductDetail(product);
  return {
    title: detail.seo.title || `${detail.title} — Colombo Market`,
    description: detail.seo.description || detail.description.slice(0, 160),
    openGraph: detail.images[0] ? { images: [detail.images[0].url] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LanguageCode;

  const rawProduct = await getProduct(handle, language);
  if (!rawProduct) notFound();

  const product = toUiProductDetail(rawProduct);
  const t = await getTranslations("product");
  const tNav = await getTranslations("nav");

  const related = await getRelatedProducts(
    product.id,
    product.breadcrumbCategory?.handle ?? null,
    language
  );

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <NavMenu />

      <main className="flex-1">
        <Breadcrumbs
          items={[
            ...(product.breadcrumbCategory
              ? [
                  {
                    label: product.breadcrumbCategory.title || tNav(product.breadcrumbCategory.handle),
                    href: `/collections/${product.breadcrumbCategory.handle}`,
                  },
                ]
              : []),
            { label: product.title },
          ]}
        />

        <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:py-10">
          <ProductGallery images={product.images} title={product.title} />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BuyBox product={product} />
            <TrustBadges />
          </div>
        </div>

        <ProductDetailsAccordion product={product} />

        {related.length > 0 && <ProductRow title={t("relatedProducts.title")} products={related} />}
      </main>

      <Footer />
    </div>
  );
}
