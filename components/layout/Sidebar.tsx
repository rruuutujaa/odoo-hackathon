"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips", href: "/trips", icon: Map },
  { label: "Create Trip", href: "/trips/new", icon: PlusCircle },
  { label: "Itinerary", href: "/trips/[id]/build", icon: PlaneTakeoff },
  { label: "Activity Search", href: "/search", icon: Search },
  { label: "Budget & View", href: "/trips/[id]", icon: ScrollText },
  { label: "Community", href: "/community", icon: Users },
  { label: "Packing List", href: "/trips/[id]/checklist", icon: ClipboardCheck },
  { label: "Trip Journal", href: "/trips/[id]/notes", icon: ScrollText },
  { label: "Billing", href: "/trips/[id]/invoice", icon: Receipt },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Admin", href: "/admin", icon: ShieldCheck, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
          <PlaneTakeoff className="h-6 w-6" />
          <span>Traveloop</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarLinks.map((link) => (
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
      </nav>
    </div>
  );
}
