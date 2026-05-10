import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center animate-in fade-in zoom-in duration-300">
      <div className="rounded-full bg-primary/10 p-4">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground max-w-sm">{description}</p>
      {ctaLabel && ctaHref && (
        <Button asChild className="mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-[12px]">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
