import { unstable_cache } from "next/cache";

/**
 * TRAVELOOP CACHE WRAPPERS
 */

export async function getCachedData<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  tags: string[],
  revalidate: number = 3600
): Promise<T> {
  return unstable_cache(fn, keyParts, {
    tags,
    revalidate
  })();
}

export const CACHE_TAGS = {
  trips: "trips",
  profile: "profile",
  community: "community",
  activities: "activities"
};
