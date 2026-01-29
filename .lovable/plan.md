

# Redesign TaglineVideoSection with Dual Video Layout

## Overview

Redesigning the TaglineVideoSection to feature two side-by-side video cards - one for the current "Your health. Your choice." tagline video, and one for a future Medichecks provider video. The design will be fully responsive across all devices and visually polished to match the platform's design system.

## Design Approach

### Layout Structure
- **Desktop (lg+)**: Two videos side-by-side in a 50/50 grid
- **Tablet (md)**: Two videos side-by-side, slightly smaller
- **Mobile (sm and below)**: Videos stack vertically, full width

### Visual Design
- Dark navy background (#081129) with subtle gradient overlay
- White/light card containers for each video with rounded corners and shadows
- Optional labels below each video (e.g., "myhealth checkup" and "Medichecks")
- Consistent padding matching other sections (py-12 sm:py-16 md:py-20)
- Hover effects on video cards for interactivity

### Video Behaviour
- Auto-play, muted, looping (standard for promotional content)
- `playsInline` for mobile compatibility
- `object-contain` to show full video without cropping
- Fallback text for unsupported browsers

---

## Technical Implementation

### File Changes

| File | Action |
|------|--------|
| `src/components/sections/TaglineVideoSection.tsx` | **MODIFY** - Complete redesign with dual video layout |

### Component Structure

```
TaglineVideoSection
├── Section wrapper (navy background with gradient)
├── Container with max-width
├── Optional section heading
└── Video grid (2 columns on desktop, 1 on mobile)
    ├── Video Card 1: myhealth checkup tagline
    │   ├── Video container with rounded corners
    │   ├── Video element (tagline-video.mp4)
    │   └── Label: "myhealth checkup"
    └── Video Card 2: Medichecks (placeholder for now)
        ├── Video container with rounded corners
        ├── Video element (placeholder or same video)
        └── Label: "Medichecks"
```

### Key Styling

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Grid | `grid-cols-2` | `grid-cols-2` | `grid-cols-1` |
| Gap | `gap-8` | `gap-6` | `gap-6` |
| Video aspect | 16:9 | 16:9 | 16:9 |
| Card padding | `p-4` | `p-3` | `p-3` |
| Card background | White with shadow | White with shadow | White with shadow |

### Placeholder Approach

Since the Medichecks video is not yet uploaded, the second video card will:
1. Display a placeholder state with the Medichecks logo or a "Coming Soon" message
2. OR temporarily use the same tagline video as a visual placeholder
3. Be easily updatable when the Medichecks video is provided

---

## Responsive Breakpoints

```text
Mobile (< 640px)
┌─────────────────────────┐
│   ┌─────────────────┐   │
│   │  Video 1        │   │
│   │  (tagline)      │   │
│   └─────────────────┘   │
│   myhealth checkup      │
│                         │
│   ┌─────────────────┐   │
│   │  Video 2        │   │
│   │  (Medichecks)   │   │
│   └─────────────────┘   │
│   Medichecks            │
└─────────────────────────┘

Tablet/Desktop (≥ 768px)
┌─────────────────────────────────────────────┐
│   ┌──────────────────┐  ┌──────────────────┐│
│   │  Video 1         │  │  Video 2         ││
│   │  (tagline)       │  │  (Medichecks)    ││
│   └──────────────────┘  └──────────────────┘│
│   myhealth checkup         Medichecks       │
└─────────────────────────────────────────────┘
```

---

## Brand Alignment

- Background: Navy #081129
- Card backgrounds: White #ffffff
- Labels: Turquoise #22c0d4 or Navy #081129
- Hover accents: Pink #e70d69
- Shadows: Subtle elevation for depth
- Border radius: `rounded-2xl` (16px) matching Material Design 3 system

---

## Outcome

A polished, responsive dual-video section that:
1. Displays the current tagline video on the left
2. Provides a placeholder/ready slot for Medichecks video on the right
3. Scales beautifully across mobile, tablet, and desktop
4. Matches the platform's design language and brand colours
5. Is easily updatable when the second video is uploaded

