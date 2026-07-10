// Web Vitals RUM reporter. Batches samples and beacons them to the ingest edge function.
// Only runs in the browser, only in production, and only once per page.

import { supabase } from "@/integrations/supabase/client";

type MetricName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB" | "FID";
type Rating = "good" | "needs-improvement" | "poor";

interface Sample {
  metric: MetricName;
  value: number;
  rating?: Rating;
  route: string;
  device_type: "mobile" | "tablet" | "desktop" | "unknown";
  connection_type?: string;
  session_hash?: string;
  navigation_type?: string;
}

const BATCH: Sample[] = [];
let flushTimer: number | null = null;
let installed = false;

function deviceType(): Sample["device_type"] {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

function connectionType(): string | undefined {
  const nav = navigator as unknown as { connection?: { effectiveType?: string } };
  return nav.connection?.effectiveType;
}

function sessionHash(): string {
  const key = "mhc.rum.session";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const fresh = Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(key, fresh);
    return fresh;
  } catch {
    return "anon";
  }
}

async function flush(): Promise<void> {
  if (BATCH.length === 0) return;
  const samples = BATCH.splice(0, BATCH.length);
  try {
    await supabase.functions.invoke("web-vitals-ingest", { body: { samples } });
  } catch {
    // Silent — RUM must not throw into user code paths.
  }
}

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 3_000);
}

function push(sample: Sample): void {
  BATCH.push(sample);
  if (BATCH.length >= 10) {
    if (flushTimer !== null) { clearTimeout(flushTimer); flushTimer = null; }
    void flush();
  } else {
    scheduleFlush();
  }
}

export async function installWebVitals(): Promise<void> {
  if (installed) return;
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) return;
  installed = true;

  let webVitals: typeof import("web-vitals");
  try {
    webVitals = await import("web-vitals");
  } catch {
    return;
  }

  const device = deviceType();
  const connection = connectionType();
  const hash = sessionHash();
  const route = window.location.pathname;

  const report = (metric: MetricName) => (m: { name: string; value: number; rating?: Rating; navigationType?: string }) => {
    push({
      metric, value: m.value, rating: m.rating, route,
      device_type: device, connection_type: connection,
      session_hash: hash, navigation_type: m.navigationType,
    });
  };

  webVitals.onLCP(report("LCP"));
  webVitals.onCLS(report("CLS"));
  webVitals.onINP(report("INP"));
  webVitals.onFCP(report("FCP"));
  webVitals.onTTFB(report("TTFB"));

  window.addEventListener("pagehide", () => { void flush(); });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}
