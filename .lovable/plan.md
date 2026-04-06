

## Plan: Enlarge Header Tagline to Match Logo Height

### What's happening now
The desktop header uses a single combined image (`src/assets/logo-with-tagline.png`) that contains both the myhealth checkup logo and the tagline. The tagline text within that image is significantly smaller than the logo, making it hard to read.

### Approach
Split the header into **two separate images side by side**: the existing logo and the uploaded tagline banner. This gives independent size control so the tagline can match the logo height.

### Steps

1. **Copy the uploaded tagline image** into `src/assets/header-tagline.png`

2. **Update `Header.tsx` (desktop only, lines 119-126)**:
   - Import the new tagline image alongside the existing logo
   - Replace the single `<img>` with two images in a flex row:
     - Left: the myhealth checkup logo (`myhealth-logo.png` or `logo-turquoise.png`) at the current height (h-28 lg:h-32 xl:h-36)
     - Right: the uploaded tagline image at the **same height** classes (h-28 lg:h-32 xl:h-36)
   - Both wrapped in the existing `<Link to="/">` container

3. **No changes to mobile** — the mobile header uses `mobileLogo` separately and is untouched.

4. **No other changes** — nav, toolbar, sticky behaviour, colours all remain as-is.

### Files Modified
- `src/assets/header-tagline.png` (new — copied from upload)
- `src/components/layout/Header.tsx` (desktop logo section only)

