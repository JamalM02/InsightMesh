import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import ClerkThemeProvider from "@/providers/clerk-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InsightMesh — Analytics Dashboard",
    template: "%s | InsightMesh",
  },
  description:
    "Real-time event analytics and insights platform for your applications. Monitor, analyze, and optimize your data pipeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            {children}
            <Toaster richColors />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
