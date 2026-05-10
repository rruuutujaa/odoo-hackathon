"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Trash2, 
  Edit3, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  MoreVertical,
  Activity as ActivityIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteStop } from "@/lib/actions/stops";
import { StopForm } from "./StopForm";
import { ActivityForm } from "./ActivityForm";
import { motion, AnimatePresence } from "framer-motion";

interface StopCardProps {
  stop: any;
  index: number;
  onUpdate: () => void;
}

export function StopCard({ stop, index, onUpdate }: StopCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this stop and all its activities?")) {
      await deleteStop(stop.id);
      onUpdate();
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-0">
        {isEditing ? (
          <div className="p-6">
            <StopForm 
              tripId={stop.tripId} 
              stop={stop} 
              onCancel={() => setIsEditing(false)} 
              onSuccess={() => { setIsEditing(false); onUpdate(); }} 
            />
          </div>
        ) : (
          <div>
            {/* Stop Header */}
            <div className="p-6 flex items-start justify-between gap-4 border-b border-muted/30">
              <div className="flex items-start gap-5">
                <div className="bg-[#1A1F3C] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-lg">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#1A1F3C]">{stop.city}, {stop.country}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#FF6B35]" /> {format(new Date(stop.startDate), "MMM dd")} - {format(new Date(stop.endDate), "MMM dd, yyyy")}</span>
                    <span className="flex items-center gap-1.5"><Wallet size={14} className="text-[#FF6B35]" /> Budget: ${stop.budget}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="rounded-lg hover:bg-muted text-muted-foreground">
                  <Edit3 size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="rounded-lg hover:bg-destructive/10 text-destructive">
                  <Trash2 size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="rounded-lg hover:bg-muted">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </div>
            </div>

            {/* Activities Section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-muted/5 space-y-6">
                    {stop.activities?.length > 0 ? (
                      <div className="space-y-3">
                        {stop.activities.map((ta: any) => (
                          <div key={ta.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-muted/50 shadow-sm group hover:border-[#FF6B35]/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-orange-50 text-[#FF6B35]">
                                <ActivityIcon size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-[#1A1F3C]">{ta.activity.name}</p>
                                <p className="text-xs text-muted-foreground font-medium">{ta.time} • {ta.activity.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-black text-[#1A1F3C] text-sm">${ta.cost}</span>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8 text-destructive">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-sm text-muted-foreground font-medium italic">No activities planned for this stop.</p>
                    )}

                    {isAddingActivity ? (
                      <ActivityForm 
                        stopId={stop.id} 
                        onCancel={() => setIsAddingActivity(false)} 
                        onSuccess={() => { setIsAddingActivity(false); onUpdate(); }} 
                      />
                    ) : (
                      <Button variant="outline" onClick={() => setIsAddingActivity(true)} className="w-full border-dashed border-2 py-8 rounded-2xl font-bold text-muted-foreground hover:text-[#FF6B35] hover:border-[#FF6B35]/50 transition-all">
                        <Plus className="mr-2 h-5 w-5" /> Add Activity to {stop.city}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
