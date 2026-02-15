

# Swap "Take Control" and "Medichecks" Cards in Partner Showcase Grid

## What you want

- Move the "Take Control of Your Health Today" card from its current position (top-right) to where the Medichecks card is (bottom-right), so it sits next to "Find a Clinic".
- Remove the Medichecks card from the grid for now, but keep the code commented out so it can be restored later.

## Current layout

```text
+-------------------------+-------------------------------+
| Goodbody (white)        | Take Control (navy) — MOVING  |
+-------------------------+-------------------------------+
| Find a Clinic (navy)    | Medichecks (white) — STORING  |
+-------------------------+-------------------------------+
```

## New layout

```text
+-------------------------+-------------------------------+
| Goodbody (white)        | (empty slot removed)          |
+-------------------------+-------------------------------+
| Find a Clinic (navy)    | Take Control (navy) — MOVED   |
+-------------------------+-------------------------------+
```

## Steps

**1. In `src/components/sections/PartnerShowcaseGrid.tsx`:**

- Move the "Take Control" card block to the bottom-right position (after the "Find a Clinic" card)
- Comment out the entire Medichecks card block so it can be brought back later
- Remove the unused `medichecksVideo` and `PROVIDER_LOGOS` imports since Medichecks is being stored

**2. Adjust the grid layout**

With only 3 cards instead of 4, the grid will naturally place:
- Goodbody (top-left)
- Find a Clinic (top-right or bottom-left depending on order)
- Take Control (next to Find a Clinic)

The exact card ordering in code will be: Goodbody, Find a Clinic, Take Control — giving a clean 2-column grid with Goodbody spanning or sitting top-left, and the two navy cards side by side on the bottom row.

