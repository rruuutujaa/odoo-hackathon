import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTrips, getTripStats } from "@/lib/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { 
  MoveRight,
  Sparkles,
  Map,
  Compass,
  ArrowUpRight,
  Globe
} from "lucide-react";
import * as motion from "framer-motion/client";

async function DashboardStats({ userId }: { userId: string }) {
  const stats = await getTripStats(userId);

  return (
    <div className="flex flex-wrap gap-x-20 gap-y-10">
      {[
        { label: "Active", value: stats.ongoing },
        { label: "Planned", value: stats.upcoming },
        { label: "Archived", value: stats.completed },
      ].map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
          <h3 className="text-6xl font-display text-primary">{item.value.toString().padStart(2, '0')}</h3>
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
        title="The Unwritten Map"
        description="Your travel legacy begins with a single intentional design."
        ctaLabel="Initialize Sequence"
        ctaHref="/trips/new"
        icon={Globe}
      />
    );
  }

  return (
    <div className="space-y-40">
      {/* High-End Featured Section */}
      {featuredTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-foreground/5 bg-card overflow-hidden luxury-shadow">
          <div className="lg:col-span-8 relative aspect-[16/10] lg:aspect-auto h-full overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&h=800&fit=crop" 
               alt="Featured" 
               className="object-cover w-full h-full grayscale" 
             />
             <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
          <div className="lg:col-span-4 p-16 flex flex-col justify-between space-y-20 bg-background border-l border-foreground/5">
             <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Priority Loop</span>
                <h2 className="text-7xl font-display leading-[0.8] tracking-tighter">{featuredTrip.title}</h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l border-primary/30 pl-8">
                  "{featuredTrip.description || "Refined movement across the global grid."}"
                </p>
             </div>
             <Button asChild size="lg" className="rounded-none px-0 group h-auto bg-transparent text-foreground hover:bg-transparent hover:text-primary transition-all border-none justify-start w-fit">
                <Link href={`/trips/${featuredTrip.id}`} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em]">
                  Execute Protocol <MoveRight size={20} className="group-hover:translate-x-4 transition-transform" />
                </Link>
             </Button>
          </div>
        </div>
      )}

      {/* Structured Grid */}
      <div className="space-y-20">
         <div className="flex items-center justify-between border-b border-foreground/10 pb-10">
            <h3 className="text-5xl font-display">Archived Records.</h3>
            <Link href="/trips" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:tracking-[0.6em] transition-all">
               View All Datasets
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-foreground/5">
            {trips.slice(1, 4).map((trip) => (
              <div key={trip.id} className="bg-background p-12 space-y-10 group cursor-pointer hover:bg-muted/30 transition-colors">
                 <div className="aspect-[4/5] bg-muted overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img 
                       src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&h=500&fit=crop" 
                       alt={trip.title} 
                       className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform" 
                    />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-display leading-none group-hover:text-primary transition-colors">{trip.title}</h4>
                    <div className="flex justify-between items-center pt-4 border-t border-foreground/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {new Date(trip.startDate).getFullYear()}
                       </span>
                       <ArrowUpRight size={16} className="opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
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
    <div className="page-transition min-h-screen">
      {/* Architectural Header */}
      <header className="section-padding grid grid-cols-1 lg:grid-cols-12 gap-20 items-end border-b border-foreground/5 bg-background">
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Command Status: Active</span>
            <h1 className="text-8xl md:text-9xl font-display leading-[0.8] tracking-tighter">
              Bespoke <br />
              Itineraries.
            </h1>
          </div>
          <div className="max-w-md space-y-10">
            <p className="text-2xl text-muted-foreground leading-snug font-medium">
              Curating the world&apos;s most meaningful movements for explorer <span className="text-foreground font-black italic">{session.user.firstName}</span>.
            </p>
            <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-primary hover:text-white px-12 h-16 font-black uppercase tracking-[0.3em] text-xs transition-all shadow-none">
              <Link href="/trips/new">Initialize New Journey</Link>
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-5 w-full">
           <Suspense fallback={<div className="h-20 w-full bg-muted animate-pulse" />}>
              <DashboardStats userId={session.user.id} />
           </Suspense>
        </div>
      </header>

      {/* Exhibition Space */}
      <main className="section-padding bg-background">
         <Suspense fallback={<div className="h-screen w-full bg-muted animate-pulse" />}>
            <TripExhibition userId={session.user.id} />
         </Suspense>
      </main>

      {/* Signature Detail: Minimalist Footer */}
      <footer className="px-12 md:px-24 py-16 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-foreground/5 opacity-40">
         <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-foreground/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Traveloop Systems Terminal</span>
         </div>
         <div className="flex gap-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol V.26</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Node 04-10</span>
         </div>
      </footer>
    </div>
  );
}
