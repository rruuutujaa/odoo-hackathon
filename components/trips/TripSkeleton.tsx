import { Skeleton } from "@/components/ui/skeleton";

export function TripSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2">
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}
