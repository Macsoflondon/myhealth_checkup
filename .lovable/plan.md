

# Alternating Logo with Glow Effect

## Overview

Implement a logo that alternates between the turquoise and pink variants every 30 seconds, with a pulsing glow/water effect behind it that matches the current logo colour.

---

## What Will Change

### 1. Add New Logo Assets to Project

Save the two uploaded logo images to the assets folder:
- `logo-turquoise.png` - Turquoise "checkup" variant
- `logo-pink.png` - Pink "checkup" variant

### 2. Create Animated Logo Component

Build a new `AnimatedLogo.tsx` component that:
- Cycles between the two logo images every 30 seconds
- Displays a pulsing glow effect behind the logo
- Matches the glow colour to the current logo (turquoise or pink)
- Includes smooth crossfade transitions between logos

### 3. Update Header Component

Replace the static logo in `Header.tsx` with the new `AnimatedLogo` component for both mobile and desktop views.

---

## Technical Details

### New Component: `src/components/header/AnimatedLogo.tsx`

```text
+------------------------------------------+
|                                          |
|   ┌────────────────────────────────┐     |
|   │   Pulsing Glow Layer (behind)  │     |
|   │   - Turquoise or Pink          │     |
|   │   - Opacity animation 0.3-0.6  │     |
|   │   - blur(20px)                 │     |
|   └────────────────────────────────┘     |
|                                          |
|   ┌────────────────────────────────┐     |
|   │   Logo Image (foreground)      │     |
|   │   - Crossfade transition       │     |
|   │   - 30s interval switch        │     |
|   └────────────────────────────────┘     |
|                                          |
+------------------------------------------+
```

**State Management:**
- `currentLogoIndex` - Tracks which logo is active (0 = turquoise, 1 = pink)
- `useEffect` with `setInterval` for 30-second switching
- CSS transitions for smooth crossfade between logos

**Glow Effect Implementation:**
- Positioned `::before` pseudo-element or absolute div
- Uses existing CSS variables: `--shadow-glow-teal` and `--shadow-glow-pink`
- Pulsing animation keyframes for breathing effect

### CSS Additions to `src/index.css`

```css
@keyframes logo-glow-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.logo-glow-turquoise {
  box-shadow: 0 0 30px hsl(187 72% 48% / 0.5), 
              0 0 60px hsl(187 72% 48% / 0.3),
              0 0 90px hsl(187 72% 48% / 0.2);
  animation: logo-glow-pulse 3s ease-in-out infinite;
}

.logo-glow-pink {
  box-shadow: 0 0 30px hsl(335 89% 48% / 0.5), 
              0 0 60px hsl(335 89% 48% / 0.3),
              0 0 90px hsl(335 89% 48% / 0.2);
  animation: logo-glow-pulse 3s ease-in-out infinite;
}
```

### Header.tsx Changes

**Before:**
```tsx
<img 
  alt="myhealth checkup" 
  className="h-32 lg:h-40 xl:h-48 w-auto object-contain" 
  src={myhealthLogo} 
/>
```

**After:**
```tsx
<AnimatedLogo 
  className="h-32 lg:h-40 xl:h-48" 
/>
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/assets/logo-turquoise.png` | Turquoise logo variant |
| `src/assets/logo-pink.png` | Pink logo variant |
| `src/components/header/AnimatedLogo.tsx` | New animated logo component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add glow pulse animation keyframes and utility classes |
| `src/components/layout/Header.tsx` | Replace static logo with AnimatedLogo component |

---

## Animation Timeline

```text
0s        30s       60s       90s
|---------|---------|---------|
Turquoise  Pink     Turquoise  Pink
   ↑         ↑         ↑         ↑
   └─ Glow matches current logo colour
```

---

## Accessibility Considerations

- Respects `prefers-reduced-motion` - glow pulse disabled, logo still alternates
- Alt text maintained for screen readers
- No impact on navigation or functionality

