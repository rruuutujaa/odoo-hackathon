import { createClient } from "./server";

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId);

  if (error) throw error;
}

export async function getTrips(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*, trip_stops(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTripById(tripId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*, trip_stops(*), budgets(*), expenses(*), packing_items(*), notes(*)")
    .eq("id", tripId)
    .single();

  if (error) throw error;
  return data;
}

export async function createTrip(data: any) {
  const supabase = await createClient();
  const { data: trip, error } = await supabase
    .from("trips")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return trip;
}

export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw error;
}

export async function searchActivities(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .ilike("name", `%${query}%`);

  if (error) throw error;
  return data;
}
