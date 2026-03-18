import Breadcrumbs from "@/components/breadcrumbs";
import PageContainer from "@/components/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
};

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Developers", url: "/developers" },
          { title: "Docs", url: "/developers/docs" },
        ]}
      />
      <PageContainer
        title="Documentation"
        description="Learn how to integrate with the InsightMesh API"
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Documentation Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-md">
              We&apos;re working on comprehensive API documentation to help you
              get the most out of InsightMesh. Check back soon!
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
