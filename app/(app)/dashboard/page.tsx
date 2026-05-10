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

async function DashboardStats({ userId }: { userId: string }) {
  const stats = await getTripStats(userId);

  return (
    <div className="flex flex-wrap gap-x-12 gap-y-8 mt-12 border-t border-foreground/5 pt-12">
      {[
        { label: "Current", value: stats.ongoing },
        { label: "Target", value: stats.upcoming },
        { label: "Archive", value: stats.completed },
      ].map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">{item.label}</p>
          <h3 className="text-5xl font-display text-primary">{item.value.toString().padStart(2, '0')}</h3>
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
        title="Command center inactive"
        description="Initiate your first travel loop to begin data collection."
        ctaLabel="Start Mission"
        ctaHref="/trips/new"
        icon={Compass}
      />
    );
  }

  return (
    <div className="space-y-40">
      {/* High-End Featured Section */}
      {featuredTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-foreground/5 bg-card overflow-hidden luxury-shadow">
          <div className="lg:col-span-8 relative aspect-[16/10] lg:aspect-auto h-[400px] lg:h-full overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&h=800&fit=crop" 
               alt="Featured" 
               className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000" 
             />
             <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
          </div>
          <div className="lg:col-span-4 p-12 lg:p-16 flex flex-col justify-between space-y-12 bg-background border-l border-foreground/5">
             <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Primary Loop</span>
                <h2 className="text-6xl font-display leading-[0.8] tracking-tighter">{featuredTrip.title}</h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l border-primary/30 pl-8">
                  "{featuredTrip.description || "Refined movement across the global grid."}"
                </p>
             </div>
             <Button asChild size="lg" className="rounded-none px-0 group h-auto bg-transparent text-foreground hover:bg-transparent hover:text-primary transition-all border-none justify-start w-fit shadow-none">
                <Link href={`/trips/${featuredTrip.id}`} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em]">
                  Execute Protocol <MoveRight size={20} className="group-hover:translate-x-4 transition-transform" />
                </Link>
             </Button>
          </div>
        </div>
      )}

      {/* Grid of Other Trips */}
      <div className="space-y-20">
         <div className="flex items-center justify-between border-b border-foreground/10 pb-10">
            <h3 className="text-4xl font-display">Field Records.</h3>
            <Link href="/trips" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:tracking-[0.6em] transition-all">
               All Records
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-foreground/5">
            {trips.slice(1, 4).map((trip) => (
              <div key={trip.id} className="bg-background p-10 space-y-8 group cursor-pointer hover:bg-muted/10 transition-colors">
                 <div className="aspect-[4/5] bg-muted overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img 
                       src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&h=500&fit=crop" 
                       alt={trip.title} 
                       className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform" 
                    />
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-2xl font-display leading-none group-hover:text-primary transition-colors">{trip.title}</h4>
                    <div className="flex justify-between items-center pt-4 border-t border-foreground/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                          {new Date(trip.startDate).getFullYear()} DATA
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
    <div className="page-transition min-h-full bg-background">
      {/* Content Canvas */}
      <div className="max-w-[1400px] mx-auto">
        <section className="py-20 px-8 lg:px-20 border-b border-foreground/5">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Identity: {session.user.firstName}</span>
                  <h1 className="text-7xl md:text-8xl font-display leading-[0.9] tracking-tighter">
                    Mission <br />
                    <span className="text-primary italic">Intelligence.</span>
                  </h1>
                </div>
                <div className="max-w-md space-y-8">
                  <p className="text-xl text-muted-foreground leading-snug font-medium italic opacity-80">
                    Bespoke tactical planning for the modern explorer. Initiate your travel loop to begin data collection.
                  </p>
                  <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-primary hover:text-white px-12 h-16 font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-none w-full sm:w-fit">
                    <Link href="/trips/new">Launch Protocol</Link>
                  </Button>
                </div>
              </div>
              
              <div className="w-full">
                <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse" />}>
                   <DashboardStats userId={session.user.id} />
                </Suspense>
              </div>
           </div>
        </section>

        <section className="py-20 px-8 lg:px-20">
           <Suspense fallback={<div className="h-screen w-full bg-muted animate-pulse" />}>
              <TripExhibition userId={session.user.id} />
           </Suspense>
        </section>
      </div>
    </div>
  );
}
