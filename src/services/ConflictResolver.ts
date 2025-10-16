export type ConflictResolutionStrategy = 
  | 'server-wins' 
  | 'client-wins' 
  | 'last-write-wins' 
  | 'custom';

export class ConflictResolver<T extends { id?: string; updated_at?: string }> {
  private localCache = new Map<string, { data: T; timestamp: number }>();

  /**
   * Resolve conflicts between local and remote data
   */
  public async resolve(
    remoteData: T,
    strategy: ConflictResolutionStrategy,
    customResolver?: (local: T, remote: T) => T
  ): Promise<T> {
    const id = remoteData.id;
    
    if (!id) {
      return remoteData;
    }

    const localEntry = this.localCache.get(id);
    
    if (!localEntry) {
      // No local data, accept remote
      this.updateLocalCache(id, remoteData);
      return remoteData;
    }

    const localData = localEntry.data;

    switch (strategy) {
      case 'server-wins':
        this.updateLocalCache(id, remoteData);
        return remoteData;

      case 'client-wins':
        return localData;

      case 'last-write-wins':
        return this.lastWriteWins(localData, remoteData);

      case 'custom':
        if (!customResolver) {
          console.warn('Custom resolver not provided, falling back to server-wins');
          this.updateLocalCache(id, remoteData);
          return remoteData;
        }
        const resolved = customResolver(localData, remoteData);
        this.updateLocalCache(id, resolved);
        return resolved;

      default:
        this.updateLocalCache(id, remoteData);
        return remoteData;
    }
  }

  /**
   * Last-write-wins strategy based on updated_at timestamp
   */
  private lastWriteWins(local: T, remote: T): T {
    if (!local.updated_at || !remote.updated_at) {
      // If no timestamps, prefer remote
      this.updateLocalCache(local.id!, remote);
      return remote;
    }

    const localTime = new Date(local.updated_at).getTime();
    const remoteTime = new Date(remote.updated_at).getTime();

    if (remoteTime >= localTime) {
      this.updateLocalCache(local.id!, remote);
      return remote;
    } else {
      return local;
    }
  }

  /**
   * Update local cache with latest data
   */
  public updateLocalCache(id: string, data: T): void {
    this.localCache.set(id, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Get local cached data
   */
  public getLocal(id: string): T | null {
    const entry = this.localCache.get(id);
    return entry ? entry.data : null;
  }

  /**
   * Clear local cache
   */
  public clearCache(): void {
    this.localCache.clear();
  }

  /**
   * Remove specific item from cache
   */
  public removeFromCache(id: string): void {
    this.localCache.delete(id);
  }

  /**
   * Prune old cache entries (older than 1 hour)
   */
  public pruneCache(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, entry] of this.localCache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.localCache.delete(id);
      }
    }
  }

  /**
   * Three-way merge for complex objects
   * Useful for merging nested objects or arrays
   */
  public threeWayMerge(base: T, local: T, remote: T): T {
    // Simple implementation - can be extended for deeper merging
    const merged = { ...base };

    // Compare local changes
    for (const key in local) {
      if (local[key] !== base[key]) {
        merged[key] = local[key];
      }
    }

    // Apply remote changes that don't conflict
    for (const key in remote) {
      if (remote[key] !== base[key]) {
        // If local also changed this field, keep local
        if (local[key] === base[key]) {
          merged[key] = remote[key];
        }
      }
    }

    return merged as T;
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return {
      size: this.localCache.size,
      entries: Array.from(this.localCache.keys()),
    };
  }
}
