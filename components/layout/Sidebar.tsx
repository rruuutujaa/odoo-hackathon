"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  Search, 
  Users, 
  User, 
  ShieldCheck,
  PlaneTakeoff,
  ScrollText,
  ClipboardCheck,
  Receipt,
  LogOut,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const mainLinks = [
  { label: "Mission Control", href: "/dashboard", icon: LayoutDashboard },
  { label: "Active Operations", href: "/trips", icon: Map },
  { label: "Global Feed", href: "/community", icon: Users },
  { label: "Target Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params.id as string;

  const tripLinks = tripId ? [
    { label: "Itinerary Engine", href: `/trips/${tripId}/build`, icon: PlaneTakeoff },
    { label: "Tactical Journal", href: `/trips/${tripId}/notes`, icon: ScrollText },
    { label: "Supply Checklist", href: `/trips/${tripId}/checklist`, icon: ClipboardCheck },
    { label: "Fiscal Ledger", href: `/trips/${tripId}/invoice`, icon: Receipt },
  ] : [];

  return (
    <div className="flex h-full w-80 flex-col bg-[#050505] text-white border-r border-white/5 relative z-50 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-[80px]" />
      
      {/* Branded Header */}
      <div className="flex h-32 items-center px-10 relative">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FF6B35] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#E85A24] p-3 rounded-2xl relative shadow-2xl">
              <PlaneTakeoff className="h-8 w-8 text-white rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter italic leading-none">TRAVELOOP</span>
            <span className="text-[10px] font-bold text-white/30 tracking-[0.3em] mt-1">EST. 2026</span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12">
        {/* Main Navigation */}
        <nav className="space-y-3">
          <p className="px-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" /> Core Systems
          </p>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center justify-between rounded-[24px] px-5 py-4 text-sm font-bold transition-all duration-500",
                pathname === link.href 
                  ? "bg-white/5 text-white shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10" 
                  : "text-white/40 hover:bg-white/[0.02] hover:text-white"
              )}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors duration-500",
                  pathname === link.href ? "bg-[#FF6B35] text-white" : "bg-white/5 text-white/20 group-hover:text-white"
                )}>
                  <link.icon className="h-5 w-5" />
                </div>
                {link.label}
              </div>
              {pathname === link.href && <ChevronRight className="h-4 w-4 text-[#FF6B35]" />}
            </Link>
          ))}
        </nav>

        {/* Tactical Navigation (Contextual) */}
        {tripId && (
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <p className="px-5 text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/40 mb-6 flex items-center gap-2">
               Active Protocol
            </p>
            {tripLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between rounded-[24px] px-5 py-4 text-sm font-bold transition-all duration-500 border border-transparent",
                  pathname === link.href 
                    ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 shadow-[0_0_50px_rgba(255,107,53,0.1)]" 
                    : "text-white/30 hover:bg-white/[0.02] hover:text-[#FF6B35]"
                )}
              >
                <div className="flex items-center gap-5">
                  <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-[#FF6B35]" : "text-white/20 group-hover:text-[#FF6B35]")} />
                  {link.label}
                </div>
                {pathname === link.href && <div className="w-1.5 h-6 rounded-full bg-[#FF6B35]" />}
              </Link>
            ))}
          </motion.nav>
        )}

        {/* User Intel */}
        <section className="space-y-3 pt-6 border-t border-white/5">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-5 rounded-[24px] px-5 py-4 text-sm font-bold transition-all",
              pathname === "/profile" ? "bg-white/5 text-white" : "text-white/30 hover:text-white"
            )}
          >
            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden flex items-center justify-center bg-white/5">
              <User size={20} className="text-white/20" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs">User Profile</span>
               <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5 text-glow">Authenticated</span>
            </div>
          </Link>
        </section>
      </div>

      {/* Shutdown Sequence */}
      <div className="p-8">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-3 rounded-[24px] px-5 py-4 text-xs font-black uppercase tracking-widest text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all border border-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
