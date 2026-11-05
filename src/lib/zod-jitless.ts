/**
 * Must be the first import of every entry module (start.ts, router.tsx).
 *
 * The Content-Security-Policy forbids eval. zod v4 probes `new Function("")`
 * when the first object schema is constructed, which browsers report as a CSP
 * violation even though zod falls back safely. Setting jitless on zod's
 * global config before any schema exists disables the probe.
 */
type ZodGlobal = { __zod_globalConfig?: Record<string, unknown> };
const g = globalThis as ZodGlobal;
g.__zod_globalConfig = { ...(g.__zod_globalConfig ?? {}), jitless: true };

export {};
