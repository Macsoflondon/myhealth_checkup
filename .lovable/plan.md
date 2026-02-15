

# Fix Partner Showcase Grid Layout — Add Empty Slot Next to Goodbody

## The issue

The current card order (Goodbody, Find a Clinic, Take Control) places Find a Clinic next to Goodbody on row 1. You want it on row 2 instead.

## Desired layout

```text
+-------------------------+-------------------------------+
| Goodbody (white)        | (empty)                       |
+-------------------------+-------------------------------+
| Find a Clinic (navy)    | Take Control (navy)           |
+-------------------------+-------------------------------+
```

## Fix

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

- Add a hidden empty placeholder `<div>` after the Goodbody card (visible only on `md:` and up) to occupy the top-right grid cell
- This pushes "Find a Clinic" and "Take Control" down to row 2 together
- No other changes needed — card order stays the same

