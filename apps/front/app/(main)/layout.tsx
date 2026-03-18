import SideBar from "@/components/side-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainClientProvider from "@/providers/main-client";
import TopBar from "@/components/top-bar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainClientProvider>
      <SidebarProvider>
        <SideBar />
        <main className="flex flex-col w-full min-h-svh">
          <TopBar />
          <div className="flex-1 flex flex-col">{children}</div>
        </main>
      </SidebarProvider>
    </MainClientProvider>
  );
}
