# Hero refinements

All edits stay inside `src/components/sections/HeroMasthead.tsx` (plus one new asset import for the heart). No business logic touched.

## 1. Image box: wider + cleaner edges
- Make the `.relative` carousel container break out of the section's `px-6 sm:px-9` padding so it spans the full width of the rounded white card. Use negative margins: `-mx-6 sm:-mx-9` on the carousel wrapper. Heads of the senior couple and the man on the bench then fit without cropping.
- Keep `object-cover` but add `scale-[1.04]` and `object-[center_30%]` on the `<img>` so the ~2% distorted border on the supplied photos is pushed off-screen while keeping faces in frame.
- Bump height from `h-[480px]` → `h-[520px]` so the wider aspect doesn't squash vertically and the extra height pulls the slogan/"P" gap tighter (see step 3).

## 2. Pearl-white surfaces
- Define `PEARL = "#fafaf7"`.
- Section background: `bg-white` → `bg-[#fafaf7]`.
- Ad-card background: `bg-white/95 backdrop-blur-md` → `bg-[#fafaf7]/95 backdrop-blur-md` (keep shadow + radius).

## 3. Headline + slogan spacing
- `<h1>Compare.</h1>`: change `mt-3 mb-[4.5rem]` → `mt-10 mb-3`. With the taller image box, the bottom of the "P" now sits just above the "TRUSTED" line.
- Slogan span: `text-sm` → `text-lg` (two Tailwind steps up: sm → base → lg). Tracking eased from `0.14em` → `0.12em` so it still fits one line on desktop.

## 4. Real heart logo in front of "myhealthcheckup"
- Import the already-uploaded asset: `import heartMark from "@/assets/brand/heart-mark.png.asset.json";`
- Delete the corrupt `HEART_MARK_B64` constant.
- `Wordmark`: `<img src={heartMark.url} … className="h-9 w-auto" />` (was `h-8`).

## 5. Billboard: provider logo + accurate rotating data
Replace the current `PICKS` array with a curated provider list and rebuild `buildAdverts()` to pull live entries directly from `realTestData`:

```text
ROTATION = [
  { provider: "Medichecks",                  testName: "Advanced Well Woman Blood Test",          category: "General Health" },
  { provider: "GoodBody Clinic",             testName: "<lookup first GoodBody test in data>",    category: "General Health" },
  { provider: "Lola Health",                 testName: "<lookup first Lola Health test>",         category: "Hormone" },
  { provider: "Thriva",                      testName: "<lookup first Thriva test>",              category: "General Health" },
  { provider: "Randox Health",               testName: "<lookup first Randox test>",              category: "General Health" },
  { provider: "London Medical Laboratory",   testName: "<lookup first LML test>",                 category: "General Health" },
]
```

For each entry: locate the test in `realTestData` by exact `Provider` + `Test Name`. If the named test is missing for that provider, fall back to the first `realTestData` row whose `Provider` matches — guaranteeing the displayed price, name and URL are always real and provider-accurate.

Map provider display name → key in `PROVIDER_LOGOS` (from `@/constants/providers`):
- Medichecks → `medichecks`
- GoodBody Clinic → `goodbody-clinic`
- Lola Health → `lola-health`
- Thriva → `thriva`
- Randox Health → `randox`
- London Medical Laboratory → `london-medical-laboratory`

Render change in the ad card footer (line ~162): replace the text `{ad.provider}{markers}` with:

```tsx
<img src={PROVIDER_LOGOS[ad.providerKey]} alt={ad.provider}
     className="h-5 w-auto max-w-[90px] object-contain" />
```

Markers count is dropped (was always 4 / null in the data anyway and clutters the row). Price + Compare CTA unchanged.

Rotation already advances every `rotateMs` (15 s). The ad uses the same index `i`, so logo + test + price + URL all rotate together — never stuck on Medichecks.

## Technical notes
- Single file edit: `src/components/sections/HeroMasthead.tsx`.
- New import: `heart-mark.png.asset.json` (already exists in `src/assets/brand/`) and `PROVIDER_LOGOS` from `@/constants/providers`.
- Type tweak: add `providerKey: keyof typeof PROVIDER_LOGOS` to the `Advert` interface.
- No data files, no routes, no other components affected.
