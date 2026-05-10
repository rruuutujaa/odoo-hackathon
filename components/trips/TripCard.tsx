"use client";

import Link from "next/link";
import { Calendar, MapPin, Trash2, ArrowUpRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    description?: string | null;
    start_date: Date | string;
    end_date: Date | string;
    status: string;
    trip_stops?: { count: number }[];
  };
}

const statusConfig: Record<string, { color: string, glow: string, label: string }> = {
  ongoing: { color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]", label: "Active" },
  upcoming: { color: "text-[#FF6B35]", glow: "shadow-[0_0_20px_rgba(255,107,53,0.2)]", label: "Pending" },
  completed: { color: "text-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.2)]", label: "Archived" },
};

export function TripCard({ trip }: TripCardProps) {
  const destinationCount = trip.trip_stops?.[0]?.count || 0;
  const config = statusConfig[trip.status.toLowerCase()] || statusConfig.upcoming;

  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="glass-dark border-white/5 rounded-[40px] overflow-hidden relative group-hover:border-white/20 transition-all duration-500">
          <CardContent className="p-0">
            {/* Visual Header */}
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/20">
              {/* Animated Parallax Map Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                 <MapPin size={240} strokeWidth={1.5} className="group-hover:scale-125 transition-transform duration-1000" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className={cn(
                  "px-4 py-1.5 rounded-full glass-dark text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                  config.color,
                  config.glow
                )}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {config.label}
                </div>
              </div>

              {/* Action Circle */}
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                 <div className="bg-[#FF6B35] text-white p-3 rounded-full shadow-2xl shadow-orange-500/40">
                    <ArrowUpRight size={20} strokeWidth={3} />
                 </div>
              </div>

              {/* Title Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 gap-2">
                 <h3 className="text-3xl font-black text-white tracking-tighter leading-tight group-hover:text-[#FF6B35] transition-colors duration-500 line-clamp-1">
                    {trip.title}
                 </h3>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-2 italic">
                       <Calendar size={12} className="text-[#FF6B35]" />
                       {format(new Date(trip.start_date), "MMM dd")} - {format(new Date(trip.end_date), "MMM dd")}
                    </span>
                 </div>
              </div>
            </div>

            {/* Tactical Brief */}
            <div className="p-8 space-y-6">
              <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-2 italic border-l-2 border-[#FF6B35]/20 pl-4">
                {trip.description || "Mission parameters undefined. Strategic planning required for optimal execution."}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-white/5 text-[#FF6B35]">
                      <Activity size={16} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                      {destinationCount} Active Sectors
                   </span>
                </div>
                
                {/* Micro avatars or placeholder shapes */}
                <div className="flex -space-x-2">
                   {[1,2].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[8px] font-black text-white/20">
                        OP
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
