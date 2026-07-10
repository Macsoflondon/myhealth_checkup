## Convert 4 hero images into looping 10s videos + montage

**Caps to know:** videogen tops out at 1080p (not 4K) and 10s per clip. I'll generate at 1080p 16:9 with realistic, cinematic prompts and use each image as the starting frame so the person/scene matches exactly (same face, same clothes, same lighting) — this is the key trick to avoid the "AI-generated look".

### The four clips

Starting frames pulled from the existing hero assets:

1. **Jogger** — `src/assets/hero/hero-jogging-woman.png`
   Prompt: continues jogging toward camera on the same path, natural arm swing, ponytail bouncing, breath visible, subtle handheld camera follow, warm golden-hour sun flare, real skin texture, shallow depth of field.

2. **Bench + phone (booking)** — `hero-bench-phone.png`
   Prompt: man on park bench looking down at phone, thumb scrolling and tapping, subtle smile as he confirms, slight head nod, gentle parallax push-in, ambient wind moving leaves, natural daylight.

3. **Senior couple in park** — `hero-senior-couple.png`
   Prompt: elderly couple walking arm-in-arm along path, gentle unhurried pace, brief glance and smile between them, slow dolly follow from behind-side, dappled sunlight through trees, autumn breeze in coats.

4. **Clinic reception greeting** — `hero-clinic-reception.png`
   Prompt: couple approaching reception desk, receptionist looks up and smiles warmly, brief handshake / clipboard handover, soft clinical lighting, quiet ambient depth-of-field, no text on signage changing.

Common realism directives on every prompt: *"live-action documentary footage, real people, no CGI, no morphing, natural micro-expressions, filmic grain, 35mm look, stable subject identity"*. `camera_fixed: false` for organic movement.

### Deliverables

- 4 individual MP4s → `src/assets/hero/video/` (uploaded via `lovable-assets` so they don't bloat the repo, `.asset.json` pointers committed).
- 1 stitched montage → `/mnt/documents/hero-montage.mp4` (four 10s clips concatenated with crossfades via ffmpeg — no re-encode of the source pixels beyond the crossfade, keeps quality).
- Presented back with a `<presentation-artifact>` for download.

### Hero carousel wiring (`src/components/sections/HeroMasthead.tsx`)

Replace the `<img>` slide element with a hybrid `<video>` / `<img>` renderer:

```tsx
{active ? (
  <video
    src={s.videoUrl}
    poster={s.src}
    autoPlay muted loop playsInline preload="metadata"
    className="hero-slide absolute inset-0 w-full h-full object-cover ..."
    style={{ opacity: active ? 1 : 0, objectPosition: /* existing focal points */ }}
  />
) : (
  <img src={s.src} .../* keeps LCP + fallback */ />
)}
```

Details:
- Only the active slide mounts as `<video>`; inactive slides stay as `<img>` posters. Keeps memory + bandwidth sane on the carousel rotation.
- `poster={s.src}` = the existing PNG, so the LCP `preload` in `Index.tsx` still fires and the first paint is instant.
- `preload="metadata"` on non-active videos.
- Respects `prefers-reduced-motion` — if true, keep `<img>` for all slides.
- Mobile: same treatment; `playsInline` + `muted` = auto-plays on iOS Safari.
- 5th slide (`bloodTestKit`) stays as an image since it wasn't in the four you named. Confirm if you'd like a 5th clip too.

### Technical section

- `videogen--generate_video` with `starting_frame` set to each hero PNG, `resolution: "1080p"`, `duration: 10`, `aspect_ratio: "16:9"`, `camera_fixed: false`.
- Each clip is ~8-15 MB at 1080p/10s. Uploaded via `lovable-assets create --file <mp4>` → pointer JSON committed at `src/assets/hero/video/<name>.mp4.asset.json`. Referenced in code via `videoAsset.url`.
- Montage: `ffmpeg -i clip1 -i clip2 -i clip3 -i clip4 -filter_complex "xfade transitions with 0.5s overlap" -c:v libx264 -crf 18 -preset slow /mnt/documents/hero-montage.mp4`. Final duration ~38.5s.
- Verify each clip visually before delivering: extract a middle frame per clip with `ffmpeg -ss 5 -i clip.mp4 -frames:v 1 /tmp/qa.jpg` and inspect. Regenerate any clip that shows morphing faces, extra limbs, or text drift.
- No changes to `Index.tsx` preload block — the video's `poster` is the same PNG, so LCP metric is unaffected.
- Bot/prerender path (`functions/_middleware.ts`) is unaffected since the fallback for crawlers is still the poster image.

### Order of ops

1. Generate 4 videos with `starting_frame` = each hero PNG.
2. QA middle frames; regenerate any that look off.
3. Upload each to CDN via `lovable-assets`, write `.asset.json` pointers.
4. Stitch montage with ffmpeg → `/mnt/documents/hero-montage.mp4`.
5. Update `HeroMasthead.tsx` `SLIDES` array with `videoUrl` field and render conditionally.
6. Build + smoke-check autoplay behaviour.

### Open question

If you want the 5th hero slide (blood test kit) animated too, say so — trivial to add another 10s clip and stitch it in.
