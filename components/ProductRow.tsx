import { ProductTile } from "@/components/ProductTile";
import type { UiProduct } from "@/lib/shopify/mappers";

export function ProductRow({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: UiProduct[];
}) {
  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8">
      <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-brand-teal-dark/60">{subtitle}</p>}

      <div className="no-scrollbar snap-row mt-4 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible lg:grid-cols-6">
        {products.map((product) => (
          <ProductTile key={product.id} product={product} className="w-40 shrink-0 sm:w-auto" />
        ))}
      </div>
    </section>
  );
}
