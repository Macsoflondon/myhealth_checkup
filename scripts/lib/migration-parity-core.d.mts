export declare const SKEW_TOLERANCE_SECONDS: number;

export interface ParityResult {
  ok: boolean;
  missingLocal: string[];
  missingRemote: string[];
  skewTolerated: { remote: string; repo: string } | null;
  malformed: string[];
}

export declare const isWellFormedVersion: (version: string) => boolean;
export declare const normaliseVersions: (versions: readonly string[]) => string[];
export declare const compareMigrationSets: (
  remoteVersions: readonly string[],
  repoVersions: readonly string[],
) => ParityResult;
export declare const formatParityReport: (result: ParityResult) => string;
