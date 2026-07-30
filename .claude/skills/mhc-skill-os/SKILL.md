---
name: mhc-skill-os
description: "Deterministic command-driven execution framework for myhealth checkup. Trigger when the user issues a bracketed skill command (PATCH, AUDIT, VERIFY, REGRESSION, SECURE, OPTIMISE, POLISH, DEBUG, FREEZE, UNFREEZE, REVERT, COMPLETE, CHECKPOINT, RESUME) or asks to operate the platform under the Skill Operating System. Overrides freeform behaviour: every action must map to one of the 14 skills below."
---

# myhealth checkup — Skill Operating System v1.0

Deterministic execution model. No implicit actions. Every change traceable, reversible, verifiable, isolated. If a request is ambiguous, request clarification or default to VERIFY (no modification).

## Invocation

User issues commands as `[SKILL] target/scope + notes`, e.g. `[PATCH] src/pages/ClientPortal.tsx — fix DOB render`. If they describe intent without a skill, propose the mapping and wait for confirmation before executing.

## Execution pipeline (mandatory, no skipping)

`INIT → ANALYSE → DESIGN → IMPLEMENT → VERIFY → REGRESSION_CHECK → COMPLETE`

Announce the current stage at each transition. On failure at any stage → stop → enter DEBUG → isolate root cause → PATCH only after diagnosis, or REVERT to last CHECKPOINT.

Conflict priority: **Security → Compliance → Stability → Product intent.**

## Skill registry (hard limit — 14, no additions)

| Skill | Purpose | Hard rules |
|---|---|---|
| **PATCH** | Modify existing code | Touch only affected files. Preserve unrelated logic. No refactors outside scope. Must run VERIFY after. |
| **AUDIT** | Full system inspection | Read-only. Identify bugs, risks, regressions, perf, a11y. No writes. |
| **VERIFY** | Validate implementation | Test functionality, security, UI, API. No code changes. |
| **REGRESSION** | Confirm prior functionality intact | Re-test all confirmed features. Block COMPLETE if any regression. |
| **SECURE** | Security hardening | OWASP ASVS, NCSC, Cyber Essentials Plus. No functional change unless security-critical. |
| **OPTIMISE** | Performance | Behaviour must not change. Perf only. |
| **POLISH** | UI/UX refinement | Visual, spacing, animation, UX consistency only. No logic. |
| **DEBUG** | Diagnose | Identify + root-cause only. No fixes. |
| **FREEZE** | Lock stable component | Immutable until UNFREEZE. Record in `.mhc-freeze.json`. |
| **UNFREEZE** | Unlock frozen component | Must state reason. |
| **REVERT** | Roll back to last CHECKPOINT | Restore exact prior state. |
| **CHECKPOINT** | Save state | Immutable reference for recovery. Record in `.mhc-checkpoints.json`. |
| **RESUME** | Continue from CHECKPOINT | Restore full context before continuing. |
| **COMPLETE** | Close task | Only after all pipeline stages + all verifications pass. |

## Change isolation

No multi-domain changes in one PATCH. If scope crosses domains → require explicit AUDIT approval first.

## No-interpretation domains (never modify without explicit instruction)

- Clinical safety logic
- Consent & GDPR logic
- NHS integration workflows
- Security architecture boundaries
- AI output constraints

Touching these requires an explicit `[PATCH]` or `[SECURE]` command naming the specific file and reason. If a user request would implicitly touch them, stop and confirm.

## Verification requirements (all five must pass before COMPLETE)

1. Functional
2. Security
3. Performance
4. Regression
5. Data integrity

## Freeze bookkeeping

Track frozen paths in `.mhc-freeze.json` at repo root:
```json
{ "frozen": [{ "path": "src/…", "at": "ISO-8601", "reason": "…" }] }
```
Before any PATCH, check this file. If target is frozen → refuse and require UNFREEZE.

## Checkpoint bookkeeping

Track in `.mhc-checkpoints.json`:
```json
{ "checkpoints": [{ "id": "cp-YYYYMMDD-HHMM", "at": "ISO-8601", "note": "…", "files": ["…"] }] }
```
RESUME must reload the checkpoint entry and restate the context before acting.

## Response shape

Every skill invocation reply must open with:
```
[SKILL] · stage: <PIPELINE_STAGE>
scope: <files/paths>
```
Then the work. Close with the next required stage or COMPLETE.

## Refusal rules

- Ambiguous command → ask for clarification, do nothing.
- Command outside registry → refuse, list the 14 valid skills.
- Scope creep detected mid-execution → stop, report, request AUDIT.
- Frozen target → refuse, cite freeze entry.

This skill overrides freeform behaviour for the myhealth checkup project only.
