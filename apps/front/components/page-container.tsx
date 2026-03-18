"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { memo } from "react";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

const PageContainer = ({ title, description, children, className }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex flex-col gap-6 p-6 w-full", className)}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default memo(PageContainer);
