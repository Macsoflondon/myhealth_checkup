

## Plan: Fix BackToTop Button Visibility

### Problem
The BackToTop button exists in the DOM but is invisible. The root cause is a CSS class conflict: the `Button` component passes all classes through `cn()` (which uses `tailwind-merge`). The button's base class `-translate-y-1/2` and conditional classes `translate-x-0` / `translate-x-4` are being merged with the Button component's internal styles, causing the transform to break.

### Solution
Replace the `Button` component in `BackToTop.tsx` with a plain `<button>` element. This avoids the `tailwind-merge` issue entirely and removes the unnecessary ripple effect wrapper. The same visual styles (turquoise bg, pink hover, rounded, shadow) will be applied directly.

### File: `src/components/common/BackToTop.tsx`

Replace the `Button` import and usage with a plain `<button>`:

```tsx
const BackToTop = () => {
  // ... same state/effect logic ...

  return (
    <button
      onClick={scrollToTop}
      className={`fixed top-1/2 -translate-y-1/2 right-6 z-[60] h-12 w-12 rounded-full bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};
```

Key changes:
- Use plain `<button>` instead of `<Button>` to bypass `tailwind-merge` conflicts
- Remove `translate-x-0` / `translate-x-4` toggle (unnecessary, opacity alone handles show/hide)
- Add `flex items-center justify-center` for icon centering
- Remove `p-0` (no longer needed without Button's default padding)

This is a single-file, ~5-line change.

