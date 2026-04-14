

## Plan: Make Popular Searches Container Thinner, Narrower, and More Transparent

### Change
Edit line 171 of `src/components/sections/Hero.tsx` to update the Popular Searches inner container:

- **Thinner**: Reduce vertical padding from `p-4 sm:p-5` to `p-2.5 sm:p-3`
- **Narrower**: Add `max-w-[90%] mx-auto` to constrain width
- **More transparent**: Change `bg-white/10` to `bg-white/5` and reduce shadow opacity

Also reduce the label margin on line 172 from `mb-3` to `mb-2`.

### File modified
- `src/components/sections/Hero.tsx` — lines 171-172, className updates only

