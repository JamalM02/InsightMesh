"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-lg border border-border/50"
        >
          <Skeleton className="h-[125px] w-[200px] rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      ))}
    </div>
  );
};
export default memo(CardSkeleton);
