## Slow Trusted Partners carousel to match Popular Tests

In `src/components/sections/PartnersGrid.tsx`, change `const speed = 0.8;` to `const speed = 0.5;` so the partner-logo marquee moves at the same pixels-per-frame as the Most Popular Tests carousel (`DreamHealthShowcase.tsx`, line 162). One-line change, no other edits.