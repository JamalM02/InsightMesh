import NavMain from "./nav-main";
import NavUser from "./nav-user";
import NavDevelopers from "./nav-developers";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  Sidebar,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { memo } from "react";

const SideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            IM
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            InsightMesh
          </span>
        </div>
        <OrganizationSwitcher
          createOrganizationUrl="/org/create"
          hidePersonal
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain />
        <NavDevelopers />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
export default memo(SideBar);
