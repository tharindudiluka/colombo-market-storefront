import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCustomerOrder } from "@/lib/customer/actions";

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(amount);
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("account.orders");
  const order = await getCustomerOrder(decodeURIComponent(id));
  if (!order) notFound();

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-brand-teal-dark">{order.name}</h1>
      <p className="mb-6 text-sm text-brand-teal-dark/60">{new Date(order.date).toLocaleDateString()}</p>

      <ul className="mb-6 flex flex-col gap-3">
        {order.lineItems.map((item, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <span>
              {item.title} × {item.quantity}
            </span>
            {item.price && <span>{formatMoney(item.price.amount, item.price.currencyCode)}</span>}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-t border-black/10 pt-4 text-sm">
        {order.subtotal && (
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>{formatMoney(order.subtotal.amount, order.subtotal.currencyCode)}</span>
          </div>
        )}
        {order.shipping && (
          <div className="flex justify-between">
            <span>{t("shipping")}</span>
            <span>{formatMoney(order.shipping.amount, order.shipping.currencyCode)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-brand-teal-dark">
          <span>{t("total")}</span>
          <span>{formatMoney(order.total.amount, order.total.currencyCode)}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 text-sm text-brand-teal-dark/70">
          <p className="font-semibold text-brand-teal-dark">{t("shippingAddress")}</p>
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p>{order.shippingAddress.address1}</p>
          {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
          <p>
            {order.shippingAddress.postalCode} {order.shippingAddress.city}
          </p>
        </div>
      )}
    </div>
  );
}
