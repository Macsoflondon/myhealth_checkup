# Correct the Allergy Complete card and detail popup

## Outcome

For London Medical Laboratory’s **Allergy Complete** test:

- Change the finger-prick home kit charge from **“Included”** to **“+£3.99”**.
- Keep the clinic blood draw at **“+£35”**.
- Change the home phlebotomist visit to **“+£80”**.
- Replace the duplicated collection sentence with exactly: **“Finger-prick home kit or venous clinic draw or home phlebotomy visit”**.
- Show **295 allergens** in the headline, rather than 24.
- Keep the 24 currently captured allergen names, but label the list honestly as **24 of 295 published by the provider** until all individual names are captured.

## Confirmed cause

The active database row already holds the correct £329 base price, +£35 clinic fee and +£80 home-visit fee. The popup ignores those row-level fees when `collection_options` is empty and substitutes a generic London Medical Laboratory fallback containing “Included” and +£45.

The row also holds a partial list of 24 allergen names. The popup uses that array length as the headline count, overriding the provider’s published total of 295. The provider page currently confirms 295 allergens, £3.99 home-kit postage, £35 clinic collection and £80 home phlebotomy.

## Implementation

1. **Correct the active catalogue row**
   - Set `biomarker_count` to 295 and `measurement_type` to `allergens`.
   - Store the three exact collection options and charges in `collection_options`.
   - Store the cleaned collection wording requested above.
   - Leave the £329 test price, description and existing 24 captured allergen names unchanged.

2. **Make the popup data-driven**
   - Prefer each test row’s `collection_options`, `clinic_phlebotomy_cost` and `home_phlebotomy_cost` over provider-wide fallback prices.
   - Pass the stored fee fields through the provider-card data shape.
   - Remove the redundant sample-prefix construction when a complete collection sentence/options already exists.
   - Use `biomarker_count` for the headline total; use the captured array only for the expandable names list.

3. **Prevent the next scrape from undoing the correction**
   - Update the London Medical Laboratory product-page parser to capture the published allergen total and collection charges.
   - Preserve partial allergen names without replacing the published total with the partial array length.
   - Persist the exact collection options on future refreshes.

## Verification

- Open the Allergy Complete popup from the London Medical Laboratory profile.
- Confirm the header reads **295 allergens**.
- Confirm the collection line has only the requested wording.
- Confirm charges show **+£3.99**, **+£35** and **+£80**.
- Confirm the allergen list states that 24 of 295 names are currently shown/captured.
- Run focused parser/unit tests, type checking, and desktop/mobile browser checks.
