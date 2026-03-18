import Breadcrumbs from "@/components/breadcrumbs";
import PageContainer from "@/components/page-container";
import RevealKeyPanel from "@/components/reveal-key";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Keys",
};

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Developers", url: "/developers" },
          { title: "Keys", url: "/developers/keys" },
        ]}
      />
      <PageContainer
        title="API Keys"
        description="Manage your API keys for authenticating with the InsightMesh platform"
      >
        <RevealKeyPanel />
      </PageContainer>
    </>
  );
}
