"use client";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, Wallet } from "lucide-react";
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useFetchPaymentMethods } from "@/hooks";
import CardSkeleton from "@/components/card-skeleton";
import Cards from "react-credit-cards-2";
import { deleteCustomerPaymentMethods } from "@/actions/payment-list";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  className?: string;
};
const SavedPaymentMethods = ({ className }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchPaymentMethods();

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCustomerPaymentMethods(id);
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    [queryClient]
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Saved Payment Methods
        </CardTitle>
        <CardDescription>
          View and manage your saved payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("mx-auto flex flex-col gap-4")}>
        {isLoading && <CardSkeleton />}
        {!isLoading && data?.length === 0 && <p>No payment methods found</p>}
        {!isLoading &&
          data?.map((item) => (
            <div key={item.id} className={cn("flex items-center gap-4")}>
              <Cards
                cvc={""}
                expiry={`${item.card?.exp_month}/${item.card?.exp_year}`}
                name={item.billing_details?.name || ""}
                focused={undefined}
                number={`**** **** **** ${item.card?.last4}`}
                issuer={item.card?.brand || ""}
                preview={true}
              />
              <Trash
                className="h-5 w-5 cursor-pointer text-red-600"
                onClick={() => handleDelete(item.id)}
              />
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
export default memo(SavedPaymentMethods);
