

# Launch Readiness Audit & Remediation Plan

## What I've found (evidence-based)

I ran a full review: code, schema, RLS, security scanners, Supabase linter, and live browser testing across 320, 375, 390, 768, 1024px. Below is the verdict and the work needed to launch.

## Verdict

**Not launch-ready.** Backend security and content compliance are strong. The blockers are mobile responsive breaks (the platform is unusable at every viewport <768px in the header and hero), one runtime crash from Google Translate, and a handful of data-integrity/UX issues. Realistic effort: **1-2 focused days** to fix everything below.

---

## SEVERITY 1 — Launch blockers (must fix)

| # | Issue | Evidence | Fix |
|---|-------|----------|-----|
| B1 | **Horizontal scroll at every mobile breakpoint** (320/375/390px). Hero headline clipped ("Test From Hom…"), hamburger button cut off the right edge, BrandTicker text cut off both sides. | Screenshots at 320/375/390 — page has visible bottom scrollbar | Add `overflow-x: clip` to `html, body` in `src/index.css`. Wrap hero `<section>` with `max-w-[100vw] overflow-hidden`. Tighten Hero button row gap/padding for <400px. Reduce mobile logo from `h-[80px]` to `h-[56px]` and shrink right-nav gap. |
| B2 | **Tablet (768px) header overflows** — desktop nav menu and user controls both clipped off-screen. | Screenshot at 768 | Lower the desktop-nav breakpoint to `lg:` (1024+) instead of falling back to desktop layout at 768; render `MobileNavigationDrawer` for tablets too. |
| B3 | **Google Translate widget crashes** with `RangeError: Maximum call stack size exceeded` — infinite recursion repeating in console. | `browser--read_console_logs` shows recursive stack overflow on translate_http JS | Remove the `useGoogleTranslate` hook + script injection (it conflicts with React's reconciler). Replace with i18next routes (already configured in `src/i18n/config.ts`) or remove the language switcher until properly implemented. |
| B4 | **Leaked Password Protection disabled** in Supabase Auth. | `supabase--linter` warning | **Manual action**: enable in Supabase Dashboard → Auth → Password Protection. Cannot be done via migration. |
| B5 | **`saved_providers` missing UPDATE RLS policy** — silent write failures if user edits saved provider notes. | `supabase_lov` finding | Add `CREATE POLICY "Users update own saved providers" ON saved_providers FOR UPDATE USING (auth.uid() = user_id);` |
| B6 | **OG image points at gpt-engineer-file-uploads** (Lovable-managed staging URL) — fragile for production sharing. | `index.html` line 20 | Move OG image to `/public/og-image.png` (already referenced in Index.tsx schema); update `index.html` to use the local path. |

---

## SEVERITY 2 — High priority (should fix before launch)

| # | Issue | Fix |
|---|-------|-----|
| H1 | 72 raw `console.log/error/warn` calls in production code | Wrap all with the existing `src/lib/logger.ts` utility, which already filters in PROD. Bulk find-and-replace. |
| H2 | Hero image LCP — 5 background images all loaded; only first should be eager. WebP source used but no `srcset` for mobile sizes. | Verified eager only on `i===0`, but generate `_mobile.webp` (640w) and `_desktop.webp` (1920w) variants and use `<picture>` with media queries. |
| H3 | Privilege escalation risk on `user_roles` — every server-side path that writes to it must be audited. | Audit `handle_new_user_profile`, `verify-admin-mfa`, and any edge function with service-role key. Add a CHECK constraint or trigger to forbid INSERT of `admin` role except via explicit service-role flag. |
| H4 | No skip-to-content link, several pages missing single H1, mobile logo `alt` is overloaded marketing copy. | Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` in MainLayout. Audit per the existing `H1_HEADING_AUDIT.md`. Trim alt text. |
| H5 | Footer cookie consent banner overlays `Accept All` button on top of page content on mobile (covers ~30% of viewport above the fold). | Reduce vertical padding, collapse to a smaller bar by default with "Manage" expander. |
| H6 | Newsletter subscribe edge function lacks reCAPTCHA / honeypot — vulnerable to bot signup spam. | Add a hidden honeypot field + per-IP rate limit (reuse `api_rate_limits` table). |

---

## SEVERITY 3 — Medium priority (post-launch acceptable)

- Hero claims "200+ tests" and "200+ clinics nationwide" but brand standard is "377+ Clinic Locations" per memory. Reconcile copy to a single number sourced from DB.
- "No GP referral needed**" footnote asterisk references nothing on the page.
- TestCategoryTicker eagerly loaded with Hero — could lazy-load to shave LCP.
- Several admin pages lack page titles in `<Helmet>`; not user-facing but affects browser tab UX.
- Sitemap.xml last-modified dates are static; add a build step to update them.
- `bun.lock` and `package-lock.json` both committed — pick one package manager (bun is configured in CI? clarify).
- TypographyShowcasePage publicly routed — should be admin-only or removed pre-launch.
- `public/clinics_master.json` and `public/medichecks_clinics_data.json` shipped to client (~MB of data). Move to private storage / Supabase tables only.

---

## SEVERITY 4 — Low priority / polish

- 5 background hero images (1920×1080) total ~600KB+. Consider dropping to 3 slides.
- Add `<link rel="alternate" hreflang>` for the 11 locale files in `src/locales/` once Translate is replaced.
- BrandTicker scrolls infinitely — add `prefers-reduced-motion: reduce` pause.
- Provider profile pages: add `breadcrumbs` JSON-LD per page (currently global only).

---

## What's working well (no action)

- 30 RLS-protected tables, 95 policies verified
- Server-side PII encryption with DB trigger enforcement
- Admin MFA + server-side role validation via `has_role()` SECURITY DEFINER
- Edge function input validation + rate limiting
- Storage buckets private with owner-folder policies
- Comprehensive structured data (Organization, WebSite, MedicalBusiness, BreadcrumbList, FAQPage)
- Lazy loading of below-the-fold sections + admin pages
- 11 locale files prepared, GDPR consent broadcast wired

---

## Implementation order (when you approve)

```text
Phase 1 — Mobile fixes (B1, B2)        ~3h
Phase 2 — Crash + security (B3, B4, B5, B6)   ~1h
Phase 3 — High priority (H1-H6)        ~4h
Phase 4 — Medium polish               ~2h
Phase 5 — Final QA across breakpoints  ~1h
```

## Deliverables

1. **Chat summary** (this document, condensed) once approved.
2. **PDF report** written to `/mnt/documents/launch-readiness-audit.pdf` for stakeholder distribution. Generated with reportlab, includes screenshots of each broken viewport, severity matrix, and remediation steps.

Approve to switch to default mode and start Phase 1, or tell me to adjust scope.

