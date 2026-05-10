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
  Activity as ActivityIcon,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteStop } from "@/lib/actions/stops";
import { StopForm } from "./StopForm";
import { ActivityForm } from "./ActivityForm";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white hover:shadow-xl transition-all duration-500">
      <CardContent className="p-0">
        {isEditing ? (
          <div className="p-10">
            <StopForm 
              tripId={stop.tripId} 
              stop={stop} 
              onCancel={() => setIsEditing(false)} 
              onSuccess={() => { setIsEditing(false); onUpdate(); }} 
            />
          </div>
        ) : (
          <div>
            {/* Premium Stop Header */}
            <div className={cn(
              "p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-muted/30 transition-colors",
              isExpanded ? "bg-white" : "bg-muted/5"
            )}>
              <div className="flex items-start gap-8">
                <div className="bg-[#1A1F3C] text-white w-16 h-16 rounded-[24px] flex flex-col items-center justify-center shrink-0 shadow-2xl shadow-blue-900/40 relative group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Step</span>
                  <span className="text-2xl font-black">{index + 1}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-[#1A1F3C] tracking-tight">{stop.city}</h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                    <span className="flex items-center gap-2 text-[#FF6B35]">
                      <Calendar size={18} /> {format(new Date(stop.startDate), "MMM dd")} - {format(new Date(stop.endDate), "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-[10px]">
                      <Wallet size={16} className="text-[#1A1F3C]" /> Budget: ${stop.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} className="rounded-2xl h-12 w-12 border-muted-foreground/10 hover:bg-[#1A1F3C] hover:text-white transition-all">
                  <Edit3 size={20} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDelete} className="rounded-2xl h-12 w-12 border-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all">
                  <Trash2 size={20} />
                </Button>
                <Button variant="navy" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="rounded-2xl h-12 w-12 ml-2">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </Button>
              </div>
            </div>

            {/* Activities Canvas */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-10 bg-muted/5 space-y-10">
                    <div className="flex items-center justify-between border-b border-muted/50 pb-6">
                      <h4 className="font-black text-[#1A1F3C] flex items-center gap-3 text-lg uppercase tracking-tight">
                        <div className="p-2 bg-orange-50 text-[#FF6B35] rounded-xl"><ActivityIcon size={20} /></div>
                        Mission Objectives
                      </h4>
                      <Badge variant="secondary" className="bg-white px-4 py-1.5 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest">
                        {stop.activities?.length || 0} Total
                      </Badge>
                    </div>

                    {stop.activities?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stop.activities.map((ta: any) => (
                          <div key={ta.id} className="flex items-center justify-between p-6 rounded-[24px] bg-white border border-muted/50 shadow-sm group hover:border-[#FF6B35]/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                            <div className="flex items-center gap-6">
                              <div className="p-4 rounded-2xl bg-orange-50 text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                                <ActivityIcon size={24} />
                              </div>
                              <div>
                                <p className="font-black text-xl text-[#1A1F3C] leading-none">{ta.activity.name}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B35]">{ta.time || "TBD"}</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">•</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{ta.activity.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="font-black text-2xl text-[#1A1F3C] tracking-tighter">${ta.cost}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center gap-4 bg-white/50 rounded-[32px] border-4 border-dashed border-muted/30">
                        <div className="bg-muted/50 p-4 rounded-full text-muted-foreground/30"><Plus size={32} /></div>
                        <p className="text-lg font-bold text-muted-foreground italic">Your itinerary for this city is awaiting input.</p>
                      </div>
                    )}

                    {isAddingActivity ? (
                      <div className="animate-in zoom-in-95 duration-500">
                        <ActivityForm 
                          stopId={stop.id} 
                          onCancel={() => setIsAddingActivity(false)} 
                          onSuccess={() => { setIsAddingActivity(false); onUpdate(); }} 
                        />
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => setIsAddingActivity(true)} className="w-full border-dashed border-4 py-12 rounded-[32px] font-black text-lg text-muted-foreground hover:text-[#FF6B35] hover:border-[#FF6B35]/50 hover:bg-orange-50/30 transition-all group">
                        <Plus className="mr-3 h-8 w-8 group-hover:scale-125 transition-transform" /> Add Activity to {stop.city}
                      </Button>
                    )}

                    {stop.notes && (
                      <div className="bg-[#1A1F3C] p-8 rounded-[32px] text-white shadow-2xl shadow-blue-900/30 border-l-8 border-l-[#FF6B35]">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Strategic Notes</p>
                        <p className="text-lg font-medium leading-relaxed opacity-80 italic">"{stop.notes}"</p>
                      </div>
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
