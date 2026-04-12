

## Update About Us page banner

### Changes

**1. Update heading text** (`src/pages/AboutUsPage.tsx`, line 53-57)
- Change `title` from `"About"` to `"About myhealth checkup"`
- Remove the `accent` prop (so it's all on one line)
- Change `subtitle` to `"Trusted health comparison platform."`

**2. Reduce PageBanner padding** (`src/components/sections/PageBanner.tsx`, line 13)
- Cut vertical padding roughly in half: change from `pt-6 pb-4 sm:pt-8 sm:pb-6 md:pt-10 md:pb-8` to `pt-3 pb-2 sm:pt-4 sm:pb-3 md:pt-5 md:pb-4`
- Also reduce subtitle bottom margin from `mb-4 sm:mb-5` to `mb-2 sm:mb-3`

This keeps the PageBanner component compact globally (it's used on other pages too — How It Works, etc.). If you only want it smaller on the About page, I can instead pass a size prop or override inline. Let me know if you'd prefer the change scoped to About Us only.

