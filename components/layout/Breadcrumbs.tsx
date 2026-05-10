"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Link 
        href="/dashboard" 
        className="hover:text-[#FF6B35] transition-colors flex items-center gap-1.5"
      >
        <Home size={14} /> Dashboard
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        
        // Skip root groups and IDs for cleaner labels if possible
        if (path.length > 20) return null; // Likely an ID

        const label = path
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight size={14} className="opacity-40" />
            <Link
              href={href}
              className={cn(
                "transition-colors",
                isLast ? "text-[#1A1F3C] font-black cursor-default" : "hover:text-[#FF6B35]"
              )}
              onClick={(e) => isLast && e.preventDefault()}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
