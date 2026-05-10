import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTrips } from "@/lib/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRight, Sparkles, Map } from "lucide-react";

async function TripsList({ userId }: { userId: string }) {
  const trips = await getTrips(userId);

  if (trips.length === 0) {
    return (
      <EmptyState
        title="Empty Archives"
        description="Your travel history is awaiting its first entry."
        ctaLabel="Initiate New Loop"
        ctaHref="/trips/new"
        icon={Sparkles}
      />
    );
  }

  const ongoing = trips.filter(t => t.status === "ONGOING");
  const upcoming = trips.filter(t => t.status === "UPCOMING");
  const completed = trips.filter(t => t.status === "COMPLETED");

  return (
    <Tabs defaultValue="all" className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-foreground/5 pb-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B35]">Collection</p>
          <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
            <TabsTrigger value="all" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35] transition-all">All Objects</TabsTrigger>
            <TabsTrigger value="ongoing" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35] transition-all">Active</TabsTrigger>
            <TabsTrigger value="upcoming" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35] transition-all">Planned</TabsTrigger>
            <TabsTrigger value="completed" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35] transition-all">Archived</TabsTrigger>
          </TabsList>
        </div>
        <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-[#FF6B35] hover:text-white px-10 h-14 font-black uppercase tracking-widest text-xs transition-all duration-500 shadow-2xl">
          <Link href="/trips/new">Create New Expedition</Link>
        </Button>
      </div>

      <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {trips.map(trip => (
          <TripCard 
            key={trip.id} 
            trip={{
              ...trip,
              // @ts-ignore
              start_date: trip.startDate,
              // @ts-ignore
              end_date: trip.endDate,
              // @ts-ignore
              status: trip.status.toLowerCase(),
              trip_stops: [{ count: trip.stops.length }]
            }} 
          />
        ))}
      </TabsContent>

      <TabsContent value="ongoing" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {ongoing.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops.length }]}} />
        ))}
        {ongoing.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground font-display text-2xl italic">No active missions in the grid.</p>}
      </TabsContent>

      <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {upcoming.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops.length }]}} />
        ))}
        {upcoming.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground font-display text-2xl italic">The future is an unwritten design.</p>}
      </TabsContent>

      <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {completed.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops.length }]}} />
        ))}
        {completed.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground font-display text-2xl italic">Capture memories to build your archive.</p>}
      </TabsContent>
    </Tabs>
  );
}

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="section-padding space-y-24 animate-in fade-in duration-1000">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-8xl font-display leading-[0.85] tracking-tighter">
          Trip <br />
          <span className="text-[#FF6B35] italic">Archive.</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
          A systematic collection of every journey, mission, and expedition curated by your unique travel loop.
        </p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
          <TripSkeleton />
          <TripSkeleton />
          <TripSkeleton />
        </div>
      }>
        <TripsList userId={session.user.id} />
      </Suspense>
    </div>
  );
}
