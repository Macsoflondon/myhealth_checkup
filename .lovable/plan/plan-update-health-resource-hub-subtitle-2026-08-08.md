# Plan: Update Health Resource Hub subtitle

## Goal
Replace the subtitle under the "Health Resource Hub" hero heading so it no longer implies the articles are "evidence-led" or that myhealth checkup critiques or assesses the provider blogs.

## Current text
> Evidence-led articles gathered from the UK diagnostics providers we compare. Every headline links straight back to the original source.

## Proposed new text
> Articles from the diagnostics providers we work with, gathered in one centralized resource hub. Each headline links straight back to the original source, so you can read more about a provider or test directly from them.

## Why this wording
- Removes "evidence-led" / "evidence-based" claims.
- Avoids language that suggests we compare or assess the blogs themselves.
- Positions the page as a link aggregator / centralized hub.
- Keeps the brand tone: professional, clear, and transparent.
- Retains the "links straight back to the original source" trust signal.

## Scope
Single file change:
- `src/pages/HealthBlogPage.tsx` — update the `<p>` subtitle at line 287.

## Verification
- Run `npm run build` to confirm no TypeScript/JSX errors.
- Visually confirm the hero subtitle renders correctly on the Health Resource Hub page.
