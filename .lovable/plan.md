Edit the dark navy CTA band in `src/components/sections/StatsBand.tsx` (lines 46–66):

1. **Delete** the "Why test privately" eyebrow span (line 50).
2. **Headline on one line** with inline colour: `Your health is your greatest asset.`
   - "health" → turquoise `#22c0d4`
   - "asset" → pink `#e70d69`
   - Add `whitespace-nowrap` and drop the size clamp down so it fits one line.
3. **Remove the em dash** in the paragraph: "…most trusted providers and book the right one…"
4. **Halve the navy band's vertical size**: change `py-[30px]` → `py-[15px]`, and tighten internal margins so the headline sits on the same horizontal line as the two CTA buttons (already `flex items-center`, just less vertical bulk).