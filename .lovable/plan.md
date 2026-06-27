## Replace TrustBar with AccreditedProvidersBar

**Delete:**
- `src/components/sections/TrustBar.tsx`

**Update `src/layouts/MainLayout.tsx`:**
- Remove `TrustBar` import and its render on non-home pages
- Render `AccreditedProvidersBar` (lazy) in its slot below `BrowseByCategoryBar`

**Update `src/pages/Index.tsx`:**
- Remove eager `TrustBar` import and its render under the homepage `BrowseByCategoryBar`
- Promote the existing lazy `AccreditedProvidersBar` up into that slot (immediately under `BrowseByCategoryBar`), removing its `LazyMount` wrapper so it appears flush at the top of the page like the screenshot
- Keep the lower sections intact (no duplicate AccreditedProvidersBar further down)

Result: the "All listed providers meet every one of the following standards" bar (with UKAS / CQC / ISO / GDPR / Pricing / No GP referral chips) sits directly below the BrowseByCategoryBar on every page, replacing the deleted TrustBar entirely.