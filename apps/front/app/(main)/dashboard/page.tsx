"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import PageContainer from "@/components/page-container";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Main", url: "" },
          { title: "Home", url: "/dashboard" },
        ]}
      />
      <PageContainer
        title="Dashboard"
        description="Monitor your analytics and event data in real-time"
      >
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <iframe
              className="w-full h-full min-h-[70vh] border-0 rounded-lg"
              src={process.env.NEXT_PUBLIC_METABASE_DASHBOARD_URL}
              allowFullScreen
              loading="lazy"
            />
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
