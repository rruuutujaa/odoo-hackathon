import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search as SearchIcon, MapPin, TrendingUp, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTrips } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { Card } from "@/components/ui/card";

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getProfile(user.id);
  const trips = await getTrips(user.id);
  const previousTrips = trips.filter(t => t.status === 'completed');

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1F3C]">Hey {profile.first_name}!</h1>
          <p className="text-muted-foreground mt-1">Ready for your next adventure?</p>
        </div>
        <Button asChild className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-[12px] px-6 h-12">
          <Link href="/trips/new">
            <Plus className="mr-2 h-5 w-5" />
            Plan a Trip
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search your trips, destinations..." 
          className="pl-12 h-14 bg-card shadow-sm border-none rounded-[16px] text-lg focus-visible:ring-1"
        />
      </div>

      {/* Regional Selections (Static) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Regional Selections
          </h2>
          <Button variant="link" className="text-primary font-semibold">View all</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Kyoto, Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&h=250&fit=crop" },
            { name: "Paris, France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&h=250&fit=crop" },
            { name: "Bali, Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&h=250&fit=crop" },
            { name: "Rome, Italy", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&h=250&fit=crop" }
          ].map((city) => (
            <div key={city.name} className="group relative aspect-[4/3] rounded-[16px] overflow-hidden cursor-pointer shadow-sm">
              <img src={city.img} alt={city.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <p className="text-white font-bold">{city.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Previous Trips
        </h2>
        {previousTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-muted/30 border-dashed">
            <p className="text-muted-foreground">You haven&apos;t completed any trips yet.</p>
          </Card>
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-10 animate-pulse">
        <div className="h-20 w-1/3 bg-muted rounded-lg" />
        <div className="h-14 w-full bg-muted rounded-2xl" />
        <div className="grid grid-cols-3 gap-6 pt-10">
          <TripSkeleton />
          <TripSkeleton />
          <TripSkeleton />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
