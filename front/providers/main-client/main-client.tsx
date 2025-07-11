"use client";

import { useOrgAutoSelect } from "@/hooks";
import { memo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainClientProvider = ({ children }: { children: React.ReactNode }) => {
  useOrgAutoSelect();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default memo(MainClientProvider);
