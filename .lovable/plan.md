

# Add Portraits Series from Providers Tests Project

## Overview
Port the "Portraits" (Cancer Screening) series from [Providers tests](/projects/1d7f8244-851a-4013-ab73-941c5f381b64) into this project. This involves creating the JSON data file, copying missing images, and updating image paths to match this project's `/images/tests/` structure.

## Step 1: Create directory and JSON file

Create `public/data/series/portraits.json` with the full series data, but update all `src` paths from `/images/X.png` to `/images/tests/X.png` to match this project's image directory structure.

## Step 2: Copy missing images from the other project

Cross-reference reveals these images need copying from [Providers tests](/projects/1d7f8244-851a-4013-ab73-941c5f381b64):

| Portraits JSON references | This project has | Action |
|---|---|---|
| `goodbody-logo.jpg` | No | Copy to `public/images/tests/goodbody-logo.jpg` |
| `episwitch-pse-v2.png` | No | Copy to `public/images/tests/episwitch-pse-v2.png` |
| `hpv-cervical-cancer.png` | `hpv-cervical-cancer-screening.png` | Update JSON path to use existing file |
| `guardant-360.png` | `guardant-360-cdx.png` | Update JSON path to use existing file |
| `prostate-psa.png` | `prostate-psa-blood-test.png` | Update JSON path to use existing file |
| `bowel-cancer.png` | `bowel-cancer-stool-test.png` | Update JSON path to use existing file |
| `guardant-reveal.png` | `guardant-reveal.png` ✓ | Path update only |
| `lung-cancer-screening.png` | `lung-cancer-screening.png` ✓ | Path update only |
| `early-cancer-screening.png` | `early-cancer-screening.png` ✓ | Path update only |

## Step 3: Also create the editorial.json

Create `public/data/series/editorial.json` with the user-provided Hormone & Fertility data, similarly updating all `src` paths to `/images/tests/`.

The editorial images all already exist in `public/images/tests/` — no copies needed.

## Step 4: Final portraits.json with corrected paths

```json
{
  "id": "portraits-01",
  "title": "Cancer Screening",
  "slug": "portraits",
  "images": [
    { "src": "/images/tests/goodbody-logo.jpg", ... },
    { "src": "/images/tests/lung-cancer-screening.png", ... },
    { "src": "/images/tests/episwitch-pse-v2.png", ... },
    { "src": "/images/tests/hpv-cervical-cancer-screening.png", ... },
    { "src": "/images/tests/early-cancer-screening.png", ... },
    { "src": "/images/tests/guardant-360-cdx.png", ... },
    { "src": "/images/tests/prostate-psa-blood-test.png", ... },
    { "src": "/images/tests/guardant-reveal.png", ... },
    { "src": "/images/tests/bowel-cancer-stool-test.png", ... }
  ]
}
```

## Files created/modified
- `public/data/series/portraits.json` — new file
- `public/data/series/editorial.json` — new file
- `public/images/tests/goodbody-logo.jpg` — copied from other project
- `public/images/tests/episwitch-pse-v2.png` — copied from other project

No component changes — the data files are standalone JSON that `PartnerShowcaseGrid` or any future consumer can load.

