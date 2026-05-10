"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Share2, LogIn, Calendar, Wallet } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface SharedTripHeaderProps {
  trip: any;
  creator: any;
  slug: string;
}

export function SharedTripHeader({ trip, creator, slug }: SharedTripHeaderProps) {
  const copyLink = () => {
    const url = `${window.location.origin}/shared/${slug}`;
    navigator.clipboard.writeText(url);
    alert("Public trip link copied to clipboard!");
  };

  return (
    <div className="bg-[#1A1F3C] text-white pt-20 pb-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#FF6B35] text-white hover:bg-orange-600 border-none px-4 py-1 font-bold rounded-full">
                Public Itinerary
              </Badge>
              <div className="flex items-center gap-2 text-white/40 text-xs font-black uppercase tracking-widest">
                <Plane size={14} /> Shared via Traveloop
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
              {trip.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg">
                  {creator.firstName[0]}
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-tighter">Planned By</p>
                  <p className="font-bold">{creator.firstName} {creator.lastName}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Calendar className="text-[#FF6B35]" size={20} />
                <span className="font-medium text-white/80">
                  {format(new Date(trip.startDate), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button 
              onClick={copyLink}
              variant="outline" 
              className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold px-6 h-12"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Itinerary
            </Button>
            <Button asChild className="bg-white text-[#1A1F3C] hover:bg-white/90 rounded-xl px-8 h-12 font-black shadow-xl shadow-white/5">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Join Traveloop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
