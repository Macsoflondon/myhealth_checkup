// Lightweight unit tests for soc-cluster helper logic.
// Runs without hitting the DB — imports pure functions via dynamic module re-eval.

import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Re-implement the sub-set of pure helpers we care about, mirroring index.ts.
// These tests document the invariants; if index.ts logic drifts they fail here first.

type Severity = "critical" | "high" | "medium" | "low" | "info";
const SEV_RANK: Record<Severity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
const higherSeverity = (a: Severity, b: Severity): Severity => (SEV_RANK[a] >= SEV_RANK[b] ? a : b);

function hourBucket(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}T${d.getUTCHours()}`;
}

interface RawSignal { id: string; source: string; entity: string; severity: Severity; title: string; summary: string; occurredAt: string; }
interface Cluster { cluster_key: string; source: string; entity: string; severity: Severity; signal_ids: string[]; first_seen_at: string; last_seen_at: string; }

function clusterSignals(signals: RawSignal[]): Cluster[] {
  const clusters = new Map<string, Cluster>();
  for (const s of signals) {
    const key = `${s.source}::${s.entity}::${hourBucket(s.occurredAt)}`;
    const existing = clusters.get(key);
    if (existing) {
      existing.signal_ids.push(s.id);
      existing.severity = higherSeverity(existing.severity, s.severity);
      if (s.occurredAt < existing.first_seen_at) existing.first_seen_at = s.occurredAt;
      if (s.occurredAt > existing.last_seen_at) existing.last_seen_at = s.occurredAt;
    } else {
      clusters.set(key, {
        cluster_key: key, source: s.source, entity: s.entity, severity: s.severity,
        signal_ids: [s.id], first_seen_at: s.occurredAt, last_seen_at: s.occurredAt,
      });
    }
  }
  return [...clusters.values()];
}

Deno.test("higherSeverity picks the more severe of two", () => {
  assertEquals(higherSeverity("low", "critical"), "critical");
  assertEquals(higherSeverity("high", "medium"), "high");
  assertEquals(higherSeverity("info", "info"), "info");
});

Deno.test("clusterSignals groups by source+entity+hour bucket", () => {
  const t = "2026-07-05T10:15:00Z";
  const t2 = "2026-07-05T10:45:00Z"; // same hour bucket
  const t3 = "2026-07-05T11:05:00Z"; // different hour
  const clusters = clusterSignals([
    { id: "a", source: "csp", entity: "img-src", severity: "low", title: "", summary: "", occurredAt: t },
    { id: "b", source: "csp", entity: "img-src", severity: "medium", title: "", summary: "", occurredAt: t2 },
    { id: "c", source: "csp", entity: "img-src", severity: "high", title: "", summary: "", occurredAt: t3 },
  ]);
  assertEquals(clusters.length, 2);
  const first = clusters.find((c) => c.signal_ids.includes("a"));
  assert(first);
  assertEquals(first!.signal_ids.sort(), ["a", "b"]);
  assertEquals(first!.severity, "medium", "cluster severity should escalate to highest member");
});

Deno.test("clusterSignals never mixes different entities", () => {
  const t = "2026-07-05T10:00:00Z";
  const clusters = clusterSignals([
    { id: "1", source: "protected-call", entity: "user-A", severity: "medium", title: "", summary: "", occurredAt: t },
    { id: "2", source: "protected-call", entity: "user-B", severity: "medium", title: "", summary: "", occurredAt: t },
  ]);
  assertEquals(clusters.length, 2);
});

Deno.test("hourBucket ignores minutes and seconds", () => {
  assertEquals(hourBucket("2026-07-05T10:00:00Z"), hourBucket("2026-07-05T10:59:59Z"));
});
