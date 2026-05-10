"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, ActivityInput } from "@/lib/schemas/trips";
import { addActivityToStop, searchActivities } from "@/lib/actions/activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Activity as ActivityIcon, Clock, DollarSign, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface ActivityFormProps {
  stopId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ActivityForm({ stopId, onCancel, onSuccess }: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      category: "SIGHTSEEING",
      cost: 0,
      duration: 1,
      time: "10:00 AM",
      notes: "",
    },
  });

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchActivities(val);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const selectActivity = (activity: any) => {
    setValue("name", activity.name);
    setValue("category", activity.category);
    setValue("cost", activity.cost);
    setValue("duration", activity.duration);
    setValue("description", activity.description);
    setValue("location", activity.location);
    setSearchQuery(activity.name);
    setSearchResults([]);
  };

  const onSubmit = async (values: ActivityInput) => {
    setLoading(true);
    try {
      await addActivityToStop({
        stopId,
        customActivity: values,
        date: values.date || undefined,
        time: values.time || "",
        cost: values.cost,
        notes: values.notes || ""
      });
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-2xl border-2 border-orange-100 shadow-lg">
      <div className="space-y-4">
        <h4 className="font-black text-[#1A1F3C] flex items-center gap-2">
          <ActivityIcon size={18} className="text-[#FF6B35]" /> New Planned Activity
        </h4>

        {/* Search Input */}
        <div className="relative">
          <Label className="font-bold text-xs mb-2 block uppercase tracking-wider text-muted-foreground">Search Library or Create Custom</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-none shadow-inner" 
              placeholder="Search e.g. Eiffel Tower..."
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-muted shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
              {searchResults.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => selectActivity(act)}
                  className="w-full text-left p-4 hover:bg-orange-50 transition-colors flex items-center justify-between border-b border-muted last:border-none"
                >
                  <div>
                    <p className="font-bold text-[#1A1F3C]">{act.name}</p>
                    <p className="text-xs text-muted-foreground">{act.category} • {act.location}</p>
                  </div>
                  <Plus size={16} className="text-[#FF6B35]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manual Fields (Auto-filled by search or manual entry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs">Activity Name</Label>
            <Input {...register("name")} className="rounded-lg h-10" />
            {errors.name && <p className="text-xs font-bold text-destructive">{errors.name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs">Category</Label>
            <Input {...register("category")} className="rounded-lg h-10" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs flex items-center gap-1.5"><Clock size={12} /> Time</Label>
            <Input {...register("time")} placeholder="10:00 AM" className="rounded-lg h-10" />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs flex items-center gap-1.5"><DollarSign size={12} /> Cost</Label>
            <Input type="number" {...register("cost")} className="rounded-lg h-10" />
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="font-bold text-xs">Duration (hours)</Label>
            <Input type="number" step="0.5" {...register("duration")} className="rounded-lg h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-xs">Quick Notes</Label>
          <Textarea {...register("notes")} className="rounded-lg min-h-[60px]" placeholder="Specific details for this activity..." />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-muted">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl font-bold">Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl font-bold px-8 h-11 shadow-lg shadow-[#FF6B35]/20">
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Add to Itinerary"}
        </Button>
      </div>
    </form>
  );
}
