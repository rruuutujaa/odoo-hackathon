import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon: LucideIcon;
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-muted/50 p-16 text-center bg-white/50">
      <div className="rounded-2xl bg-[#FF6B35]/10 p-6 text-[#FF6B35] mb-6 shadow-inner">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-black text-[#1A1F3C] tracking-tight">{title}</h3>
      <p className="mt-3 text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <Button asChild className="mt-10 bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-14 px-10 shadow-xl shadow-[#FF6B35]/20 font-black text-lg group transition-all hover:scale-105">
          <Link href={ctaHref} className="flex items-center gap-2">
            {ctaLabel} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      )}
    </div>
  );
}
