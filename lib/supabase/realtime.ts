import { createClient } from "./client";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = createClient();
let channels: RealtimeChannel[] = [];

export function subscribeToTrip(tripId: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`trip-${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trips", filter: `id=eq.${tripId}` },
      callback
    )
    .subscribe();
    
  channels.push(channel);
  return channel;
}

export function subscribeToCommunity(callback: (payload: any) => void) {
  const channel = supabase
    .channel("community-updates")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "community_posts" },
      callback
    )
    .subscribe();

  channels.push(channel);
  return channel;
}

export function subscribeToChecklist(tripId: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`checklist-${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "packing_items", filter: `trip_id=eq.${tripId}` },
      callback
    )
    .subscribe();

  channels.push(channel);
  return channel;
}

export function unsubscribeAll() {
  channels.forEach((channel) => channel.unsubscribe());
  channels = [];
}
