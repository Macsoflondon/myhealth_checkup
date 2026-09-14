export declare const SKEW_TOLERANCE_SECONDS: number;

export interface ParityResult {
  ok: boolean;
  missingLocal: string[];
  missingRemote: string[];
  skewTolerated: { remote: string; repo: string } | null;
  malformed: string[];
  /** Applied versions deliberately excluded from schema version control. */
  excludedApplied: string[];
  /** Excluded versions that wrongly acquired a committed file — a policy breach. */
  excludedButCommitted: string[];
}

export interface CompareOptions {
  excludedVersions?: readonly string[];
}

export declare const isWellFormedVersion: (version: string) => boolean;
export declare const normaliseVersions: (versions: readonly string[]) => string[];
export declare const compareMigrationSets: (
  remoteVersions: readonly string[],
  repoVersions: readonly string[],
  options?: CompareOptions,
) => ParityResult;
export declare const formatParityReport: (result: ParityResult) => string;
export declare const parseExclusionRegistry: (contents: string) => string[];
