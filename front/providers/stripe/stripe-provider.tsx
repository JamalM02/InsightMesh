"use client";

import { Elements } from "@stripe/react-stripe-js";
import React, { memo } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  children: React.ReactNode;
  clientSecret: string;
};

const StripeProvider = ({ children, clientSecret }: Props) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
};
export default memo(StripeProvider);
