import Breadcrumbs from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Main", url: "" },
          { title: "Home", url: "/dashboard" },
        ]}
      />
      <h1 className={cn("text-white")}>Dashboard Page</h1>
      <iframe
        className="px-5 py-10 h-full"
        src="http://dirdok.y2025.kinneret.cc/metabase/public/dashboard/b6db0221-c4e1-45e7-b12f-bba490bb334c"
      />
    </>
  );
}
