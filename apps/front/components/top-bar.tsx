"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import { Fragment, memo } from "react";

const BreadcrumbNav = () => {
  const { items } = useBreadcrumb();

  return (
    <header className="h-16 flex items-center w-full gap-3 px-4 border-b border-border/40">
      <SidebarTrigger className="cursor-pointer" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={item.title}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="font-medium">
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <Link
                    href={item.url}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </BreadcrumbItem>
              {index !== items.length - 1 && (
                <BreadcrumbSeparator key={`separator-${item.title}`} />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
};
export default memo(BreadcrumbNav);
