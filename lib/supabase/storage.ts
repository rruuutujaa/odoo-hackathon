import { createClient } from "./client";

const supabase = createClient();

export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return filePath;
}

export async function uploadTripCover(file: File, tripId: string) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${tripId}/cover.${fileExt}`;

  const { error } = await supabase.storage
    .from("trip-covers")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return filePath;
}

export async function uploadCommunityImage(file: File, postId: string) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${postId}/image.${fileExt}`;

  const { error } = await supabase.storage
    .from("community")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return filePath;
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
