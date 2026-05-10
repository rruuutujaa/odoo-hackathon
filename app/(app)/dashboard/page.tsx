import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTrips, getTripStats } from "@/lib/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripSkeleton } from "@/components/trips/TripSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plane, 
  LayoutDashboard, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  PlusCircle,
  TrendingUp
} from "lucide-react";

async function DashboardStats({ userId }: { userId: string }) {
  const stats = await getTripStats(userId);

  const statItems = [
    { label: "Total Trips", value: stats.total, icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Ongoing", value: stats.ongoing, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Upcoming", value: stats.upcoming, icon: Plane, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="border-none shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <h3 className="text-2xl font-bold text-[#1A1F3C]">{item.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentTrips({ userId }: { userId: string }) {
  const trips = await getTrips(userId);
  const recentTrips = trips.slice(0, 3);

  if (trips.length === 0) {
    return (
      <EmptyState
        title="No trips planned yet"
        description="Start your journey by creating your first travel itinerary."
        ctaLabel="Plan a Trip"
        ctaHref="/trips/new"
        icon={PlusCircle}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentTrips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={{
            ...trip,
            // Map Prisma fields to TripCard expectations if they differ
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
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const firstName = session.user.firstName || "Traveler";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1F3C]">Hey {firstName}! 👋</h1>
          <p className="text-muted-foreground mt-1 font-medium">Welcome back to your travel loop. Where to next?</p>
        </div>
        <Button asChild className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-12 px-6 shadow-lg shadow-[#FF6B35]/20 font-bold transition-all hover:scale-105">
          <Link href="/trips/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Plan a New Trip
          </Link>
        </Button>
      </div>

      {/* Stats Section */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
        </div>
      }>
        <DashboardStats userId={session.user.id} />
      </Suspense>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Recent Trips */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
              Recent Adventures
            </h2>
            <Button variant="ghost" asChild className="text-[#FF6B35] font-bold hover:bg-[#FF6B35]/5">
              <Link href="/trips">View All Trips</Link>
            </Button>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TripSkeleton />
              <TripSkeleton />
              <TripSkeleton />
            </div>
          }>
            <RecentTrips userId={session.user.id} />
          </Suspense>
        </div>

        {/* Right Column: Quick Inspiration (Static for demo) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-[#FF6B35]" />
            Quick Access
          </h2>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-[#1A1F3C] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Pro Planning Tip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/70 leading-relaxed">
                Organize your stops chronologically to automatically generate an optimized packing list!
              </p>
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl">
                Read Guide
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-[#FF6B35]/10 border border-[#FF6B35]/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#FF6B35] p-2 rounded-lg text-white">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1F3C]">Community Challenge</h4>
                  <p className="text-xs text-muted-foreground mt-1">Share your Bali itinerary to earn the "Island Hopper" badge!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
