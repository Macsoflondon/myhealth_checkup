

## Fix Hero Headline Line Breaks

### Problem
The headline is wrapping awkwardly at the current font sizes, causing "private" to drop onto its own line, creating 4 lines instead of the intended 3.

### Solution
Restructure the H1 into 3 explicit lines with `<br />` tags:

- **Line 1**: "Compare the UK's leading private" (navy)
- **Line 2**: "health test providers -" (navy)
- **Line 3**: "All in one place!" (pink)

### Changes in `src/components/sections/Hero.tsx`

Replace the current H1 content:
```tsx
<span className="text-brand-navy">Compare the UK's leading private</span>
<br />
<span className="text-brand-navy">health test providers - </span><span className="text-brand-pink">All in one place!</span>
```

With:
```tsx
<span className="text-brand-navy">Compare the UK's leading private</span>
<br />
<span className="text-brand-navy">health test providers - </span>
<br />
<span className="text-brand-pink">All in one place!</span>
```

Also slightly reduce the largest font sizes to prevent "Compare the UK's leading private" from wrapping on standard desktop widths. Adjust from `lg:text-[3.25rem] xl:text-[3.75rem]` down to `lg:text-[2.75rem] xl:text-[3.25rem]` so the first line fits comfortably on one line.

### File modified

| File | Change |
|---|---|
| `src/components/sections/Hero.tsx` | Add `<br />` before "All in one place!", reduce lg/xl font sizes slightly |

