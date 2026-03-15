

## Fix Toolbar Background to Bright Pearl White

**Problem**: The navigation toolbar currently uses `bg-white/[0.92]` (92% opacity pearl white with transparency), which can appear inconsistent depending on what's behind it.

**Solution**: Change the toolbar background to a fixed, fully opaque bright pearl white — no transparency, just the solid pearl color.

**Change** in `src/components/layout/Header.tsx` (line ~86):
- Replace `bg-white/[0.92] backdrop-blur-2xl border-b border-white/30` with `bg-[hsl(220,5%,97%)] border-b border-gray-200/30`
- Remove `backdrop-blur-2xl` since we're going fully opaque — no need for blur
- Keep the shadow and other styling intact

This gives the toolbar a clean, solid pearl white background that's consistent regardless of scroll position or content behind it.

