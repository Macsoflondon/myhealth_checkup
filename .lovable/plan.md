## Plan

### 1. Rebalance hero heading vertical spacing
The `Compare.` h1 currently sits with `mt-12 md:mt-16` above and only `mb-2` below the slogan row. Shift it upward by reducing top margin and add that space below to create more breathing room between the heading and the slogan.

**Changes:**
- `mt-12 md:mt-16` → `mt-10 md:mt-14` (move heading up by one spacing step)
- `mb-2` → `mb-5` (increase buffer below heading before slogan)

### 2. Increase heading font size
Bump the `Compare.` h1 up one step in the clamp range.

**Change:**
- `text-[clamp(4.5rem,12vw,10rem)]` → `text-[clamp(5rem,13vw,11rem)]`

### 3. Increase nav link font sizes
All three top-nav links are currently `text-[10px]`. Raise each by one step.

**Change:**
- Nav links (`Compare`, `Categories`, `Find your test`): `text-[10px]` → `text-[11px]`

---
**Scope:** Only `src/components/sections/HeroMasthead.tsx`. No other files touched.