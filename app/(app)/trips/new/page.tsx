"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTripSchema, CreateTripInput } from "@/lib/schemas/trips";
import { createTrip } from "@/lib/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlaneTakeoff, Calendar, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function NewTripPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      description: "",
      totalBudget: 0,
      status: "UPCOMING",
    },
  });

  const onSubmit = async (values: CreateTripInput) => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const trip = await createTrip(values, session.user.id);
      router.push(`/trips/${trip.id}/build`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="space-y-2 text-center pt-10 pb-6 border-b border-muted/50">
          <div className="flex justify-center mb-2 text-[#FF6B35]">
            <PlaneTakeoff size={48} strokeWidth={2.5} />
          </div>
          <CardTitle className="text-4xl font-black text-[#1A1F3C]">New Adventure</CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground">
            Where are you heading next? Let's start the planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {error && (
            <Alert variant="destructive" className="mb-8 rounded-xl bg-destructive/10 text-destructive border-none">
              <AlertDescription className="font-bold text-center py-1">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold text-[#1A1F3C]">Trip Name</Label>
              <Input
                id="title"
                placeholder="e.g. European Summer 2026"
                {...register("title")}
                className="h-14 rounded-xl bg-muted/20 border-none text-lg font-bold focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
              {errors.title && <p className="text-xs font-bold text-destructive px-1">{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                  <Calendar size={14} className="text-[#FF6B35]" /> Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.startDate && <p className="text-xs font-bold text-destructive">{errors.startDate.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                  <Calendar size={14} className="text-[#FF6B35]" /> End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.endDate && <p className="text-xs font-bold text-destructive">{errors.endDate.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBudget" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                <Wallet size={14} className="text-[#FF6B35]" /> Total Budget ($)
              </Label>
              <Input
                id="totalBudget"
                type="number"
                {...register("totalBudget")}
                className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
              {errors.totalBudget && <p className="text-xs font-bold text-destructive">{errors.totalBudget.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold text-[#1A1F3C]">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's the vibe of this trip?"
                {...register("description")}
                className="min-h-[120px] rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button asChild variant="ghost" className="rounded-xl px-8 font-bold">
                <Link href="/trips">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-14 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-lg rounded-xl transition-all shadow-xl shadow-[#FF6B35]/25 px-10"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Plan Itinerary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
