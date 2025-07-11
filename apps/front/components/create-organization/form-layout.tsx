"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { memo } from "react";

type Props = {
  children: React.ReactNode;
};
const FormLayout = ({ children }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md h-min"
    >
      <Card className="bg-white/80 dark:bg-gray-900/80 border-0">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
};
export default memo(FormLayout);
