# Loop protocol

How to run the loop so the report is trustworthy.

## Why the loop exists

A single-pass audit reports what the auditor happened to look at. This one is built
around a specific failure: an agent fixes a thing, reads its own diff, decides the diff
looks right, and reports success. The diff always looks right — the author wrote it.
Verification means running the check again after the change, not re-reading it.

## Pass structure

Each pass is a complete walk of the scope, not a walk of the open findings. New findings
appear in later passes precisely because earlier fixes changed the code.

**Pass 1** — inventory, audit, fix, re-verify.
**Pass 2** — full re-walk. Every fix from pass 1 is re-checked from scratch, as if
someone else wrote it. New findings are normal and expected here.
**Pass 3+** — repeat until a pass produces zero new findings.
**Exit** — two consecutive zero-finding passes. One is not enough; the first clean pass
is frequently a tired pass.

Hard cap: five passes. Hitting the cap is a reportable outcome — say what is still
unresolved and why the loop is not converging, rather than declaring victory.

## Adversarial review

Before a fix is marked verified, actively try to break it. Write down what you tried;
"reviewed and looks correct" is not an entry.

Attack list, minimum:

- **Null and empty** — null price, empty biomarker list, missing turnaround, absent
  image, provider with no rating, test with no category.
- **Boundary values** — price 0, price with no decimals, biomarker count 1, very long
  test name, name containing `—`, `™`, `|`.
- **SSR** — this is TanStack Start with a real server render. Any `window`, `document`,
  or `localStorage` touched at module scope or during render is a crash, not a warning.
- **Mobile** — mobile-first is mandatory. Check the narrow breakpoint, not just desktop.
- **The other callers** — every surface sharing the component you changed.
- **The data** — query Supabase for rows that violate your assumption. If you assumed
  every active test has a `provider_id`, go and count the ones that do not.

## Evidence standards

| Claim | Acceptable evidence |
|---|---|
| Code behaves this way | `file:line` plus the quoted line |
| Data looks like this | the SQL and its result |
| Check passes | the command and its real output |
| Page renders | Playwright smoke result, or the route's test |
| Fix works | the failing check, then the same check passing |

Anything else is `UNVERIFIED`. `UNVERIFIED` items go in the summary by name.

## Fix discipline

- Fix the shared cause, not each symptom, when several surfaces fail the same rule.
- One finding per commit where practical, message naming the finding.
- Never widen scope mid-fix. A discovered second problem becomes a new ledger row, not
  a bigger diff.
- Never touch clinical safety logic, consent/GDPR logic, security boundaries, or AI
  output constraints without an explicit instruction naming the file and reason.
- Never delete or weaken a check to make a pass go green.

## Reporting

Open with counts, not reassurance:

```
Pass 3 of scope test-cards — 84 checks, 79 pass, 0 fail, 3 unverified, 2 blocked.
Ledger: docs/qa/audit-test-cards-2026-09-06.md
```

Then the failures and the blocked items, each with what it needs. Then, briefly, what
was fixed. Never write that everything is working correctly; write which checks passed
and which were not run.
