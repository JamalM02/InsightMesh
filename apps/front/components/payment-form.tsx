"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { memo, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      if (!cardholderName.trim()) {
        alert("Cardholder name is required");
        return;
      }

      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: "http://localhost:3001/payments",
          payment_method_data: {
            billing_details: {
              name: cardholderName,
            },
          },
        },
      });

      if (error) {
        console.error("Stripe error:", error.message);
      }
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    [stripe, elements, cardholderName, queryClient]
  );

  return (
    <Card className="flex-1 border shadow-sm transition-all duration-500 ease-in-out overflow-hidden">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700 mb-1">
              Card Details
            </label>
            <div className="rounded-md border border-gray-300 p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <PaymentElement />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            disabled={!cardholderName.trim()}
          >
            Submit Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(PaymentForm);
