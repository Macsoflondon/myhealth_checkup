In `src/components/sections/HeroMasthead.tsx` line 138-140:

- Change slogan font size from `text-[11px] sm:text-lg` to `text-4xl` (matching the "my health checkup" Wordmark).
- Replace darkened colors with locked brand tokens:
  - `text-[#0a7a87]` → `text-[#22c0d4]` (brand turquoise) on "health."
  - `text-[#c40a59]` → `text-[#e70d69]` (brand pink) on "choice."
- Keep uppercase, bold, Montserrat, navy base text, and the existing border-bottom layout.

No other files touched.