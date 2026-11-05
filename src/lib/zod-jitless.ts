/**
 * Must be the first import of every entry module (start.ts, router.tsx).
 *
 * The Content-Security-Policy forbids eval. zod v4 probes `new Function("")`
 * when the first object schema is constructed, which browsers report as a CSP
 * violation even though zod falls back safely. z.config() mutates zod's
 * shared global config in place, so the setting holds whichever module
 * loaded zod first.
 */
import { z } from "zod";

z.config({ jitless: true });

export {};
