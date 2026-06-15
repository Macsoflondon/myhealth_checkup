## Footer Card Restructure

### Current Layout
The `StayInformedSection` card has a two-column top row (`Follow Us` | `Stay Informed`) and a bottom row separated by a faint divider (`border-t border-white/10`) containing copyright text + compliance badges.

### Proposed Changes
1. **Move compliance images up**  
   Relocate the compliance badge images from the bottom row into the left column, positioned underneath the `Follow Us` social icons. Increase their size so they fill the vertical space and visually balance the `Stay Informed` subscription form on the right.

2. **Center `Follow Us` content**  
   Align the `Follow Us` heading and social icons centrally within the left column so the social row and compliance images below it read as a single centered block.

3. **Move copyright above the divider & condense**  
   Take the copyright line (`© 2026 MYHEALTHCHECKUP LTD...`) out of the bottom row and place it just above the faint `border-t` divider. Reduce font size / padding so it fits compactly in that narrow space.

4. **Remove the old bottom section**  
   Delete the entire `mt-6 pt-5 border-t` container that currently holds the copyright and compliance badges, eliminating the empty space below the divider.

### Result
The card ends cleanly after the faint divider with no orphaned whitespace. All content (social icons, compliance badges, subscription form, condensed copyright) lives within the single card boundary at the correct vertical levels.

### File to change
- `src/components/layout/Footer.tsx`