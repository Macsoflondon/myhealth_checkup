
Update the `popularSearches` array in `src/components/sections/Hero.tsx`.

**Current:**
1. Full Blood Count
2. Thyroid Function
3. Vitamin D
4. Liver Function
5. Advanced Well Woman
6. Advanced Well Man

**New:**
1. Full Blood Count
2. Thyroid Function
3. Well Woman's
4. Testosterone
5. Well Men's
6. (drop one — keep at 6 total? User listed 3 replacements for 2 removals)

User removes 2 (Vitamin D, Liver Function) and adds 3 (Well Woman's, Testosterone, Well Men's). Net = 7. But existing array already had "Advanced Well Woman" and "Advanced Well Man" at positions 5–6. The new "Well Woman's" / "Well Men's" likely replace those. So final list:

1. Full Blood Count
2. Thyroid Function
3. Well Woman's → `/compare?search=well+woman`
4. Testosterone → `/compare?search=testosterone`
5. Well Men's → `/compare?search=well+man`
6. (drop — only 5 chips, or keep 6)

Mobile shows first 4 only (per existing `index >= 4` rule), so order matters: put the 3 new prominent ones in positions 3–5.

**Final array (5 items, clean):**
1. Full Blood Count
2. Thyroid Function
3. Well Woman's
4. Testosterone
5. Well Men's

Mobile (first 4): Full Blood Count, Thyroid Function, Well Woman's, Testosterone.
Desktop: all 5.

**File:** `src/components/sections/Hero.tsx` — replace `popularSearches` array (lines ~57–64).
