import SideBar from "@/components/side-bar";
import {SidebarProvider} from "@/components/ui/sidebar";
import MainClientProvider from "@/providers/main-client";
import TopBar from "@/components/top-bar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainClientProvider>
      <SidebarProvider className="gap-4">
        <SideBar />
        <main className="flex flex-col w-full">
          <TopBar />
          {children}
        </main>
      </SidebarProvider>
    </MainClientProvider>
  );
}
