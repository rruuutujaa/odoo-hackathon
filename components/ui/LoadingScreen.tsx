"use client";

import { Loader2, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-[#FF6B35] mb-8"
      >
        <PlaneTakeoff size={80} strokeWidth={2.5} />
      </motion.div>
      
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-black text-[#1A1F3C] tracking-tight">Preparing your adventure...</h2>
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin text-[#FF6B35]" size={20} />
          <span className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Loading Traveloop</span>
        </div>
      </div>
    </div>
  );
}
