import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCustomerAddresses } from "@/lib/customer/actions";
import { AddressList } from "@/components/account/AddressList";

export default async function AddressesPage() {
  const t = await getTranslations("account.addresses");
  const addresses = await getCustomerAddresses();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-teal-dark">{t("title")}</h1>
        <Link
          href="/account/addresses/new"
          className="rounded-full bg-brand-teal px-5 py-2 text-sm font-bold text-white hover:bg-brand-teal-dark"
        >
          {t("add")}
        </Link>
      </div>
      {addresses.length === 0 ? (
        <p className="text-sm text-brand-teal-dark/70">{t("empty")}</p>
      ) : (
        <AddressList addresses={addresses} />
      )}
    </div>
  );
}
