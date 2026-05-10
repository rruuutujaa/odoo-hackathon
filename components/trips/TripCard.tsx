import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    cover_image?: string;
    start_date: string;
    end_date: string;
    status: "ongoing" | "upcoming" | "completed";
    trip_stops?: { count: number }[];
  };
}

const statusColors = {
  ongoing: "bg-green-500/10 text-green-500 border-green-500/20",
  upcoming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function TripCard({ trip }: TripCardProps) {
  const destinationCount = trip.trip_stops?.[0]?.count || 0;

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="group overflow-hidden rounded-[12px] border bg-card transition-all hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden">
          {trip.cover_image ? (
            <img
              src={trip.cover_image}
              alt={trip.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
          <Badge className={cn("absolute right-3 top-3 border", statusColors[trip.status])}>
            {trip.status}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-lg font-bold text-[#1A1F3C]">{trip.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
            <span>{destinationCount} Destinations</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
