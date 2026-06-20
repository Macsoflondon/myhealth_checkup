## Change all dropdown nav triggers to pure white

### Problem
The `white` colour token in Tailwind is overridden to pearl white (`hsl(220 5% 97%)`). Dropdown trigger buttons in the header navigation currently:
- Use pearl white as the default
- Turn turquoise for the "Most Popular Tests" accent item
- Turn pink on hover / when the dropdown is open

### Changes
1. **src/components/header/NavigationMenu.tsx**
   - Replace all conditional colour classes on dropdown trigger buttons with `text-[#FFFFFF]` so every trigger — default, hover, active, and accent — renders pure white.
   - Apply the same to the "More" button trigger.

2. **Verification**
   - Confirm no other header components define dropdown triggers with non-white colours.

### Outcome
Every dropdown tab in the main navigation stays pure white (`#FFFFFF`) in all states.