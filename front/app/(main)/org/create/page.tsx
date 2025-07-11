import CreateOrganization from "@/components/create-organization";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <div className={cn("flex justify-center h-full items-center")}>
      <CreateOrganization />
    </div>
  );
}
