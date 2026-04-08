

## Plan: Contact Us Page Overhaul

### Summary
Six changes to `src/pages/ContactPage.tsx`:

### 1. "Contact Us" on one line
Change from `title="Contact" accent="Us"` to `title="Contact Us"` (no accent). This renders it as a single line instead of splitting across two spans.

### 2. Responsive background colour
Change the `<main>` background from `bg-muted/30` to `bg-[#081129] md:bg-white` — dark navy on mobile, white on tablet/desktop.

### 3. Card text colour
Add `text-[#081129]` to all Card components on this page so text is dark navy instead of black.

### 4. Turquoise placeholder text
Add `placeholder:text-[#22c0d4]` class to every Input and Textarea on this page, making the placeholder text (e.g. "Enter your first name") turquoise.

### 5. Replace Phone Support card with Provider Contact Directory
Remove the fake "0800 123 4567" number and hours. Replace with a list of providers and their publicly listed phone numbers:

| Provider | Phone |
|----------|-------|
| Medichecks | 0345 060 0600 |
| GoodBody Clinic | 01225 444 144 |
| Randox Health | 028 9442 2413 |
| London Medical Laboratory | 0207 183 6122 |
| Clinilabs | 020 4525 8805 |
| London Health Company | 020 8087 0017 |
| Medical Diagnosis | 020 8830 0503 |

Providers without a publicly listed phone number (Thriva, Lola Health) will show "Online support only" instead. The card title changes to "Provider Contact Numbers" with a note: "Contact our trusted providers directly for test-specific enquiries."

### 6. No other changes
Cards remain white with their existing dark navy border. Email support, office address, and emergency cards stay as-is.

### Technical Details
- Single file edit: `src/pages/ContactPage.tsx`
- No new dependencies
- Responsive breakpoint uses `md:` prefix (768px+) matching the project's mobile-first approach

