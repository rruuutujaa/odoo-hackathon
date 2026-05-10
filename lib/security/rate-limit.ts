import { LRUCache } from "lru-cache";

const tokenCache = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export async function rateLimit(ip: string, limit: number = 100) {
  const currentUsage = (tokenCache.get(ip) as number) || 0;
  
  if (currentUsage >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
    };
  }

  tokenCache.set(ip, currentUsage + 1);
  
  return {
    success: true,
    limit,
    remaining: limit - (currentUsage + 1),
  };
}
