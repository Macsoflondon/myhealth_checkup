## Plan

Remove the floating test-card overlay (the glassmorphism card showing rotating test adverts) from `src/components/sections/HeroMasthead.tsx`.

### Scope
- Delete the `<Link>` block (lines 179–207) that renders `ad` as an absolute-positioned card at `right-[18px] bottom-[18px]`.
- The rotating slide label bubble at `left-[18px] bottom-[18px]` is **kept** — only the card on the right is removed.
- No other sections or logic touched.

### Cleanup considerations
- The `ad` variable (line 117) and `ADVERTS` / `buildAdverts()` logic will be left in place to avoid breaking imports, but will simply go unused.
- The `animate-fade-in` class can remain in the stylesheet as it is also used by the label bubble.