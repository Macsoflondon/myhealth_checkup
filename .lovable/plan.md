# Launch Readiness Status — myhealth checkup

## 1. Where we are right now

The platform is structurally complete and stable. Compared with the **5–10 day plan agreed on 15 Feb** and the **launch-readiness audit on 29 May**, the heavy structural work is done. What's left is a short list of polish items plus the publish step itself.

| Area | Status |
|---|---|
| Backend / DB security (RLS, encryption, audit logs) | Ready |
| Auth, MFA, idle timeout, admin role gating | Ready |
| Edge functions (40+ deployed, secrets set) | Ready |
| Legal pages (Privacy, Terms, Cookies, Affiliate, Complaints, Accessibility, Modern Slavery, Fair Trading) | Ready |
| Security headers baseline (CE+ v3.3) | Ready |
| robots.txt, sitemap.xml (100+ URLs), home page structured data | Ready |
| Brand/SEO migration to myhealthcheckup.co.uk (canonical, OG, Twitter handles) | Ready |
| Hero, sticky category bar, partner wheel, ticker, browse-by-category sticky behaviour | Ready (recent work) |
| Provider catalogues (9 active providers) | Ready |
| Custom domain configured (`myhealthcheckup.co.uk`) | Ready |
| **Published to live URL** | Not yet (`is_published: false`) |
| Test mapping coverage (Medichecks / Thriva / LML) | Needs check — was the biggest Feb blocker |
| On-page SEO polish (H1s, schema, meta lengths) | Partially done since May audit — needs re-verify |
| E2E test coverage | Thin (2 specs: `category-bar`, sticky-bar audit) |

## 2. Progress vs the 15 Feb plan

| Plan item | Status |
|---|---|
| Delete orphaned `StatsHighlight.tsx` | Done |
| Migrate canonical/OG/Twitter to myhealthcheckup.co.uk | Done (no residual `myhealthhub` references) |
| Map Medichecks / Thriva / LML provider tests | **Needs verification** — run `supabase--read_query` to confirm current coverage |
| Bulk import clinics to 100+ | **Needs verification** |
| Reorganise 26 loose components into domain folders | Deferred (non-blocker) |
| Generate branded OG image | **Needs verification** that `/og-image.png` exists at canonical URL |

## 3. Progress vs the 29 May audit (Amber list)

| Item | Likely status |
|---|---|
| 1. Stable H1 on homepage | Needs re-check after recent hero rewrites |
| 2. H1 on category pages | Needs re-check |
| 3. `aria-label` on hero search input | Needs re-check |
| 4. Descriptive "Learn more" buttons in `RecommendationEngine` | Needs re-check |
| 5. Truncate `ProviderTestDetailTemplate` title/desc to ≤60/≤160 | Needs re-check |
| 6. Product JSON-LD on provider test detail pages | Needs re-check |
| 7. FAQPage JSON-LD on `/faqs` | Needs re-check |
| 8. Publish | Outstanding |
| 9. E2E coverage (smoke + affiliate handoff) | Outstanding |
| 10. `MedicalReviewPage` HCPC deep link (PA43353) | Needs re-check |
| 11. Encryption key rotation cleanup (remove legacy `VITE_ENCRYPTION_KEY`) | Needs re-check |

## 4. Quick-win launch sprint (target: 2–3 working days)

Day 1 — Verify and patch on-page SEO/accessibility:
- Re-run SEO scanner (`seo_chat--trigger_scan`) and `security--run_security_scan`.
- Confirm/repair items 1–7 from the May Amber list. All are small, isolated edits in existing components.
- Re-check `OG image` URL resolves; regenerate if 404.

Day 2 — Data + ops:
- Query `provider_tests` mapping coverage for Medichecks, Thriva, LML. If still 0%, run the AI Test Mapper from `/admin/test-mapper` in live mode.
- Bulk import remaining clinic rows if count is still <100.
- Add one smoke E2E spec: home → category → provider test detail → outbound affiliate click. (Extends existing Playwright setup; ~1 file.)
- Apply Medical Review HCPC deep link patch.
- Confirm encryption key rotation completed; remove legacy secret.

Day 3 — Publish and post-publish:
- Update website info (title, meta, OG) preflight, then `preview_ui--publish`.
- Verify canonical domain redirects and HTTPS.
- Submit sitemap to Google Search Console / IndexNow.
- Run `security-scan-snapshot` post-deploy.
- Smoke test top 10 routes on mobile (375px) and desktop.

## 5. Deferred (post-launch, not blockers)

- Reorganise 26 loose components into domain folders.
- Server-side MIME validation for file uploads.
- Expand E2E coverage to auth, comparison engine, admin role escalation.
- Document `verify_jwt = false` + manual check pattern per edge function.

## 6. Recommended next action

Approve this plan and I'll switch to build mode to (a) re-verify the May Amber items in parallel, (b) query live mapping/clinic counts, and (c) produce a concrete patch list with file-level diffs before any publish.
