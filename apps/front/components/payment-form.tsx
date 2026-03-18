"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { memo, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const returnUrl = `${window.location.origin}/payments`;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      if (!cardholderName.trim()) {
        toast.error("Cardholder name is required");
        return;
      }

      setIsSubmitting(true);

      try {
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: returnUrl,
            payment_method_data: {
              billing_details: {
                name: cardholderName,
              },
            },
          },
        });

        if (error) {
          toast.error(error.message || "An error occurred with your payment");
        }

        queryClient.invalidateQueries({
          queryKey: ["payment-methods"],
        });
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, cardholderName, queryClient, returnUrl]
  );

  return (
    <Card className="flex-1 border shadow-sm transition-all duration-500 ease-in-out overflow-hidden">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input
              id="cardholder-name"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Card Details</Label>
            <div className="rounded-md border border-border p-3 bg-background focus-within:ring-2 focus-within:ring-ring transition-all">
              <PaymentElement />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!cardholderName.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Save Payment Method"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(PaymentForm);
