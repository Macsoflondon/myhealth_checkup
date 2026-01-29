

# Add Tagline Video Section

## Overview

Adding the uploaded video file "Your_health._Your_choice._One_trusted_platform!.mp4" as a new section positioned between:
- **FeaturedPublications** ("Our Partners Have Featured In" carousel)
- **MostPopularTestsSection** ("MOST POPULAR")

---

## Implementation Steps

### Step 1: Copy Video File to Public Directory

Copy the uploaded video to the public directory where other media assets are stored:

| Source | Destination |
|--------|-------------|
| `user-uploads://Your_health._Your_choice._One_trusted_platform!.mp4` | `public/tagline-video.mp4` |

---

### Step 2: Create New Video Section Component

Create a new component `TaglineVideoSection.tsx` in `src/components/sections/`:

**Design specifications:**
- Full-width video with responsive aspect ratio (16:9 on desktop, taller on mobile)
- Auto-play, muted, looping (standard for promotional videos)
- Dark navy background (#081129) to frame the video
- Clean section padding matching other sections (py-12 sm:py-16 md:py-20)
- Accessible with fallback text for browsers that don't support video

---

### Step 3: Update Homepage Layout

Modify `src/pages/Index.tsx` to:
1. Import the new `TaglineVideoSection` component
2. Place it between `<FeaturedPublications />` and `<MostPopularTestsSection />`

**Updated section order:**
1. Hero
2. MissionSection
3. PartnersGrid
4. JourneySimplified
5. FeaturedPublications
6. **TaglineVideoSection** (NEW)
7. MostPopularTestsSection
8. TopConcernsSection
9. FindClinicSection
10. HereToHelp
11. FinalCTA
12. TrustPlatformSection

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `public/tagline-video.mp4` | **CREATE** - Copy uploaded video |
| `src/components/sections/TaglineVideoSection.tsx` | **CREATE** - New video section component |
| `src/pages/Index.tsx` | **MODIFY** - Add import and place component |

---

## Technical Details

### TaglineVideoSection Component

```tsx
const TaglineVideoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              src="/tagline-video.mp4"
              aria-label="Your health. Your choice. One trusted platform."
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};
```

**Key features:**
- Responsive container with max-width for proper framing
- Rounded corners and shadow for visual polish
- Auto-play with muted audio (required for autoplay in browsers)
- Loops continuously for seamless viewing
- playsInline for mobile compatibility
- Accessible aria-label matching the video content

