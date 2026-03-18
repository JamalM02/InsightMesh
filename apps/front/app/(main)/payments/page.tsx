import AddPaymentMethod from "@/components/add-payment-method";
import Breadcrumbs from "@/components/breadcrumbs";
import PageContainer from "@/components/page-container";
import SavedPaymentMethods from "@/components/saved-payment-methods";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Main", url: "/dashboard" },
          { title: "Payments", url: "/payments" },
        ]}
      />
      <PageContainer
        title="Payment Methods"
        description="Manage your billing and payment information"
      >
        <div
          className={cn(
            "flex flex-col gap-6 w-full md:flex-row"
          )}
        >
          <SavedPaymentMethods className={cn("md:w-1/2", "w-full")} />
          <AddPaymentMethod className={cn("md:w-1/2", "h-min", "w-full")} />
        </div>
      </PageContainer>
    </>
  );
}
