import { Suspense } from "react";
import Link from "next/link";
import { Plus, Plane } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTrips } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";

async function TripsList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const trips = await getTrips(user.id);

  const ongoing = trips.filter(t => t.status === 'ongoing');
  const upcoming = trips.filter(t => t.status === 'upcoming');
  const completed = trips.filter(t => t.status === 'completed');

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

  return (
    <Tabs defaultValue="upcoming" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TabsList className="bg-card shadow-sm rounded-[12px] p-1 h-12">
          <TabsTrigger value="ongoing" className="rounded-[8px] px-6">Ongoing ({ongoing.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-[8px] px-6">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-[8px] px-6">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <Button asChild className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-[12px] h-12 px-6">
          <Link href="/trips/new">
            <Plus className="mr-2 h-5 w-5" />
            New Trip
          </Link>
        </Button>
      </div>

      <TabsContent value="ongoing" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ongoing.length > 0 ? (
          ongoing.map(trip => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No ongoing trips at the moment.
          </div>
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.length > 0 ? (
          upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No upcoming trips planned.
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {completed.length > 0 ? (
          completed.map(trip => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No completed trips yet.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function TripsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F3C]">My Trips</h1>
        <p className="text-muted-foreground mt-1">Manage and track your travel adventures</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <TripSkeleton />
          <TripSkeleton />
          <TripSkeleton />
        </div>
      }>
        <TripsList />
      </Suspense>
    </div>
  );
}
