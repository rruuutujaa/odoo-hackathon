"use client"

import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 right-0 z-[100] p-6 w-full max-w-sm flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`p-6 rounded-2xl shadow-2xl luxury-shadow flex items-start justify-between gap-4 border ${
              toast.variant === "destructive" 
                ? "bg-red-600 text-white border-red-500" 
                : "bg-white text-[#1A1F3C] border-muted"
            }`}
          >
            <div className="space-y-1">
              {toast.title && <p className="font-black text-sm uppercase tracking-widest">{toast.title}</p>}
              {toast.description && <p className="text-xs font-medium opacity-80">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 opacity-40 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
