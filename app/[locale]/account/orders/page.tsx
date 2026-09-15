import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCustomerOrders } from "@/lib/customer/actions";

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(amount);
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { cursor } = await searchParams;
  const t = await getTranslations("account.orders");
  const { orders, hasNextPage, endCursor } = await getCustomerOrders(cursor);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-teal-dark">{t("title")}</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-brand-teal-dark/70">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <Link
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  className="font-semibold text-brand-teal-dark"
                >
                  {order.name}
                </Link>
                <span className="text-sm text-brand-teal-dark/60">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-brand-teal-dark/70">{order.fulfillmentStatus ?? order.financialStatus}</span>
                <span className="font-bold text-brand-teal-dark">
                  {formatMoney(order.total.amount, order.total.currencyCode)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && endCursor && (
        <Link
          href={`/account/orders?cursor=${encodeURIComponent(endCursor)}`}
          className="mt-6 inline-block rounded-full bg-brand-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-teal-dark"
        >
          {t("loadMore")}
        </Link>
      )}
    </div>
  );
}
