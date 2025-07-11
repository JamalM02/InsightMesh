import NavDevelopers from "./nav-developers";
import NavMain from "./nav-main";
import NavUser from "./nav-user";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  Sidebar,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { memo } from "react";

const SideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher
          createOrganizationUrl="/org/create"
          hidePersonal
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDevelopers />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
export default memo(SideBar);
