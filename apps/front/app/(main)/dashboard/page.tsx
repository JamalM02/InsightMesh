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
        src="http://34.57.185.235:3000/public/dashboard/79531409-892b-43c9-a281-8bdd6582f989
"
      />
    </>
  );
}
