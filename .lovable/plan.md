

# Launch Readiness Audit -- myhealth checkup

## Overall Assessment: ~85% Ready

The platform is structurally sound with strong security foundations, comprehensive routing, and polished UI. Below are the issues to address before launch, ranked by severity.

---

## CRITICAL (Must Fix Before Launch)

### 1. `/find-clinic` page crashes
The Find a Clinic page consistently shows "Something went wrong." This is a user-facing feature linked from both the navigation menu and footer. Likely caused by the Leaflet map library (react-leaflet / react-leaflet-cluster) failing at runtime. Needs debugging and fixing.

### 2. `/admin/test-dashboard` missing AdminRoute protection
Line 44 in `src/routes/index.tsx`: `AdminTestDashboardPage` is rendered without the `<AdminRoute>` wrapper, unlike every other admin page. Any user can access it directly.

### 3. Leaked Password Protection disabled
Supabase Auth does not currently check passwords against known breach databases. This is a manual toggle in the Supabase Dashboard under **Auth > Password Protection**. Required for UK Cyber Essentials compliance.

---

## HIGH (Should Fix Before Launch)

### 4. Sitemap URLs are wrong
The sitemap references `/category/blood-tests`, `/compare/symptom/fatigue`, `/compare/goal/longevity` etc. But actual routes use `/tests/:category`, `/compare/symptoms/:slug`, `/compare/goals/:slug`. These mismatches mean Google will index 404 pages and miss your real content. The sitemap needs a full rewrite to match actual routes.

### 5. Duplicate `/sports-performance` route
Defined in both `testRoutes.tsx` (line 50) and `contentRoutes.tsx` (line 26). React Router will use whichever matches first; the second is dead code that creates confusion. Remove one.

### 6. `/typography-showcase` is publicly accessible
This is a developer/internal tool exposed to all users. Should either be removed from production routes or placed behind AdminRoute.

### 7. Realtime channel policy is too broad
Any authenticated user can subscribe to any Realtime channel (the SELECT policy uses `USING (true)`). Should be scoped by topic or user ID.

---

## MEDIUM (Recommended Before Launch)

### 8. Footer link inconsistency
- "Diabetes" links to `/compare?category=diabetes` instead of `/tests/diabetes`
- "Thyroid" links to `/compare?category=thyroid` instead of `/thyroid`
- "Fertility" links to `/compare?category=fertility` instead of `/fertility-tests`
These work but produce different experiences from the dedicated pages.

### 9. `robots.txt` references stale routes
Lists `/subscriptions` and `/dashboard` as important routes. `/subscriptions` has no route; `/dashboard` is behind auth so indexing it is pointless. Clean up.

### 10. Missing "How It Works" as a nav item
"How It Works" appears as the last primary nav item AND inside the "More > About" dropdown. Minor duplication.

### 11. No `<meta name="description">` on non-homepage pages
Only the homepage has full SEO meta tags. Category pages, test pages, and content pages should each have unique meta descriptions for search ranking.

---

## SECURITY SUMMARY

**Strong points:**
- RLS is active across tables with auto-enable trigger
- Admin routes use server-side `has_role()` RPC verification (not client-side)
- PII encryption validated via database trigger (`validate_encrypted_fields`)
- Audit logging on sensitive data access
- Session idle timeout enforced (30 min)
- Security headers configured (CSP, HSTS, X-Frame-Options) in both `_headers` and `vercel.json`
- Cookie consent with granular preferences (GDPR compliant)
- External links use `noopener noreferrer`

**To address:**
- Enable leaked password protection (Supabase Dashboard)
- Scope Realtime channel policy
- Wrap `/admin/test-dashboard` with `<AdminRoute>`

---

## WHAT IS WORKING WELL

- Homepage renders cleanly with all sections in correct order
- Navigation (desktop + mobile drawer) fully functional with mega menus
- Compare page loads and displays test cards correctly
- Auth page (sign in, sign up, forgot password, Google/Apple) all present
- Footer is clean with correct company info and compliance badges
- Cookie consent banner appears on first visit
- 404 page catches unknown routes
- All compliance pages exist (privacy, terms, cookies, accessibility, modern slavery, affiliate disclosure, fair trading, how we rank)
- Structured data (JSON-LD) on homepage
- Open Graph and Twitter Card meta tags present
- Service worker and manifest.json configured for PWA

---

## Recommended Fix Order

1. Fix `/find-clinic` crash (critical user feature)
2. Wrap `AdminTestDashboardPage` with `<AdminRoute>`
3. Enable leaked password protection in Supabase Dashboard
4. Rewrite `sitemap.xml` to match actual routes
5. Remove duplicate `/sports-performance` route
6. Fix footer category links
7. Clean up `robots.txt`
8. Remove or protect `/typography-showcase`

