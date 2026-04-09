

# Plan: Build-Time OG Meta Tag Injection

## Problem

Social media bots (Facebook, Twitter, LinkedIn) and many SEO crawlers do not execute JavaScript. Every page currently serves the same `index.html` with the homepage's OG tags. React Helmet updates them client-side, but bots never see those updates — so every shared link shows the homepage title and description regardless of the actual page.

The `vite-plugin-prerender` configured previously requires Chromium/Puppeteer in the build environment, which is unlikely to work on Lovable's build servers.

## Solution: Custom Vite Plugin for Static OG Injection

Create a lightweight custom Vite plugin that runs **after build** (no browser needed). It:

1. Reads the built `dist/index.html`
2. For each known route, replaces the `<title>`, `og:title`, `og:description`, `og:url`, `twitter:title`, `twitter:description`, and `meta description` tags with route-specific values
3. Writes the modified HTML to `dist/{route}/index.html`

This gives each route its own HTML file with correct OG tags baked in. When a bot visits `/about`, Lovable's static hosting serves `dist/about/index.html` with the correct metadata. React then hydrates on top — no conflict.

## Changes

### 1. Remove `vite-plugin-prerender` (it won't run without Chromium)

**File: `vite.config.ts`**
- Remove the `vite-plugin-prerender` import
- Remove the entire prerender plugin block (lines 19-77)
- Replace with the custom `ogMetaPlugin()` call

### 2. Create the custom plugin

**New file: `plugins/ogMetaPlugin.ts`**

A Vite plugin with a `closeBundle` hook that:
- Defines a route-to-metadata map (~55 entries) with `title`, `description`, and `url` for each route
- Reads `dist/index.html` as a template
- For each route, performs string replacements on the 6 meta tags (title, description, og:title, og:description, og:url, twitter:title, twitter:description)
- Creates the directory structure and writes the file (e.g., `dist/about/index.html`)

The metadata map is defined inline in the plugin — one object per route:
```text
{
  '/about': {
    title: 'About Us | myhealth checkup',
    description: 'Learn about myhealth checkup\'s mission...',
    url: 'https://myhealthcheckup.co.uk/about'
  },
  '/how-it-works': { ... },
  ...
}
```

### 3. Remove `x-render-complete` event from main.tsx

**File: `src/main.tsx`**
- Remove the `document.dispatchEvent(new Event('x-render-complete'))` line (no longer needed without the prerender plugin)

### 4. Uninstall `vite-plugin-prerender`

Remove the dependency from `package.json`.

## What this solves

- Facebook, LinkedIn, Twitter, WhatsApp, Slack, iMessage link previews all show the correct page title, description, and image
- No external service needed (Prerender.io, Cloudflare Workers)
- No Chromium/Puppeteer dependency
- Works with Lovable static hosting as-is
- Zero runtime cost — everything happens at build time
- Each route gets a unique HTML file; the SPA fallback still handles dynamic routes

## What it does NOT change

- No visual changes
- No component changes
- No runtime behaviour changes
- Pages that already have Helmet tags continue to work for client-side navigation

## Scope

- `plugins/ogMetaPlugin.ts` — new file (~150 lines)
- `vite.config.ts` — swap prerender plugin for OG plugin
- `src/main.tsx` — remove render-complete event
- `package.json` — remove `vite-plugin-prerender`

