

## Align the four content boxes on the GoodBody provider profile page

### What the user wants
1. **Remove** the "Clinic Locations" and "Locations" entries from the Contact Information card (lines 345-357)
2. **Make all four cards equal height** — Contact Information, Test Categories, Service Information, and Why Choose should all start and end at the same vertical position

### Current layout (lines 306-483)
- Left column (`lg:col-span-1`): Contact Information card + Test Categories card (stacked with `mt-4`)
- Right column (`lg:col-span-2`): Service Information card + Why Choose card (stacked with `space-y-6`)

### Changes in `src/pages/ProviderProfilePage.tsx`

**1. Remove clinic/location fields from Contact Information (lines 345-357)**
Delete the two conditional blocks for `provider.clinics` and `provider.locations`.

**2. Make all four boxes align as a 2x2 grid with equal heights**
- Change the outer grid from `grid-cols-1 lg:grid-cols-3` to `grid-cols-1 md:grid-cols-2` (line 306)
- Remove the `lg:col-span-1` / `lg:col-span-2` wrappers — place all four cards as direct grid children
- Remove the `mt-4` from the Test Categories card (it becomes a grid sibling, not stacked)
- Remove the `space-y-*` wrapper from the right column
- Add a shared min-height or use CSS `grid-rows: subgrid` approach — simplest: add `h-full` to each `<Card>` and `flex flex-col` so cards stretch to fill their grid cell equally

Result: 4 cards in a 2-column grid, all stretching to the same row height. Top row: Contact Information + Service Information. Bottom row: Test Categories + Why Choose.

