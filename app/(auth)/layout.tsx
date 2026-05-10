"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">TTraveloop</span>
        </motion.div>
        {children}
      </div>
    </div>
  );
}
