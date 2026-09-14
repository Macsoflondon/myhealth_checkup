---
name: mhc-audit-loop
description: "Self-verifying audit-and-fix loop for myhealth checkup. Trigger when the user asks for a full audit of test cards, an audit of every card/listing surface, a platform-wide code audit, or says cards are missing information, showing wrong information, linking to the wrong place, or that changes keep regressing (e.g. after Lovable edits). Also trigger on [AUDIT-LOOP] <scope>. Unlike a one-pass review, this skill audits against a written contract, fixes, re-verifies its own fixes adversarially, and repeats until two consecutive clean passes — and refuses to report success without an evidence ledger."
---

# myhealth checkup — Audit Loop

An audit that checks its own work before reporting. Use for two scopes:

- `[AUDIT-LOOP] test-cards` — every surface that renders a test card or test listing
- `[AUDIT-LOOP] platform` — full codebase audit; domains and order in `references/platform-scope.md`

Ambiguous scope → ask which, and do nothing until answered.

This skill composes with `mhc-skill-os`: its pipeline stages and refusal rules still apply, and every fix this loop makes is a `PATCH` under those rules. This skill adds the part `mhc-skill-os` lacks — the closed loop and the ban on unverified success reports.

## The three rules that make this different

1. **A written contract decides pass/fail, not judgement.** Read `references/card-contract.md` before auditing cards, `references/platform-scope.md` before auditing the platform. If the contract does not cover something, do not silently invent a standard — add the rule to the contract file first, in the same session, so the next run applies it too.
2. **Every finding and every pass carries evidence.** `file:line`, a query result, a command's output. Nothing passes because it looked right.
3. **You do not get to say it is fixed until you have tried to break it.** See `references/loop-protocol.md`.

## Loop

```
INVENTORY → AUDIT → FIX → RE-VERIFY → ADVERSARIAL REVIEW → REGRESSION → (repeat)
```

Exit only when a full pass produces zero new findings **twice in a row**, or when remaining items are genuinely blocked. Blocked items are named, with what unblocks them. A first clean pass is not an exit — it is the reason to run one more.

**INVENTORY** — rebuild the surface list from the code every run. Never reuse a list from memory or from a previous session's notes; that is exactly how surfaces get missed after an upstream edit. Method in `references/card-contract.md`.

**AUDIT** — walk every surface against every contract line. Record each check in the ledger as PASS / FAIL / UNVERIFIED. `UNVERIFIED` is a real, reportable outcome; it never rounds up to PASS.

**FIX** — smallest change that satisfies the contract. Fix the shared component or adapter rather than patching each caller, when the defect is shared. No refactors outside the finding.

**RE-VERIFY** — re-read the changed code and re-run the checks that failed. Reading your own diff is not verification; run the check again.

**ADVERSARIAL REVIEW** — before claiming a fix works, spend real effort trying to defeat it: null/empty data, a provider with no rating, a test with no biomarkers, price 0 or null, a name with an em dash, mobile width, SSR (this is TanStack Start — a `window` reference at module or render scope breaks the server render). Log what you tried.

**REGRESSION** — every other surface that shares the changed component gets re-checked, plus the commands in the Verification section.

## Verification commands

Run these, and paste real output into the ledger. A command not run is `UNVERIFIED`.

```
npm run lint
npm test -- --run
npm run build          # runs prebuild: secrets, RLS grants, sitemap, SEO regression
npm run test:smoke     # Playwright render smoke
```

Data claims about tests, prices, biomarkers or providers get checked against Supabase (project `clvuioagsgfadynuvodj`) with `mcp__Supabase__execute_sql`, not assumed from the type definitions.

## The ledger

Write to `docs/qa/audit-<scope>-<YYYY-MM-DD>.md`, commit it, and keep appending across the loop's passes. One row per check:

| surface | contract rule | verdict | evidence | fix |
|---|---|---|---|---|

The ledger is the report. The chat summary points at it and names the counts — it never replaces it.

## Reporting rules

- Never open with a claim that everything works. State counts: checks run, passed, failed, fixed, unverified, blocked.
- If a check could not be run, say which and why, in the summary, not only in the ledger.
- Do not describe a fix as verified in production. This repo deploys to Cloudflare Pages and production has been observed serving stale content; verified means verified in the codebase and the checks above.
- If the loop hits its second clean pass, say so plainly and stop. Do not keep polishing.

## Drift guard — the part that actually stops the regressions

An audit fixes today. It does not stop an upstream agent editing this repo from breaking the same thing next week. So: **every contract rule that can be machine-checked must end the session as a committed check**, not as prose in the ledger.

- Rendering and data-shape rules → a Vitest file next to the component.
- Cross-surface rules (every card links internally, no card renders a raw provider URL as its primary action) → a script under `scripts/` following the existing `audit-*.mjs` convention, wired into the `prebuild` chain in `package.json` so it fails the build.

A finding that recurs after a previous audit fixed it is not a fix that was undone; it is a missing drift guard. Treat it as a bug in this skill's last run and add the check.
