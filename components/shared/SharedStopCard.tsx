import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Activity as ActivityIcon } from "lucide-react";
import { format } from "date-fns";

interface SharedStopCardProps {
  stop: any;
  index: number;
}

export function SharedStopCard({ stop, index }: SharedStopCardProps) {
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        {/* Stop Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-muted/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FF6B35] font-black text-xs uppercase tracking-widest">
              <MapPin size={14} /> Stop {index + 1}
            </div>
            <h3 className="text-3xl font-black text-[#1A1F3C]">{stop.city}, {stop.country}</h3>
            <p className="flex items-center gap-2 text-muted-foreground font-medium">
              <Calendar size={16} /> 
              {format(new Date(stop.startDate), "MMMM dd")} - {format(new Date(stop.endDate), "MMMM dd, yyyy")}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Budget for Stop</p>
            <p className="text-2xl font-black text-[#1A1F3C]">${stop.budget.toLocaleString()}</p>
          </div>
        </div>

        {/* Activities List */}
        <div className="p-6 md:p-8 space-y-6 bg-muted/5">
          <h4 className="font-bold text-[#1A1F3C] flex items-center gap-2">
            <ActivityIcon size={18} className="text-[#FF6B35]" /> Planned Activities
          </h4>

          {stop.activities?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stop.activities.map((ta: any) => (
                <div key={ta.id} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-muted shadow-sm group hover:border-[#FF6B35]/30 transition-all">
                  <div className="p-3 rounded-xl bg-orange-50 text-[#FF6B35]">
                    <ActivityIcon size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-[#1A1F3C]">{ta.activity.name}</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Clock size={12} /> {ta.time || "TBD"}</span>
                      <span>{ta.activity.category}</span>
                    </div>
                    {ta.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">"{ta.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white/50 rounded-2xl border border-dashed">
              <p className="text-sm text-muted-foreground font-medium italic">No activities recorded for this destination.</p>
            </div>
          )}

          {stop.notes && (
            <div className="mt-4 p-6 rounded-2xl bg-[#1A1F3C]/5 border border-[#1A1F3C]/10">
              <p className="text-xs font-black uppercase tracking-widest text-[#1A1F3C] mb-2 opacity-40">Stop Notes</p>
              <p className="text-sm text-[#1A1F3C] leading-relaxed font-medium">{stop.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
