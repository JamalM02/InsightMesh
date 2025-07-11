"use client";

import { getCustomerPaymentMethods } from "@/actions/payment-list";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useFetchPaymentMethods = () => {
  const { orgId } = useAuth();

  return useQuery({
    queryKey: ["payment-methods", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      if (!orgId) throw new Error("Organization ID is required");
      return await getCustomerPaymentMethods(orgId);
    },
  });
};
