# Match slogan punctuation colours to preceding words

## Goal
Make the full-stop dots after "health" and "choice" in the homepage hero slogan match the colour of the word that precedes them:
- dot after "health" → turquoise `#22c0d4`
- dot after "choice" → pink `#e70d69`

## Current state
In `src/components/layout/BrowseByCategoryBar.tsx` the slogan is split across five spans:
1. `Your ` — navy
2. `health` — turquoise
3. `. Your ` — navy (this contains the dot after health)
4. `choice` — pink
5. `.` — navy (this contains the dot after choice)

## Changes
Refactor the span grouping so each dot sits in the same colour span as the word before it:
- `<span className="text-[#22c0d4]">health.</span>`
- `<span className="text-[#e70d69]">choice.</span>`

Keep the remaining "Your " words and spacing in navy spans unchanged.

## Verification
- Inspect the homepage hero slogan in the preview.
- Confirm the dots render in turquoise and pink respectively.
- Run a type check / build to ensure no JSX errors.
