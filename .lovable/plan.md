# Part 18: critical finding lov_finding_480de5730a85d750

## Finding (from the scan, word for word)
- Title: "Anyone can get AI recommendations"
- Severity: error (Critical). Scanner: agent_security_v2. Rule: LOV.EP.OUTBOUND_ACTION_ABUSE_PROTECTION.V1, "Outbound effects stay within what the requester may do"
- Subject: function `ai-human-context` (`supabase/functions/ai-human-context/index.ts`). No table or policy is involved.
- Evidence: "Anyone can POST to this function; it only obtains an optional user identity and continues with anonymous requests, then returns recommendation results." Operation: `generateText` with `openai("gpt-4o-mini")` (lines 782–787). Impact: `jsonResponse(result)` (line 868). Entry: line 637.
- First raised: 2026-09-30T20:27:52Z. Verification flag: confirmed. Authored access mode: public.

## Verdict at 5c7b536: real, and intentional
- `supabase/config.toml:14-15` sets `verify_jwt = false`.
- `index.ts:462-475` `getOptionalUserId` returns null when there is no token and the request carries on.
- `index.ts:662-664` comment: "Anonymous visitors receive AI matching too (owner decision 27/11/2026)".
- AGENTS.md:86 says: "AI test finder serves guests AI results; per-IP caps bound cost."
- Spending is capped, but the endpoint is still reachable without sign-in:
  - per IP: 8 a minute and 30 a day (`rate-limit.ts:4-5`)
  - shared ceiling: 1,000 paid calls in any rolling 24 hours (`rate-limit.ts:10`), which fails closed to keyword scoring (`index.ts:574-623`, 753-767)
- What the caps don't cover: the per-IP key comes from `clientIpFrom`, so someone rotating addresses can still use up the 1,000-call ceiling. Real visitors then get keyword scoring for the rest of the day. The most this costs is about 1,000 gpt-4o-mini calls a day.
- This is not a false positive, and it has not been fixed. The scanner rates any unauthenticated paid model call as Critical, and caps don't change that rating.

## Options (the owner decides)
1. Root-cause fix: require a verified sign-in before the paid call.
   - In `index.ts` after line 663: when `userId` is null, return the keyword-scoring `fallback` straight away (no 401, so guests still get results).
   - Key the minute and daily caps by `user:<id>` instead of IP.
   - Keep the 1,000-call ceiling.
   - Update the AGENTS.md:86 rule and the finder copy. Add a Deno test that anonymous requests never reach `generateText`.
   - Deploy `ai-human-context`, then mark the finding fixed.
   - Trade-off: this reverses the 27/11 owner decision. Guests lose AI wording but keep matched tests.
2. Accept the risk: keep guest AI access as it is. A Critical finding can only be ignored with the owner's approval through the ignore-finding request. I won't ignore it on my own, and publishing stays blocked until it is ignored or fixed.
3. A middle option: require a human check (for example a Turnstile token checked on the server) before the paid call for guests. This probably won't satisfy the scanner without sign-in, so treat it as defence in depth only.
