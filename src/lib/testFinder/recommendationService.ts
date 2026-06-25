import type { TestRecord, UserProfile } from "@/types/testFinder";
import { buildRecommendations } from "./scoring";

/**
 * Single swappable entry point for recommendation generation.
 * Today: deterministic scoring. Later: swap to a live LLM call (e.g. Lovable AI
 * Gateway edge function) returning the same TestRecord[] shape.
 */
export async function getRecommendations(
  tests: TestRecord[],
  profile: UserProfile,
): Promise<TestRecord[]> {
  return buildRecommendations(tests, profile);
}
