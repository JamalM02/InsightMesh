import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

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
    <ClerkProvider appearance={{ baseTheme: [dark] }}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "dark antialiased")}>
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
