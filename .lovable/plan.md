## Swap the At-Home Test Kits image, and reuse the current kit image for Blood Tests & Panels

### Changes
1. Generate a new finger-prick blood collection image (matching the uploaded reference: hand with pricked finger over an at-home kit) and upload as a Lovable Asset.
2. In `src/components/sections/TestCategoriesSection.tsx`:
   - **At-Home Test Kits card** → use the newly generated finger-prick image.
   - **Blood Tests & Panels card** → swap from the current `blood-test-tubes` asset to the existing Unsplash kit photo (`photo-1612277795421-9bc7706a4a34`) currently used by the At-Home card, since that one better suits blood testing panels per your note.

### Notes
- The existing `blood-test-tubes` asset stays in place (unused on this section) in case it's needed elsewhere.
- New asset will be saved to `src/assets/at-home-fingerprick.jpg.asset.json`.

Confirm and I'll switch to build mode.
