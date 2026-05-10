"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stopSchema, StopInput } from "@/lib/schemas/trips";
import { createStop, updateStop } from "@/lib/actions/stops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Calendar, Wallet } from "lucide-react";
import { useState } from "react";

interface StopFormProps {
  tripId: string;
  stop?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export function StopForm({ tripId, stop, onCancel, onSuccess }: StopFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      tripId: tripId,
      city: stop?.city || "",
      country: stop?.country || "",
      startDate: stop?.startDate ? new Date(stop.startDate).toISOString().split('T')[0] : undefined,
      endDate: stop?.endDate ? new Date(stop.endDate).toISOString().split('T')[0] : undefined,
      budget: stop?.budget || 0,
      notes: stop?.notes || "",
      position: stop?.position || 0,
    },
  });

  const onSubmit = async (values: StopInput) => {
    setLoading(true);
    try {
      if (stop) {
        await updateStop(stop.id, { ...values, tripId });
      } else {
        await createStop({ ...values, tripId });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-[#1A1F3C]/5 rounded-2xl border border-[#1A1F3C]/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-bold flex items-center gap-1.5">
            <MapPin size={14} className="text-[#FF6B35]" /> City
          </Label>
          <Input {...register("city")} className="rounded-xl border-none shadow-sm" placeholder="e.g. Paris" />
          {errors.city && <p className="text-xs font-bold text-destructive">{errors.city.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-bold flex items-center gap-1.5 text-muted-foreground">Country</Label>
          <Input {...register("country")} className="rounded-xl border-none shadow-sm" placeholder="e.g. France" />
          {errors.country && <p className="text-xs font-bold text-destructive">{errors.country.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-bold flex items-center gap-1.5">
            <Calendar size={14} className="text-[#FF6B35]" /> Start Date
          </Label>
          <Input type="date" {...register("startDate")} className="rounded-xl border-none shadow-sm" />
        </div>
        <div className="space-y-2">
          <Label className="font-bold flex items-center gap-1.5">
            <Calendar size={14} className="text-[#FF6B35]" /> End Date
          </Label>
          <Input type="date" {...register("endDate")} className="rounded-xl border-none shadow-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold flex items-center gap-1.5">
          <Wallet size={14} className="text-[#FF6B35]" /> Stop Budget ($)
        </Label>
        <Input type="number" {...register("budget")} className="rounded-xl border-none shadow-sm" />
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Notes</Label>
        <Textarea {...register("notes")} className="rounded-xl border-none shadow-sm min-h-[80px]" placeholder="Specific notes for this stop..." />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl font-bold">Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-[#1A1F3C] hover:bg-black text-white rounded-xl font-bold px-8 h-11">
          {loading ? <Loader2 className="animate-spin mr-2" /> : stop ? "Update Stop" : "Save Stop"}
        </Button>
      </div>
    </form>
  );
}
