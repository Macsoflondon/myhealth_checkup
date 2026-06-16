## Goal
Reorder the footer so that:
- The **Follow Us** heading renders its pink dashes correctly (currently collapsed by `items-center`).
- **Compliance badges** sit directly under social icons with minimal gap.
- **Copyright** text sits directly under compliance badges.
- **Medical disclaimer** moves from below the card to the bottom of the `StayInformedSection` card, replacing copyright’s old position.
- The faint `border-t border-white/10` strip above the copyright is removed.
- **Brand bar** ("Your Health! Your Choice!…") moves from below the pink divider into the main footer container, taking the medical disclaimer’s old spot.
- The pink divider (`h-[2px] bg-brand-pink`) remains as the footer’s bottom boundary.

## Technical
Single file change: `src/components/layout/Footer.tsx`.

1. Fix `Follow Us` column width so `SectionHeading` flex dashes stretch:
   - Add `w-full` to the left column `div` (or remove `items-center` if appropriate).
2. Reorder left column content:
   - Social icons → compliance badges (tighten margin) → copyright text → medical disclaimer card.
3. Remove `border-t border-white/10` and associated `pt-3 mt-5` from the old copyright location.
4. Lift the brand bar JSX from its current `bg-[#060d20]` wrapper below the pink divider, and place it inside the main footer container `div` where the medical disclaimer currently lives.
5. Move the medical disclaimer JSX into the `StayInformedSection`, at the bottom of the card where the copyright paragraph currently sits.
6. Keep the pink divider as the final element in `<footer>`.

No new dependencies. No backend changes.