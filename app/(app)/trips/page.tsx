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

const MOCK_TRIPS = [
  {
    id: "mock-trip-1",
    title: "Kyoto Expedition",
    description: "Systematic exploration of the ancient capital and its hidden Zen gardens.",
    status: "UPCOMING",
    startDate: new Date("2026-10-12"),
    endDate: new Date("2026-10-22"),
    totalBudget: 4500,
    cover_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&fit=crop",
    stops: [{}, {}, {}]
  },
  {
    id: "mock-trip-2",
    title: "Iceland North Loop",
    description: "Chasing the aurora borealis across the high-latitude volcanic grid.",
    status: "ONGOING",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-15"),
    totalBudget: 6200,
    cover_image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&fit=crop",
    stops: [{}, {}, {}, {}]
  },
  {
    id: "mock-trip-3",
    title: "Swiss Alps Tactical",
    description: "High-altitude reconnaissance of the Interlaken and Lauterbrunnen sectors.",
    status: "COMPLETED",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-08-25"),
    totalBudget: 5800,
    cover_image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&fit=crop",
    stops: [{}, {}]
  }
];

async function TripsList({ userId }: { userId: string }) {
  const realTrips = await getTrips(userId);
  
  // Combine real trips with mocks if less than 3 trips exist
  const trips = realTrips.length >= 3 ? realTrips : [...realTrips, ...MOCK_TRIPS.slice(0, 3 - realTrips.length)];

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
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF5C00]">Collection</p>
          <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
            <TabsTrigger value="all" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF5C00] data-[state=active]:border-b-4 data-[state=active]:border-[#FF5C00] transition-all">All Objects</TabsTrigger>
            <TabsTrigger value="ongoing" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF5C00] data-[state=active]:border-b-4 data-[state=active]:border-[#FF5C00] transition-all">Active</TabsTrigger>
            <TabsTrigger value="upcoming" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF5C00] data-[state=active]:border-b-4 data-[state=active]:border-[#FF5C00] transition-all">Planned</TabsTrigger>
            <TabsTrigger value="completed" className="p-0 pb-4 rounded-none bg-transparent font-display text-2xl data-[state=active]:bg-transparent data-[state=active]:text-[#FF5C00] data-[state=active]:border-b-4 data-[state=active]:border-[#FF5C00] transition-all">Archived</TabsTrigger>
          </TabsList>
        </div>
        <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-[#FF5C00] hover:text-white px-10 h-14 font-black uppercase tracking-widest text-xs transition-all duration-500 shadow-2xl">
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
              trip_stops: [{ count: trip.stops?.length || 0 }]
            }} 
          />
        ))}
      </TabsContent>

      <TabsContent value="ongoing" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {ongoing.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops?.length || 0 }]}} />
        ))}
        {ongoing.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground font-display text-2xl italic">No active missions in the grid.</p>}
      </TabsContent>

      <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {upcoming.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops?.length || 0 }]}} />
        ))}
        {upcoming.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground font-display text-2xl italic">The future is an unwritten design.</p>}
      </TabsContent>

      <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {completed.map(trip => (
          <TripCard key={trip.id} trip={{...trip, start_date: trip.startDate, end_date: trip.endDate, status: trip.status.toLowerCase(), trip_stops: [{ count: trip.stops?.length || 0 }]}} />
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
          <span className="text-primary italic">Archive.</span>
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
