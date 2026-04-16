

## Plan: Edit 5 Hero Images Using AI Image Generation + Adjust Object Position

All five changes require editing the source `.jpg` files using the Nano banana AI image generation/editing API, then replacing the assets. One also needs a CSS `objectPosition` tweak.

### Image 1: `hero-empowered-results.jpg` — Woman with laptop
- **Edit prompt**: Make the woman have a natural, subtle smile/grin. Make the laptop screen clearly show "myhealth checkup" text at the top with visible biomarker names listed down the left side. Keep the image photorealistic — no AI/CGI look.

### Image 2: `hero-clinic-ease.jpg` — Woman with mobile phone  
- **Edit prompt**: Make the back of the mobile phone the woman is holding solid black — the phone is facing away from the viewer so no screen content should be visible, just a plain black phone back.

### Image 3: `hero-compare-decide.jpg` — Clinic scene
- **Edit prompt**: On the turquoise back wall, write "myhealth checkup" clearly in white text. Reduce the size of the staff name badge. Make the woman's face more photorealistic and natural-looking (early thirties).

### Image 4: `hero-home-kit.jpg` — Test kit
- **Edit prompt**: Move the test kit up and to the left so it's clearly visible in the upper-left area of the frame, not hidden behind UI elements. The kit should clearly show "myhealth checkup" branding and "Blood Test Kit" text on it. Keep photorealistic.

### Image 5: `hero-active-lifestyle.jpg` — Couple walking in park
- **No image edit** — just shift `objectPosition` from `center 30%` to `center 15%` to push the image down so their heads/faces sit lower in the frame (where the red circles are in the screenshot). This gives more sky/tree canopy above their heads.

### Technical approach
1. Use `secrets--fetch_secrets` to get the Lovable API key
2. For images 1–4: Call the Gemini image editing API with the source image + edit prompt
3. Save edited images back to `src/assets/hero/` replacing the originals
4. For image 5: Update `objectPosition` in `Hero.tsx` from `center 30%` to `center 15%`
5. QA each generated image by converting to viewable format and inspecting

### Limitation
AI image editing may not perfectly render readable text on screens/walls in one pass. If the first attempt is blurry or incorrect, I'll iterate with refined prompts. Multiple passes may be needed for the laptop screen and clinic wall text.

