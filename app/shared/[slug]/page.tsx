import { notFound } from "next/navigation";
import { getSharedTrip } from "@/lib/actions/shared";
import { SharedTripHeader } from "@/components/shared/SharedTripHeader";
import { SharedStopCard } from "@/components/shared/SharedStopCard";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, MapPin, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shared = await getSharedTrip(slug);

  if (!shared) notFound();

  const { trip } = shared;
  const creator = trip.user;

  return (
    <div className="min-h-screen bg-muted/20 animate-in fade-in duration-700 pb-20">
      {/* Hero / Public Header */}
      <SharedTripHeader 
        trip={trip} 
        creator={creator} 
        slug={slug}
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 -mt-12 relative z-10">
        
        {/* Left Column: Itinerary Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#FF6B35] p-2 rounded-lg text-white">
              <MapPin size={24} />
            </div>
            <h2 className="text-2xl font-black text-[#1A1F3C]">Trip Itinerary</h2>
          </div>

          <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#FF6B35] before:via-[#1A1F3C] before:to-muted-foreground/20">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white border-4 border-[#1A1F3C] z-10 shadow-md" />
                
                <SharedStopCard stop={stop} index={index} />
              </div>
            ))}
          </div>

          {trip.stops.length === 0 && (
            <Card className="border-none shadow-sm rounded-2xl p-12 text-center bg-white">
              <Plane className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-muted-foreground">No stops planned yet.</h3>
            </Card>
          )}
        </div>

        {/* Right Column: Trip Stats & CTA */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-2xl bg-[#1A1F3C] text-white overflow-hidden sticky top-8">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-black border-b border-white/10 pb-4">Trip Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-bold text-xs uppercase tracking-widest">Budget</span>
                  <span className="text-xl font-black text-[#FF6B35]">${trip.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-bold text-xs uppercase tracking-widest">Stops</span>
                  <span className="text-xl font-black">{trip.stops.length} Cities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-bold text-xs uppercase tracking-widest">Duration</span>
                  <span className="text-xl font-black">
                    {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-white/10">
                <p className="text-sm text-white/50 italic leading-relaxed">
                  "Planning trips is hard. Traveloop makes it seamless. Check out how {creator.firstName} organized this journey!"
                </p>
                <Button asChild className="w-full h-14 bg-[#FF6B35] hover:bg-orange-400 text-white font-black text-lg rounded-xl shadow-xl shadow-orange-900/20">
                  <Link href="/register">
                    Start Your Own Trip <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/40 uppercase tracking-tighter">
                  <Users size={12} /> Join 10k+ Travelers
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof / Sharing */}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between border border-muted">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Globe size={20} />
              </div>
              <span className="font-bold text-[#1A1F3C] text-sm">Public View</span>
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Traveloop Official</span>
          </div>
        </div>
      </div>
    </div>
  );
}
