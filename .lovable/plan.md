## Problem
The slogan "Your health! Your choice! One trusted platform!" is visible in the desktop header because it's baked into the `fullLogo` image (`myhealth-logo-full.png`).

## Solution
Replace the desktop header's logo image with the existing cropped logo (`myhealth-logo-cropped.webp`) which contains only the heart mark and "myhealth checkup" wordmark — no tagline.

## Changes
1. **src/components/layout/Header.tsx**
   - In the desktop header `<Link>`, change `<img src={fullLogo.url} ... />` to use `mainLogo` instead.
   - Update the `alt` text to just `"myhealth checkup"`.
   - Remove the now-unused `fullLogo` import.
   - Optionally remove the unused `headerTagline` import if it's not used elsewhere in the file.

No other files need to change. The mobile header already uses the cropped logo, so this change aligns desktop with mobile.