import CreateOrganization from "@/components/create-organization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
};

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative z-10 mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          IM
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          InsightMesh
        </h1>
      </div>

      <div className="relative z-10">
        <CreateOrganization />
      </div>
    </main>
  );
}
