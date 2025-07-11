import {NavItem} from "./type";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {BookOpen, Key} from "lucide-react";
import Link from "next/link";
import {memo} from "react";

const items: NavItem[] = [
    {
        title: "Api Keys",
        url: "/developers/keys",
        icon: <Key/>,
    },
    {
        title: "Api Reference",
        url: process.env.NEXT_PUBLIC_DOCS_URL!,
        icon: <BookOpen/>,
        target: "_blank",
    },
];

const NavDevelopers = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Developers</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url} target={item.target}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
export default memo(NavDevelopers);
