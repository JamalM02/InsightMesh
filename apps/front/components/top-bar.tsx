"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcumb } from "@/hooks/use-breadcumb";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { Fragment, memo } from "react";

const BreadcrumbNav = () => {
  const { items } = useBreadcumb();

  return (
    <header
      className={cn("h-[4rem]", "items-center", "flex", "w-full", "gap-2")}
    >
      <SidebarTrigger className="cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 max-h-8" />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={item.title}>
              <BreadcrumbItem>
                {/* <BreadcrumbLink> */}
                <Link href={item.url}>{item.title}</Link>
                {/* </BreadcrumbLink> */}
              </BreadcrumbItem>
              {index !== items.length - 1 && (
                <BreadcrumbSeparator key={`separator-${item.title}`} />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
export default memo(BreadcrumbNav);
