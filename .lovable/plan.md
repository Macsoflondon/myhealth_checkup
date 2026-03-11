

## Remove WhyChooseUs and TopConcernsSection from Homepage

Three files to change:

### 1. `src/pages/Index.tsx`
- Remove `import WhyChooseUs` (line 16) and `import TopConcernsSection` (line 22)
- Remove the TopConcernsSection JSX block (lines 134-135)
- Remove the WhyChooseUs JSX block (lines 144-145)

### 2. `src/components/sections/WhyChooseUs.tsx`
- Delete this file entirely

### 3. `src/components/sections/index.ts`
- Remove the WhyChooseUs export (no line exists currently, but clean up if present)
- Keep TopConcernsSection export so it remains available for future use

TopConcernsSection component file stays in the codebase untouched — available for reuse later.

