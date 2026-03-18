"use client";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Wallet, CreditCard } from "lucide-react";
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

        {!isLoading && data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No payment methods found
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add a payment method to get started
            </p>
          </div>
        )}

        {!isLoading &&
          data?.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
              )}
            >
              <Cards
                cvc={""}
                expiry={`${item.card?.exp_month}/${item.card?.exp_year}`}
                name={item.billing_details?.name || ""}
                focused={undefined}
                number={`**** **** **** ${item.card?.last4}`}
                issuer={item.card?.brand || ""}
                preview={true}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Delete payment method"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this payment method ending
                      in {item.card?.last4}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(item.id)}
                      className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
export default memo(SavedPaymentMethods);
