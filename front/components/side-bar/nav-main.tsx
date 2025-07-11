import { NavItem } from "./type";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { House, CreditCard } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const main: NavItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <House />,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: <CreditCard />,
  },
];
const NavMain = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {main.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
export default memo(NavMain);
