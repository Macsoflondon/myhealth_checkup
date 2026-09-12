# Use the Lola Health add-on kit image consistently

## Outcome

Use the uploaded coral Lola Health **Add-on Blood Test** kit photograph whenever a Lola Health add-on appears on a test card, including:

- The homepage **Our Partners’ Most Popular Tests** filmstrip and cards.
- The **Most Popular Tests** page.
- Lola Health’s provider catalogue and other shared test-card grids.
- Any future card using the same shared card data.

Non-add-on Lola Health tests keep their own product images. Catalogue names, descriptions, prices, add-on rules and provider source data remain unchanged.

## Implementation

1. Upload the supplied kit photograph to the project’s managed image storage and import its pointer from one shared image resolver.
2. Add a small display-only rule: when `provider_id === "lola-health"` and `is_addon === true`, the shared resolver returns this kit image; otherwise it returns the row’s normal image.
3. Carry `is_addon` through the popular-test query and its card mappings, which currently omit that flag on the homepage and Most Popular Tests page.
4. Apply the resolver at the shared card boundary and the homepage’s custom filmstrip/card renderer, so Lola add-ons cannot fall back to an unpleasant scraped image on one surface while appearing correctly elsewhere.
5. Keep the database `image_url` untouched; this is a presentation rule for Lola add-ons only and will not be overwritten by scrapers.
6. Add this task to the project roadmap alongside the in-progress Allergy Complete work.

## Verification

- Confirm a Lola Health add-on uses the supplied kit image on the homepage filmstrip and card.
- Confirm the same add-on uses it on the Most Popular Tests page and Lola provider catalogue.
- Confirm a non-add-on Lola Health test still uses its existing image.
- Check desktop and mobile layouts, image fit, alt text and broken-image fallback.
- Run focused tests and strict type checking after completing the existing Allergy Complete correction.
