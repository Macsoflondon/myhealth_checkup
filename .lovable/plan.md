

## Revert card widths and add quiz CTA banner to provider profiles

### Change 1: Revert grid layout to original column widths

**File:** `src/pages/ProviderProfilePage.tsx`

Restore the original asymmetric layout (narrow left, wide right) while keeping equal heights within each row:

- Change grid from `md:grid-cols-2` back to `grid-cols-1 lg:grid-cols-3`
- Wrap Contact Information + Test Categories in a `lg:col-span-1` column with `flex flex-col gap-4`
- Wrap Service Information + Why Choose in a `lg:col-span-2` column with `flex flex-col gap-4`
- Keep `h-full flex flex-col flex-1` on all four cards so they stretch to equal height within each row pair

### Change 2: Add "Find the Right Health Test" CTA banner above footer

**File:** `src/pages/ProviderProfilePage.tsx`

Add the quiz CTA banner (matching the existing `CategoryPageBottom` style) directly above `<Footer />`. This is the dark navy box with pink gradient border, turquoise "NOT SURE WHERE TO START?" label, "Find the Right Health Test for You" heading, and pink "Start Your Quiz →" button linking to `/quiz`. Will extract the banner markup inline rather than importing the full `CategoryPageBottom` component (which also includes a benefits section not needed here).

