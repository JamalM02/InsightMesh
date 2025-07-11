"use client";

import { BreadcumbItem, useBreadcumb } from "@/hooks";
import { memo, useLayoutEffect } from "react";

type Props = {
  items: BreadcumbItem[];
};
const Breadcrumbs = ({ items }: Props) => {
  const { setBreadcumb } = useBreadcumb();
  useLayoutEffect(() => {
    setBreadcumb(items);
  }, [items, setBreadcumb]);
  return <></>;
};

export default memo(Breadcrumbs);
