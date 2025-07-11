"use server";

import { getAccountId } from "@/actions/get-account-id";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function deleteCustomerPaymentMethods(paymentMethodId: string) {
  if (!paymentMethodId) throw new Error("Missing parameters");
  await stripe.paymentMethods.detach(paymentMethodId);
}

export async function getCustomerPaymentMethods(
  orgId: string
): Promise<Stripe.PaymentMethod[]> {
  const result = await getAccountId({ id: orgId });
  const paymentMethods = await stripe.paymentMethods.list({
    customer: result.stripeId,
    type: "card",
  });

  return paymentMethods.data;
}
