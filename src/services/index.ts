// Barrel export for services
export { CompareService } from "./CompareService";
export { providerService } from "./ProviderService";
export { CacheService, cacheService } from "./CacheService";
export { ConnectionManager } from "./ConnectionManager";
export { ConflictResolver } from "./ConflictResolver";
export { LiveProviderService } from "./LiveProviderService";
export { LiveDataService } from "./LiveDataService";
export { OfflineStorageService } from "./OfflineStorageService";
export { OfflineSyncManager } from "./OfflineSyncManager";
export { ProviderDataService } from "./ProviderDataService";
export { UserPreferencesService, userPreferencesService } from "./UserPreferencesService";
export { default as encryptionService } from "./EncryptionService";

// Re-export types
export type { CompareTestData, LiveTestData } from "./CompareService";
