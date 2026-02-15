

# Footer Redesign -- Align with Platform Design System

## Current Issues

1. **No column headings** -- link groups lack context; other sections use turquoise uppercase labels with flanking lines
2. **No glassmorphism styling** -- the footer uses plain navy whereas the sections immediately above it (Trust Platform, Featured Publications) use bg-white/5 cards with backdrop-blur and turquoise/pink accent borders
3. **Missing legal links** -- Privacy Policy, Terms and Conditions, Modern Slavery Statement, and Affiliate Disclosure pages exist but are not linked from the footer
4. **Social icons are oversized** (54x54px SVGs) and visually heavy compared to the refined card-based style elsewhere
5. **Brand bar at the bottom** is cramped on mobile -- logo, brand name, and slogan all on one flex row
6. **Cookie Policy** is listed under category links (health topics) instead of with legal/company links

## Design Approach

Apply the same visual language used in TrustPlatformSection and FeaturedPublications:

- **Navy background** (#081129) with subtle decorative glow orbs (turquoise/pink at 5% opacity)
- **Top gradient divider** -- 3px gradient line (turquoise-to-pink) separating footer from content, matching FeaturedPublications
- **Column headings** -- turquoise uppercase tracking-wide labels with flanking line dividers (same pattern as "As Seen In", "Why Trust Us")
- **Glassmorphism link groups** -- each column wrapped in bg-white/5 backdrop-blur-sm rounded-2xl cards with border-white/10
- **Smaller, uniform social icons** -- 36x36px with bg-white/10 circular containers and hover:bg-white/20 transition
- **Four-column grid** restructured: Health Tests | Company | Legal | Connect
- **Brand bar** stacked vertically on mobile for readability

## New Column Structure

```text
+------------------+------------------+------------------+------------------+
| HEALTH TESTS     | COMPANY          | LEGAL            | CONNECT          |
|                  |                  |                  |                  |
| Men's Health     | About Us         | Privacy Policy   | Follow Us        |
| Women's Health   | How It Works     | Terms & Conds    | [IG] [FB] [TT]   |
| Heart Health     | Our Providers    | Cookie Policy    |                  |
| Diabetes         | Clinic Locations | Accessibility    | Compliance       |
| Thyroid          | FAQs             | Modern Slavery   | [ICO/CH badge]   |
| Fertility        | Blog             | Affiliate Disc.  | [Cyber Ess.]     |
|                  | Contact          |                  |                  |
+------------------+------------------+------------------+------------------+
| Disclaimer + Company Info centred across full width                       |
+------------------+------------------+------------------+------------------+
| Copyright + Brand Bar                                                    |
+---------------------------------------------------------------------------+
```

## Technical Changes

**Single file modified:** `src/components/layout/Footer.tsx`

### Step 1 -- Restructure link arrays
- Move Cookie Policy from `categoryLinks` to a new `legalLinks` array
- Add Privacy Policy (/privacy), Terms (/terms), Modern Slavery (/modern-slavery-statement), Affiliate Disclosure (/affiliate-disclosure) to `legalLinks`

### Step 2 -- Add glassmorphism column wrapper
- Each link group wrapped in a card: `bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6`
- Column heading styled as: `text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-4`

### Step 3 -- Top gradient divider
- Add `h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise` above the main footer section

### Step 4 -- Decorative glow orbs
- Add two absolute-positioned blur circles (turquoise/5 and pink/5) matching TrustPlatformSection pattern

### Step 5 -- Redesign social icons
- Reduce to 36x36px
- Wrap each in a `w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all` container
- Keep SVGs but simplified and smaller

### Step 6 -- Connect column
- Social icons and compliance badges grouped together in the rightmost column
- Compliance badges remain the same assets but placed inside the glassmorphism card

### Step 7 -- Disclaimer row
- Full-width centred row below the 4-column grid
- `bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4` card
- Important disclaimer in pink, company info in white/80

### Step 8 -- Brand bar
- Stack logo + brand name on one line, slogan on a second line on mobile
- Use `flex-col sm:flex-row` for responsive layout

### Step 9 -- Copyright line
- Keep pink (#e70d69) styling, add additional legal quick links (Privacy | Terms | Accessibility)

No new files created. No new dependencies. Existing compliance badge assets reused.
