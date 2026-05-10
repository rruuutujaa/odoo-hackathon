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
  Receipt
} from "lucide-react";

const mainLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips", href: "/trips", icon: Map },
  { label: "Create Trip", href: "/trips/new", icon: PlusCircle },
  { label: "Search", href: "/search", icon: Search },
  { label: "Community", href: "/community", icon: Users },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Admin", href: "/admin", icon: ShieldCheck, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params?.id as string;

  // Contextual links for when a user is inside a specific trip
  const tripLinks = tripId ? [
    { label: "Itinerary", href: `/trips/${tripId}/build`, icon: PlaneTakeoff },
    { label: "Budget & View", href: `/trips/${tripId}`, icon: ScrollText },
    { label: "Packing List", href: `/trips/${tripId}/checklist`, icon: ClipboardCheck },
    { label: "Trip Journal", href: `/trips/${tripId}/notes`, icon: ScrollText },
    { label: "Billing", href: `/trips/${tripId}/invoice`, icon: Receipt },
  ] : [];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
          <PlaneTakeoff className="h-6 w-6" />
          <span>Traveloop</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Main Navigation */}
        <section className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Main Menu</p>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </section>

        {/* Trip Context Navigation (Only shows when inside a trip) */}
        {tripId && (
          <section className="space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Current Trip</p>
            {tripLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
