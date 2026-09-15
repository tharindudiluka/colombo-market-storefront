import { getTranslations } from "next-intl/server";
import { AddressForm } from "@/components/account/AddressForm";

export default async function NewAddressPage() {
  const t = await getTranslations("account.addresses");
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-teal-dark">{t("add")}</h1>
      <AddressForm />
    </div>
  );
}
