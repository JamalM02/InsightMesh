"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { memo } from "react";

const Header = () => {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
        >
          <Building2 className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Create Organization
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Let&apos;s build something amazing together
          </motion.p>
        </div>
      </div>
    </>
  );
};
export default memo(Header);
