import Breadcrumbs from "@/components/breadcrumbs";
import RevealKeyPanel from "@/components/reveal-key";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Developers", url: "/developers" },
          { title: "Keys", url: "/developers/keys" },
        ]}
      />
      <div className={cn("flex flex-col gap-4", "p-5", "w-full")}>
        <h1 className={cn("text-3xl font-bold text-white")}>Developers Keys</h1>
        <RevealKeyPanel />
      </div>
    </>
  );
}
