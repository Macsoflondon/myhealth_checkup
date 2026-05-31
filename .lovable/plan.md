Move the homepage "Why Trust Us — Trusted Health Comparison Platform" section (`TrustPlatformSection`) into the About Us page, replacing the existing `TrustBadgesSection` there. The homepage will no longer render `TrustPlatformSection`.

Changes:

`src/pages/Index.tsx`
- Remove the `<Suspense>` block that renders `<TrustPlatformSection />`.
- Remove the `lazy(() => import("@/components/sections/TrustPlatformSection"))` import line.

`src/pages/AboutUsPage.tsx`
- Replace the `import TrustBadgesSection from "@/components/sections/TrustBadgesSection"` with `import TrustPlatformSection from "@/components/sections/TrustPlatformSection"`.
- Replace the `<TrustBadgesSection />` render at line 62 with `<TrustPlatformSection />` in the same position (directly under `PageBanner`, above the "Our Mission" section).

No other pages/components are affected. `TrustBadgesSection.tsx` file is left in place since it may be referenced elsewhere.
