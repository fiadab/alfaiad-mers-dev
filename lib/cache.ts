// lib/cache.ts
import { LRUCache } from "lru-cache";

// تكوين الذاكرة المؤقتة مع تحديد الأنواع
type CacheKey = string;
type CacheValue = any;

const cache = new LRUCache<CacheKey, CacheValue>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 دقائق
  allowStale: false,
});

export const getCachedJobs = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key);
  if (cached) return cached as T;
  
  const result = await fn();
  cache.set(key, result);
  return result;
};