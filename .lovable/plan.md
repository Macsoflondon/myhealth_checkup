## Hero Section Animation & Slide Label Restyle

### 1. Heading entrance animation
- Animate the word **"Compare"** with a fade-in (`animate-fade-in`) on initial load.
- Animate the **turquoise dot** with a subtle delayed pop-in (scale-up + fade-in, ~0.3 s delay, ~0.2 s duration) — noticeable but not over-the-top.
- Add the keyframes to the project's CSS/animation config (or Tailwind extend if a custom keyframe is needed).

### 2. Slide label bubble cleanup
- Remove the bubble container styling: `rounded-full`, `bg-[#081129]/45`, `backdrop-blur-sm`, `border`, `px-5`, `py-3`.
- Remove the turquoise dot `<span>` that sits in front of the label text.
- Keep the slide label text itself.
- Add a subtle `text-shadow` (or Tailwind `drop-shadow`) to the label text so it remains readable over the hero images.

### No new dependencies required.

### Files to change
- `src/components/sections/HeroMasthead.tsx` — markup and animation classes
- Tailwind config or global CSS — custom pop-in keyframe for the dot (if not covered by existing utilities)