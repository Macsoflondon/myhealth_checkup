

## Plan: Contact Page Layout Adjustments

**File: `src/pages/ContactPage.tsx`**

### 1. Lola Health — change "Online support only" to "Live Support" with link

Update the `providerContacts` array entry for Lola Health to include a `liveChat` URL pointing to `https://lolahealth.com/pages/contact-us`. In the render logic, add a condition: if `liveChat` is set, render a turquoise link saying "Live Support" that opens in a new tab, instead of the grey "Online support only" text. Import `MessageCircle` from lucide-react to use as the icon.

### 2. Restructure the two-column layout so cards align side by side

Currently the left column is just the form card, and the right column stacks: Provider Numbers, Email Support, Office Address, Emergency. The form card is taller than Email Support, causing misalignment.

New layout using a 2-column grid with 4 rows:

```text
Row 1:  [Send Us a Message form]     [Provider Contact Numbers]
Row 2:  [Email Support]              [Office Address]
Row 3:  [Emergency Medical]          (empty)
```

- Move the form card and Provider Contact Numbers into the first row (already the case via `lg:grid-cols-2`).
- Break the right-side `space-y-6` div apart so Email Support, Office Address, and Emergency become independent grid items in a second `grid lg:grid-cols-2 gap-6` section below the main form row.
- The form card keeps `space-y-6` spacing but the textarea `min-h-[120px]` stays as-is — the card will naturally shrink since the right column (Provider Numbers) is shorter, and the form will match.

**Specifically:**
- Keep the top row as `grid lg:grid-cols-2 gap-12` with the form card and provider directory card.
- Below that, add a new `grid lg:grid-cols-2 gap-6 mt-6` containing:
  - Left: Email Support card
  - Right: Office Address card
- Below that, add Emergency Medical card spanning full width or left-aligned.

### 3. Lola Health data change

Update line 47 from `{ name: 'Lola Health', phone: null }` to `{ name: 'Lola Health', phone: null, liveChat: 'https://lolahealth.com/pages/contact-us' }`.

Update the type/rendering to handle the new `liveChat` field.

