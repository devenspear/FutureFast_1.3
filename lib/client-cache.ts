/**
 * Client-side caching utility for FutureFast website
 * Reduces API calls and improves performance by caching data in localStorage
 */

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class ClientCache {
  /**
   * Get cached data if it's still valid
   * @param key Cache key
   * @param maxAge Maximum age in milliseconds
   * @returns Cached data or null if expired/not found
   */
  static get<T>(key: string, maxAge: number): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < maxAge) {
        console.log(`Using cached data for: ${key}`);
        return data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.error(`Error reading cache for ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  /**
   * Save data to cache
   * @param key Cache key
   * @param data Data to cache
   */
  static set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
      console.log(`Data cached for: ${key}`);
    } catch (error) {
      console.error(`Error caching data for ${key}:`, error);
    }
  }

  /**
   * Clear specific cache entry
   * @param key Cache key to clear
   */
  static clear(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  /**
   * Clear all FutureFast cache entries
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    const futureFastKeys = keys.filter(key => 
      key.includes('youtube_') || 
      key.includes('news_') || 
      key.includes('hero_')
    );
    
    futureFastKeys.forEach(key => localStorage.removeItem(key));
    console.log('All FutureFast cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getStats(): { totalKeys: number; futureFastKeys: string[]; totalSize: number } {
    if (typeof window === 'undefined') return { totalKeys: 0, futureFastKeys: [], totalSize: 0 };
    
    const keys = Object.keys(localStorage);
    const futureFastKeys = keys.filter(key => 
      key.includes('youtube_') || 
      key.includes('news_') || 
      key.includes('hero_')
    );
    
    let totalSize = 0;
    futureFastKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) totalSize += value.length;
    });
    
    return {
      totalKeys: keys.length,
      futureFastKeys,
      totalSize
    };
  }
}

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  YOUTUBE_VIDEOS: 30 * 60 * 1000,    // 30 minutes
  NEWS_ITEMS: 15 * 60 * 1000,        // 15 minutes  
  HERO_CONTENT: 60 * 60 * 1000,      // 1 hour
  RESOURCES: 60 * 60 * 1000,         // 1 hour
} as const;

// Cache keys
export const CACHE_KEYS = {
  YOUTUBE_VIDEOS: 'youtube_videos_cache',
  NEWS_ITEMS: 'news_items_cache',
  HERO_CONTENT: 'hero_content_cache',
  RESOURCES: 'resources_cache',
} as const; 