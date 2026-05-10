import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTrips } from "@/lib/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Plane } from "lucide-react";

async function TripsList({ userId }: { userId: string }) {
  const trips = await getTrips(userId);

  if (trips.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        description="You haven't planned any trips yet. Start your journey by creating a new trip!"
        ctaLabel="Create New Trip"
        ctaHref="/trips/new"
        icon={Plane}
      />
    );
  }

  const ongoing = trips.filter(t => t.status === "ONGOING");
  const upcoming = trips.filter(t => t.status === "UPCOMING");
  const completed = trips.filter(t => t.status === "COMPLETED");

  return (
    <Tabs defaultValue="all" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TabsList className="bg-white shadow-sm rounded-xl p-1 h-12 border border-muted">
          <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-[#1A1F3C] data-[state=active]:text-white transition-all">All ({trips.length})</TabsTrigger>
          <TabsTrigger value="ongoing" className="rounded-lg px-6 data-[state=active]:bg-[#1A1F3C] data-[state=active]:text-white transition-all">Ongoing ({ongoing.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg px-6 data-[state=active]:bg-[#1A1F3C] data-[state=active]:text-white transition-all">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-6 data-[state=active]:bg-[#1A1F3C] data-[state=active]:text-white transition-all">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <Button asChild className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-12 px-6 shadow-lg shadow-[#FF6B35]/20 font-bold">
          <Link href="/trips/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Trip
          </Link>
        </Button>
      </div>

      <TabsContent value="all" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <TabsContent value="ongoing" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ongoing.map(trip => (
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
        {ongoing.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground font-medium">No ongoing trips at the moment.</p>}
      </TabsContent>

      <TabsContent value="upcoming" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.map(trip => (
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
        {upcoming.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground font-medium">No upcoming trips planned.</p>}
      </TabsContent>

      <TabsContent value="completed" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {completed.map(trip => (
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
        {completed.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground font-medium">No completed trips yet.</p>}
      </TabsContent>
    </Tabs>
  );
}

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#1A1F3C]">My Trips</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage and explore all your past and future itineraries.</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          <TripSkeleton />
          <TripSkeleton />
          <TripSkeleton />
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
