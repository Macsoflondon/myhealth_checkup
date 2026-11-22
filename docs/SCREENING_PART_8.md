# Daily link verification, screening part 8

## Deployment

- Started after part 7 commit `d6b453b5e`.
- Deployed **scrape-and-verify v195**, confirmed by deployment ID `clvuioagsgfadynuvodj_7cdcc50f-040c-4d48-a2d4-2738d222cacf_195` in the live invocation logs.
- Submitted source SHA-256: `41b1c8e84abf618360a9134fe5198c2539f9d761c307cd2478562ddf716c7720`.
- No site publication, migrations, schema changes or cron changes. Existing stalled historical log rows were not edited.

## Changes

- Create the run record and return **HTTP 202** before checking links; retain execution with `EdgeRuntime.waitUntil` rather than holding the HTTP connection open.
- Discover active URLs ordered by `url_verified_at ASC NULLS FIRST`, then ID, before verification writes start. Each provider pool retains this order.
- Stop starting checks at **330 seconds**, checking the deadline both before reserving work and after any provider stagger. Allow already-started checks to finish with the existing HTTP timeout, retry and capped delays.
- Settle all workers/providers before finalising the run, including when another worker fails. Discovery failures also reach finalisation.
- Persist `checked`, `ok`, `broken`, `rate_limited` and `not_reached`, with final `completed` or `partial` status. Rate-limited outcomes no longer inflate `ok`; unresolved rate limits, unvisited links or persistence/discovery errors produce `partial`.
- Keep default provider concurrency **3**, initial stagger **150ms**, Lola concurrency **1** and initial stagger **1500ms**, adaptive stagger cap **4000ms**, existing HEAD/GET/retry policy, redirect classification and inconclusive-429 behaviour. Repeated 429 responses cause neither a broken-link alert nor changes to either URL verification field.
- Bound catalogue and persistence requests with the existing eight-second timeout so background finalisation has headroom after the start-work deadline.

## Tests and live evidence

- **10 Deno tests passed**: null-first/oldest ordering, exact 330-second cutoff, post-stagger cutoff, final count/status arithmetic, 202-before-check-completion, actual completed/partial log persistence, discovery error handling, redirect rules and repeated-429 preservation.
- **1,355 platform unit tests passed**; changed-file ESLint and automatic compilation passed.
- Invalid caller: **401**. The sandbox's direct service credential also differed from the function's existing exact-bearer check; canonical rebinding did not change it. Authentication was not weakened. The live successful test used the existing `call_edge_with_service_role` invocation helper used by the cron job, without altering that helper or job.
- Scheduled-path request **77191** returned **202**, `timed_out: false`, in **701ms** according to live edge logs.
- Run **815ad1e4-758f-41b3-8e5e-8225492ccf61** started **22/11/2026 07:12:35.851 UTC** and finalised **07:18:06.101 UTC**, approximately **330.25 seconds** later.

| Outcome | Count |
| --- | ---: |
| Discovered active URLs | 748 |
| Checked | 728 |
| OK | 301 |
| Broken | 0 |
| Rate-limited | 427 |
| Not reached | 20 |
| Final status | partial |

Counts reconcile: **728 = 301 + 0 + 427**; **748 = 728 + 20**. The log has a completion timestamp and no internal persistence/discovery errors. Lola reached 84 links; its remaining 20 were left untouched by the time-budget cutoff.

## Remaining limitations

Provider rate limits remain outside this fix: the live run received 427 inconclusive rate-limited outcomes. These and the 20 unvisited links retain their previous timestamps and therefore remain in the oldest-first queue for later runs. No provider tuning, retries, cron schedule or authentication rule was changed to suppress this evidence. Persistent database unavailability or forced platform termination can still prevent a final log write; ordinary budget/discovery/worker exits are covered.

The read-only advisor results matched the preceding task: seven informational RLS notes, five security-definer warnings and five existing multiple-policy performance warnings; none were changed.

Domain workflow: mhc-edge-functions.