import { getTranslations } from "next-intl/server";
import { getCurrentCustomer } from "@/lib/customer/actions";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function AccountProfilePage() {
  const t = await getTranslations("account.profile");
  const customer = await getCurrentCustomer();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-teal-dark">{t("title")}</h1>
      {customer && <ProfileForm customer={customer} />}
    </div>
  );
}
