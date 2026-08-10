# Plan: Re-stack homepage header copy on mobile

## Goal
On mobile only, put the homepage slogan inside the same white header band as the `myhealthcheckup` wordmark, and move the trusted-platform caption into the navy band that currently holds the slogan.

## Current state
- `HeroMasthead.tsx` renders the navy hero wrapper. Inside it, the `<h1>` "Your health. Your choice." sits in a navy block on mobile.
- `BrowseByCategoryBar.tsx` renders the white mobile brand bar (logo + hamburger) at the top of the page.
- `AccreditedProvidersBar.tsx` renders "Your trusted platform for comparing private health and screening tests." in the white standards section below the hero.

## Changes

### 1. Move the slogan into the white mobile header band
**File:** `src/components/layout/BrowseByCategoryBar.tsx`
- Inside the `md:hidden` mobile header, change the single-row logo/hamburger strip into a flex-column:
  - Row 1: logo (left) + hamburger (right), vertically centred.
  - Row 2: the `<h1>` "Your health. Your choice." directly under the logo.
- The `<h1>` is visible only on mobile (`md:hidden`).
- Text colour adapts to the scroll state:
  - Default (white background): navy base with turquoise/pink accent words.
  - Scrolled (navy background): white base with turquoise/pink accent words.
- Remove the fixed `h-20` height; use auto/min-height with vertical padding so the extra line does not clip.

### 2. Hide the desktop `<h1>` on mobile
**File:** `src/components/sections/HeroMasthead.tsx`
- Add `hidden md:block` to the existing `<h1>` so it only renders on desktop.

### 3. Move the trusted caption into the navy band on mobile
**File:** `src/components/sections/HeroMasthead.tsx`
- Add the `HERO_CAPTION` paragraph below the `<h1>` inside the navy flex-column, using `md:hidden`.
- Style it centred, white text, with the same responsive font sizing used in `AccreditedProvidersBar.tsx`.

### 4. Hide the caption in the white standards section on mobile
**File:** `src/components/sections/AccreditedProvidersBar.tsx`
- Add `hidden md:block` to the caption paragraph so it only appears on desktop.
- Keep the standards grid and subheadline unchanged.

## Verification
- Run `npm run build:dev` to confirm no Tailwind/class errors.
- Check the mobile preview to confirm:
  - White header band contains logo, hamburger, and slogan.
  - Navy band below it contains the trusted-platform caption.
  - No caption duplication in the white standards section.
  - Sticky mobile header still spans full width and does not overlap hero content.
- Run the existing toolbar E2E test and update selectors if the mobile header structure changes them.

## Out of scope
- Desktop layout remains unchanged: wordmark + slogan in the navy band, caption in the white standards section.
