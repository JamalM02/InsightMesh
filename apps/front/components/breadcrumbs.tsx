"use client";

import { BreadcrumbItem, useBreadcrumb } from "@/hooks";
import { memo, useLayoutEffect } from "react";

type Props = {
  items: BreadcrumbItem[];
};
const Breadcrumbs = ({ items }: Props) => {
  const { setBreadcrumb } = useBreadcrumb();
  useLayoutEffect(() => {
    setBreadcrumb(items);
  }, [items, setBreadcrumb]);
  return <></>;
};

export default memo(Breadcrumbs);
