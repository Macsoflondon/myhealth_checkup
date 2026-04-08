

## Plan: Reorder Providers and Add Thriva Email

**File: `src/pages/ContactPage.tsx`**

### 1. Swap Lola Health above Thriva and add Thriva's support email

Update the `providerContacts` array (lines 38-48) and its type to support an `email` field:

- Change the type to include `email?: string`
- Move Lola Health (with `liveChat`) above Thriva
- Add Thriva's support email: `help@thriva.co` with a `mailto:` link
- Update the render logic to handle the new `email` field — display the email as a clickable `mailto:` link with a `Mail` icon, styled in turquoise like the other contact methods

### Updated array order:
1. Medichecks — phone
2. GoodBody Clinic — phone
3. Randox Health — phone
4. London Medical Laboratory — phone
5. Clinilabs — phone
6. London Health Company — phone
7. Medical Diagnosis — phone
8. **Lola Health** — live chat link
9. **Thriva** — email link (`help@thriva.co`)

### Render logic addition:
Add a third condition in the provider list rendering: if `email` is set, render a `mailto:` link with a `Mail` icon and the email address text.

