import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCustomerAddresses } from "@/lib/customer/actions";
import { AddressForm } from "@/components/account/AddressForm";

export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("account.addresses");
  const addresses = await getCustomerAddresses();
  const address = addresses.find((a) => a.id === decodeURIComponent(id));
  if (!address) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-teal-dark">{t("edit")}</h1>
      <AddressForm address={address} />
    </div>
  );
}
