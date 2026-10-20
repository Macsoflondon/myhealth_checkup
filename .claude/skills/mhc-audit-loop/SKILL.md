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

## Fix what you find, in the same pass — standing instruction, 2026-10-20

The user has explicitly told this skill, more than once, not to split a task from what
it turns up along the way: *"if you come across something... fix it also at the same
time, don't leave it till the last and report... if you find something while doing a
task, fix it simultaneously, do the whole thing together... then bring it all back to
me and say it's all completed and I've also found these issues and I've completed those
as well."* This overrides the instinct to flag-and-defer. Default to fixing, in the same
pass, not to reporting-and-waiting.

In practice, for this skill:

- A finding with a safe, honest default — missing data shown as missing (`null`, "Not
  stated", an absent section), a mislabelled control relabelled correctly, a drift-guard
  gap closed — gets fixed the moment it's found, not written up as "blocked" and left for
  later. This is most findings. Two real examples from this audit that were *correctly*
  fixed immediately, no deferral: the `DreamHealthShowcase` filmstrip's unlabelled
  external link, and `categoryTestMapper.ts`'s false "Home Kit" default.
- What earlier passes called "blocked, needs a human decision" — the Medichecks
  accreditation fallback, the Randox turnaround fallback — turned out, once asked, not to
  need a judgement call about *what the real data is*; they needed a decision about
  *whether to stop guessing*, and the safe, honest default (show missing as missing) was
  always available the whole time. Don't wait to be asked for that kind of fix again:
  apply the honest default and fix it in the same pass it's found in, the same way the
  always-fixed findings above were handled. Still say what was found and what the fix
  was — the ledger and the report don't get shorter, only the gap between finding and
  fixing does.
- Genuinely blocked still exists, but it's narrower than it was: something that needs
  information this session cannot get at all (a live external site this sandbox can't
  reach, a fact only a specific person knows and hasn't said), or a change serious enough
  that even a safe default would be a real design/business decision someone else should
  see before it ships (not just "I don't know if a label is accurate" — that's the
  common case above, and it isn't this). When something really is blocked, name it
  plainly and say exactly what would unblock it — don't let "blocked" become a way to
  avoid a fix that was actually available.
- One task, one report. When a task turns up unrelated issues, fix those too, in the
  same session, before reporting — then report all of it together as done: the thing
  asked for, plus what else got fixed along the way. Don't close out the asked-for part
  and separately list the rest as "optional, not done, not part of this task."

## Loop

```
INVENTORY → AUDIT → FIX → RE-VERIFY → ADVERSARIAL REVIEW → REGRESSION → (repeat)
```

Exit only when a full pass produces zero new findings **twice in a row**, or when remaining items are genuinely blocked in the narrow sense above — not "uncertain," which has a fix. Blocked items are named, with what unblocks them. A first clean pass is not an exit — it is the reason to run one more.

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
| ------- | ------------- | ------- | -------- | --- |

The ledger is the report. The chat summary points at it and names the counts — it never replaces it.

## Reporting rules

- Never open with a claim that everything works. State counts: checks run, passed, failed, fixed, unverified, blocked.
- If a check could not be run, say which and why, in the summary, not only in the ledger.
- Do not describe a fix as verified in production. This repo deploys to Cloudflare Pages and production has been observed serving stale content; verified means verified in the codebase and the checks above.
- If the loop hits its second clean pass, say so plainly and stop. Do not keep polishing.
- One report, not a staged one: if fixing the asked-for thing turned up other issues and
  they got fixed too (per "Fix what you find" above), report all of it together as
  done — the task, plus what else was found and fixed — rather than closing the task and
  separately listing the rest as outstanding.

## Drift guard — the part that actually stops the regressions

An audit fixes today. It does not stop an upstream agent editing this repo from breaking the same thing next week. So: **every contract rule that can be machine-checked must end the session as a committed check**, not as prose in the ledger.

- Rendering and data-shape rules → a Vitest file next to the component.
- Cross-surface rules (every card links internally, no card renders a raw provider URL as its primary action) → a script under `scripts/` following the existing `audit-*.mjs` convention, wired into the `prebuild` chain in `package.json` so it fails the build.

A finding that recurs after a previous audit fixed it is not a fix that was undone; it is a missing drift guard. Treat it as a bug in this skill's last run and add the check.
