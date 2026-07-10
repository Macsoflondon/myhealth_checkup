## Fix hero videos: continuous playback, clinic re-gen, animate slide 5

### 1. Re-generate clinic reception clip
Current clip has continuity issues (man vanishes mid-shot, receptionist mishandles paperwork). Regenerate with a tighter, more directive prompt so the AI produces one coherent take:

> "Live-action documentary footage, real people, no CGI, 35mm filmic grain. A couple (man and woman, both visible throughout the entire shot) walk together into a bright modern clinic reception. They approach the desk side by side. The woman hands a clipboard of paperwork to a smiling female receptionist. The receptionist takes the clipboard and neatly places it face-up into an open folder on the desk. Both the man and woman remain in frame the whole time. Warm natural lighting, shallow depth of field, stable subject identity, no morphing."

Use `videogen--generate_video` with `starting_frame: hero-clinic-reception.png`, `duration: 10`, `resolution: 1080p`, `aspect_ratio: 16:9`, `camera_fixed: true` (steadier framing helps identity persistence). QA the middle + last frame; regenerate once more if the man disappears again.

### 2. Generate video for slide 5 (blood test kit)
Prompt:
> "Live-action documentary, real person, no CGI, 35mm filmic grain. A woman sits at a bright kitchen table opening an at-home finger-prick blood test kit. She smiles softly, picks up the lancet, and calmly examines it. Warm morning light through a window, shallow depth of field, natural motion, stable identity."

Same technical settings as above. Upload via `lovable-assets` to `src/assets/hero/video/clip-blood-test-kit.mp4.asset.json`.

### 3. Continuous auto-playing sequence in HeroMasthead
Currently each slide is a separate `<video>` swapped by a `setInterval` timer, so playback restarts and can drift out of sync with the interval. Rework so the carousel feels like one continuous reel:

- Remove the fixed `rotateMs` interval-driven advance.
- Render **all** slides as `<video>` elements stacked in the same container, each `muted playsInline preload="auto"` and `autoPlay` on the active one only (others `paused` and hidden via `opacity: 0`).
- Advance to the next slide on the active video's `onEnded` event — this chains the 5 clips back-to-back so the user perceives one continuous, auto-playing sequence that loops (slide 5 `onEnded` → slide 0).
- Keep the label bubble and sales card animations keyed to the same slide index.
- Preload the next clip (`preload="auto"` on `i+1`) so transitions are seamless.
- Keep original PNG as `poster` on each `<video>` for instant paint / LCP.

Result: videos play through in order (jogger → clinic → seniors → bench → kit → loop), each auto-triggered by the previous one ending, giving a single continuous cinematic reel.

### 4. Also export updated stitched montage
Re-run ffmpeg to stitch the 5 clips (new clinic + new kit clip) into `/mnt/documents/hero-montage.mp4` with 0.5s crossfades, and surface via `<presentation-artifact>`.

### Technical details
- Files touched:
  - `src/components/sections/HeroMasthead.tsx` — replace timer-driven index with `onEnded`-chained playback; add 5th video import.
  - New asset: `src/assets/hero/video/clip-clinic-reception.mp4.asset.json` (overwrite existing asset pointer).
  - New asset: `src/assets/hero/video/clip-blood-test-kit.mp4.asset.json`.
- Respect `prefers-reduced-motion`: if reduced, keep current behaviour (posters only, no autoplay chain).
- No changes to routing, data layer, `_middleware.ts`, or `Index.tsx` preloads.
- Verify with `bunx tsgo --noEmit` and a Playwright screenshot at 390px + 1280px to confirm slide swaps still align with label + sales card.
