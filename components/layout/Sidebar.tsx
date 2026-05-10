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
    <div className="flex h-full w-[340px] flex-col bg-background text-foreground border-r border-foreground/5 relative z-50">
      {/* Brand Header: Large & Impactful */}
      <div className="flex h-32 items-center px-12 border-b border-foreground/5 bg-foreground/[0.02]">
        <Link href="/dashboard" className="flex items-center gap-4">
          <div className="bg-foreground text-background p-3 rounded-none">
            <PlaneTakeoff className="h-8 w-8" />
          </div>
          <span className="text-3xl font-display font-black tracking-tighter italic">Traveloop.</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 py-14 space-y-16">
        {/* Navigation Groups */}
        <section className="space-y-6">
          <p className="px-5 text-[11px] font-black uppercase tracking-[0.5em] text-foreground/30">Main Systems</p>
          <nav className="space-y-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between rounded-none px-5 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all",
                  pathname === link.href 
                    ? "bg-foreground text-background shadow-2xl scale-[1.02]" 
                    : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-5">
                  <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-background" : "text-foreground/20 group-hover:text-foreground")} />
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>
        </section>

        {tripId && (
          <section className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <p className="px-5 text-[11px] font-black uppercase tracking-[0.5em] text-primary">Active Protocol</p>
            <nav className="space-y-2">
              {tripLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center justify-between rounded-none px-5 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all",
                    pathname === link.href 
                      ? "bg-primary text-white scale-[1.02] shadow-xl shadow-orange-500/10" 
                      : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </div>
                </Link>
              ))}
            </nav>
          </section>
        )}
      </div>

      {/* Shutdown Sequence */}
      <div className="p-10 border-t border-foreground/5 bg-foreground/[0.01]">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-4 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-foreground/20 hover:text-red-500 transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
