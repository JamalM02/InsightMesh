"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { memo, useEffect, useState } from "react";

const ClerkThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? [dark] : undefined,
        variables: { colorPrimary: "#6366f1" },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default memo(ClerkThemeProvider);
