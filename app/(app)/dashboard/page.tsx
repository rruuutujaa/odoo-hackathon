import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTrips, getTripStats } from "@/lib/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  MoveRight,
  Sparkles,
  Map,
  Compass,
  ArrowUpRight
} from "lucide-react";
import * as motion from "framer-motion/client";

async function DashboardStats({ userId }: { userId: string }) {
  const stats = await getTripStats(userId);

  return (
    <div className="flex flex-wrap gap-12 border-l border-foreground/10 pl-8">
      {[
        { label: "Active Journeys", value: stats.ongoing },
        { label: "Planned Routes", value: stats.upcoming },
        { label: "Completed Expeditions", value: stats.completed },
      ].map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
          <h3 className="text-4xl font-display">{item.value.toString().padStart(2, '0')}</h3>
        </div>
      ))}
    </div>
  );
}

async function TripExhibition({ userId }: { userId: string }) {
  const trips = await getTrips(userId);
  const featuredTrip = trips[0];

  if (trips.length === 0) {
    return (
      <EmptyState
        title="Begin Your Narrative"
        description="Craft your first bespoke travel itinerary."
        ctaLabel="Initialize Loop"
        ctaHref="/trips/new"
        icon={Sparkles}
      />
    );
  }

  return (
    <div className="space-y-24">
      {/* Featured Trip Section (Asymmetrical) */}
      {featuredTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group">
             <div className="absolute inset-0 bg-[#FF6B35]/5 -m-4 rounded-3xl group-hover:bg-[#FF6B35]/10 transition-colors" />
             <div className="relative aspect-[16/9] bg-muted overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&h=800&fit=crop" 
                  alt="Featured" 
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
                />
             </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
             <div className="space-y-4">
                <Badge variant="outline" className="rounded-full border-foreground/20 px-4 py-1 uppercase tracking-widest text-[10px] font-black">Featured Operation</Badge>
                <h2 className="text-6xl font-display leading-[0.9]">{featuredTrip.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm italic">
                  "{featuredTrip.description || "The journey of a thousand miles begins with a single design."}"
                </p>
             </div>
             <Button asChild size="lg" className="rounded-full px-12 group h-16 bg-foreground text-background hover:bg-[#FF6B35] hover:text-white transition-all duration-500">
                <Link href={`/trips/${featuredTrip.id}`}>
                  Enter Itinerary <ArrowUpRight className="ml-3 group-hover:rotate-45 transition-transform" />
                </Link>
             </Button>
          </div>
        </div>
      )}

      {/* Grid of Other Trips (Minimalist) */}
      <div className="space-y-12">
         <div className="flex items-end justify-between border-b border-foreground/10 pb-8">
            <h3 className="text-3xl font-display tracking-tighter">Archived Archives.</h3>
            <Link href="/trips" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-[#FF6B35] transition-colors">
               Explore all <MoveRight size={16} />
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {trips.slice(1, 4).map((trip) => (
              <div key={trip.id} className="space-y-6 group cursor-pointer">
                 <div className="aspect-[4/5] bg-muted rounded-xl overflow-hidden relative">
                    <img 
                       src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&h=500&fit=crop" 
                       alt={trip.title} 
                       className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-display group-hover:text-[#FF6B35] transition-colors">{trip.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                       {new Date(trip.startDate).getFullYear()} Expedition
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen">
      {/* Editorial Header */}
      <section className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-20 items-end border-b border-foreground/5">
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-8xl md:text-9xl font-display leading-[0.85] tracking-tighter">
              Bespoke <br />
              <span className="text-[#FF6B35] italic">Travel.</span>
            </h1>
          </div>
          <div className="max-w-md space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Curating the world&apos;s most meaningful journeys for agent <span className="text-foreground font-black underline underline-offset-8 decoration-[#FF6B35]/30">{session.user.firstName}</span>.
            </p>
            <div className="flex gap-4">
               <Button asChild size="lg" className="rounded-full bg-[#FF6B35] hover:bg-black text-white px-10 h-14 font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/20">
                  <Link href="/trips/new">New Journey</Link>
               </Button>
            </div>
          </div>
        </div>
        
        <Suspense fallback={<div className="h-20 w-full bg-muted animate-pulse rounded-xl" />}>
           <DashboardStats userId={session.user.id} />
        </Suspense>
      </section>

      {/* Main Exhibition */}
      <section className="section-padding">
         <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-3xl" />}>
            <TripExhibition userId={session.user.id} />
         </Suspense>
      </section>

      {/* Luxury Footer Detail */}
      <section className="px-12 md:px-24 py-12 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity border-t border-foreground/5">
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Travel Loop Systems</span>
         <div className="flex gap-8">
            <Map size={16} />
            <Compass size={16} />
         </div>
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ver. 26.04.10</span>
      </section>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
