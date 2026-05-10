"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStops } from "@/lib/actions/stops";
import { getTripById } from "@/lib/actions/trips";
import { StopCard } from "./components/StopCard";
import { StopForm } from "./components/StopForm";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loader2, Plus, ArrowLeft, LayoutGrid, Save } from "lucide-react";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";

export default function ItineraryBuilderPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [stops, setStops] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const data = await getStops(tripId);
      const tripData = await getTripById(tripId);
      setStops(data);
      setTrip(tripData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Builder Header */}
      <div className="flex flex-col gap-4">
        <Link href={`/trips/${tripId}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Trip Details
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#1A1F3C]">Itinerary Builder</h1>
            <p className="text-muted-foreground font-medium mt-1">Organize stops and activities for {trip?.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowAddForm(true)} className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-[#FF6B35]/20">
              <Plus className="mr-2 h-5 w-5" /> Add New Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Builder Canvas */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <StopForm tripId={tripId} onCancel={() => setShowAddForm(false)} onSuccess={() => { setShowAddForm(false); fetchStops(); }} />
        </motion.div>
      )}

      {stops.length === 0 ? (
        <EmptyState
          title="No stops added yet"
          description="Your itinerary is looking a bit empty. Add your first city or destination to get started."
          icon={LayoutGrid}
        />
      ) : (
        <div className="space-y-6">
          {stops.map((stop, index) => (
            <StopCard 
              key={stop.id} 
              stop={stop} 
              index={index} 
              onUpdate={fetchStops}
            />
          ))}
        </div>
      )}
    </div>
  );
}
