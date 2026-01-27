
Problem restatement (what’s happening)
- You’re on the homepage (route “/”), but some sections you expect (including the Mission section we inserted/updated) are not visible in the UI even after hard refresh and re-login.
- In code, those sections are present and wired up, so the issue is “rendered but not visible” or “you’re not looking at the build you think you are”.

Where the “missing sections” are in the code (single source of truth)
- Homepage sections are assembled in: src/pages/Index.tsx
- The section order is currently (with exact component names):
  1) <Hero />
  2) <MissionSection />   ← “Your health is your greatest asset”
  3) <PartnersGrid />     ← “Our Trusted Partners”
  4) <FeaturedPublications />
  5) <JourneySimplified />
  6) <MostPopularTestsSection />
  7) <TopConcernsSection />
  8) <FindClinicSection />
  9) <HereToHelp />
  10) <FinalCTA />
  11) <TrustPlatformSection />
  (+ StickyCtaBar)

Key observation from the current project state
- The homepage route is correctly configured to render Index: src/routes/index.tsx has <Route path="/" element={<Index />} />.
- MissionSection exists and is imported + rendered at line 103 in src/pages/Index.tsx.
- There is a hard console error being thrown by Google Translate:
  “Uncaught RangeError: Maximum call stack size exceeded” coming from translate.googleapis.com.
  This is important because Google Translate can manipulate/replace the DOM in a way that interferes with React rendering and layout. Even when it doesn’t crash the app completely, it can cause sections to appear missing, collapsed, or moved.

Most likely causes (ranked)
1) You are viewing a different environment or URL than the one being updated
   - If you are checking a custom domain / published site, changes won’t appear until the project is published (your project currently shows “Published URL: (not published)” in Lovable).
2) A layout/scroll container issue is clipping content
   - Example: a wrapper with fixed height (100vh) + overflow hidden can prevent later sections from appearing even though they exist in the DOM.
3) Google Translate script is breaking page layout/rendering
   - The stack overflow error suggests the script is unstable in this environment; it can lead to “missing sections” symptoms.

Implementation plan (what I will do in Default mode once you approve)
A) Confirm environment mismatch quickly (fastest win)
1. Add a temporary “Environment banner” (dev-only) at the top of the page that displays:
   - window.location.hostname
   - window.location.pathname
   - build timestamp (from import.meta.env.MODE + Date.now at build or a simple constant)
2. This makes it immediately obvious if you’re looking at preview vs a different host.

B) Add a temporary “Section Debug Panel” to remove guesswork
1. Add a small fixed debug panel (enabled only when the URL contains ?debug=sections) that lists each homepage section with:
   - “Found” / “Not found”
   - Its current getBoundingClientRect().top and height
   - A “Scroll to section” button that calls element.scrollIntoView({behavior:'smooth'})
2. This will prove whether sections are:
   - Not mounted at all, or
   - Mounted but height=0 / off-screen / clipped by overflow.

C) Fix the likely root: disable or defer Google Translate initialization
Given brand rules (“Great British English only”) and the observed runtime error:
1. Change useGoogleTranslate so it does NOT inject Google’s script on every page load.
2. Only load the Google Translate script when the user explicitly opens the language menu (on-demand).
3. Add defensive guards:
   - Don’t inject the script twice
   - Catch failures and don’t leave partial DOM changes behind
4. If translation is not required, we can also fully remove the language switcher entry point to eliminate the risk entirely (recommended for stability and consistency with “Great British English only”).

D) If debug panel shows clipping: fix the layout clipping directly
1. Identify the nearest parent container for the first “missing” section that has:
   - overflow: hidden/clip
   - position: absolute/fixed causing overlap
   - height constraints (e.g., h-screen / 100vh)
2. Adjust the responsible container styles so the document height expands normally and sections flow in order.

Verification steps (how we’ll know it’s fixed)
1. Desktop: confirm you can see, in order:
   Hero → MissionSection → Our Trusted Partners → Featured Publications …
2. Mobile (390x844): confirm MissionSection and PartnersGrid appear after Hero and are scrollable.
3. Console: confirm the Google Translate “Maximum call stack size exceeded” error no longer occurs on initial page load.
4. Remove debug UI after confirming (keep behind ?debug=sections if you want a permanent internal tool; otherwise delete it).

Files that will likely change
- src/pages/Index.tsx (temporary debug banner/panel hook-in)
- src/hooks/useGoogleTranslate.ts (defer/disable script injection, add guards)
- src/components/header/LanguageSwitcher.tsx (load-on-demand; or hide/remove if not needed)
- Potentially a layout component if clipping is found (e.g., MainLayout or a section wrapper)

What I need from you (so we don’t chase the wrong thing)
- Tell me the exact URL you are checking when you say “it’s not there”:
  - Is it the Lovable preview URL, or your custom domain (myhealthcheckup.co.uk), or something else?
  - If it’s the custom domain: you won’t see changes until you Publish.

If you approve this plan, I’ll switch to Default mode and implement the debug panel + the translate fix first (fastest to validate), then apply any layout fixes indicated by the debug readout.
