"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Search, 
  Users, 
  User, 
  PlaneTakeoff,
  ScrollText,
  ClipboardCheck,
  Receipt,
  LogOut,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

const mainLinks = [
  { label: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Active Expeditions", href: "/trips", icon: Map },
  { label: "Social Society", href: "/community", icon: Users },
  { label: "Intel Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params.id as string;

  const tripLinks = tripId ? [
    { label: "Itinerary Engine", href: `/trips/${tripId}/build`, icon: PlaneTakeoff },
    { label: "Tactical Journal", href: `/trips/${tripId}/notes`, icon: ScrollText },
    { label: "Supply List", href: `/trips/${tripId}/checklist`, icon: ClipboardCheck },
    { label: "Fiscal Ledger", href: `/trips/${tripId}/invoice`, icon: Receipt },
  ] : [];

  return (
    <div className="flex h-full w-72 flex-col bg-background text-foreground border-r border-foreground/5 relative z-50">
      {/* Brand Header: Sharp & Solid */}
      <div className="flex h-24 items-center px-10 border-b border-foreground/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-foreground text-background p-2 rounded-none">
            <PlaneTakeoff className="h-6 w-6" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter italic">Traveloop.</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-12 space-y-12">
        {/* Navigation Groups */}
        <section className="space-y-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Main Systems</p>
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between rounded-none px-4 py-4 text-xs font-black uppercase tracking-widest transition-all",
                  pathname === link.href 
                    ? "bg-foreground text-background shadow-none" 
                    : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon className={cn("h-4 w-4", pathname === link.href ? "text-background" : "text-foreground/20 group-hover:text-foreground")} />
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>
        </section>

        {tripId && (
          <section className="space-y-4 animate-in fade-in slide-in-from-left-2">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">Active Protocol</p>
            <nav className="space-y-1">
              {tripLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center justify-between rounded-none px-4 py-4 text-xs font-black uppercase tracking-widest transition-all",
                    pathname === link.href 
                      ? "bg-primary text-white" 
                      : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </div>
                </Link>
              ))}
            </nav>
          </section>
        )}
      </div>

      {/* Shutdown Sequence: Clean & Solid */}
      <div className="p-8 border-t border-foreground/5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          End Session
        </button>
      </div>
    </div>
  );
}
