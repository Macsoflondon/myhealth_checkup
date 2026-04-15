

## Plan: Fix Toolbar Sizing + Hero Border/Color Updates

### 1. Reduce toolbar navigation font sizes and padding
**File**: `src/components/header/NavigationMenu.tsx`

The nav items currently use `text-lg md:text-xl lg:text-xl xl:text-2xl font-bold` which is oversized. Reduce across all four render locations (dropdown button, link, more button):
- From: `text-lg md:text-xl lg:text-xl xl:text-2xl font-bold`
- To: `text-sm md:text-sm lg:text-base xl:text-lg font-semibold`

Also reduce padding from `px-2 md:px-2.5 lg:px-3 xl:px-3.5 py-1.5 md:py-2` to `px-1.5 md:px-2 lg:px-2.5 py-1 md:py-1.5` and chevron icons from `w-3 h-3 md:w-4 md:h-4` to `w-3 h-3`.

### 2. Reduce toolbar container padding
**File**: `src/components/layout/Header.tsx` (line 102)

Change toolbar vertical padding from `py-2` to `py-1`.

### 3. Hero CTA buttons — navy borders
**File**: `src/components/sections/Hero.tsx` (lines 136, 142, 148)

Change `border-white/20` to `border-[#081129]` on all three CTA buttons.

### 4. Hero search container — navy border
**File**: `src/components/sections/Hero.tsx` (line 155)

Change outer container `border-white/15` to `border-[#081129]`.

### 5. Search icon — white
**File**: `src/components/sections/Hero.tsx` (line 157)

Change `text-white/70` to `text-white`.

### 6. Search input placeholder — white
**File**: `src/components/sections/Hero.tsx` (line 164)

Change `placeholder:text-white/50` to `placeholder:text-white`.

### 7. "Popular Searches" label — white
**File**: `src/components/sections/Hero.tsx` (line 172)

Change `text-white/60` to `text-white`.

