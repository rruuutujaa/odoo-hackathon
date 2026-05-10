"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { uploadTripCover, getPublicUrl } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";

const tripSchema = z.object({
  title: z.string().min(2, "Trip title is required"),
  destination: z.string().min(2, "Main destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

type TripInput = z.infer<typeof tripSchema>;

export default function NewTripPage() {
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripInput>({
    resolver: zodResolver(tripSchema),
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: TripInput) => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Create Trip (initial)
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        title: data.title,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        status: 'upcoming',
      })
      .select()
      .single();

    if (tripError) {
      console.error(tripError);
      setLoading(false);
      return;
    }

    let coverUrl = null;

    // 2. Upload Cover if exists
    if (coverFile) {
      try {
        const path = await uploadTripCover(coverFile, trip.id);
        coverUrl = getPublicUrl("trip-covers", path);
        
        // Update trip with cover url
        await supabase
          .from("trips")
          .update({ cover_image: coverUrl })
          .eq("id", trip.id);
      } catch (uploadError) {
        console.error("Cover upload failed", uploadError);
      }
    }

    router.push(`/trips/${trip.id}/build`);
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="border-none shadow-lg rounded-[20px]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1A1F3C]">Create New Trip</CardTitle>
          <CardDescription>Fill in the details to start your adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Upload */}
            <div className="space-y-2">
              <Label>Trip Cover Image</Label>
              <div 
                className={`relative aspect-[21/9] w-full border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center overflow-hidden transition-colors ${coverPreview ? 'border-transparent' : 'hover:bg-muted/50'}`}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer p-8 w-full h-full">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Click to upload cover photo</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Trip Name</Label>
              <Input id="title" placeholder="e.g. European Summer 2026" {...register("title")} className={errors.title ? "border-destructive" : ""} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Main Destination</Label>
              <Input id="destination" placeholder="e.g. Paris, France" {...register("destination")} className={errors.destination ? "border-destructive" : ""} />
              {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} className={errors.startDate ? "border-destructive" : ""} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} className={errors.endDate ? "border-destructive" : ""} />
                {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" placeholder="What are your goals for this trip?" {...register("description")} rows={4} />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button asChild variant="ghost" className="rounded-[12px] px-6">
                <Link href="/trips">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-[12px] px-8 h-11">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
