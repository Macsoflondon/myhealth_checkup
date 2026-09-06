# Hide the £1 placeholder cards and the Randox ECG

Narrow, targeted fix. Nothing else in the catalogue is touched — Lola Health, Medichecks, Goodbody, Clinilabs, London Medical Laboratory, London Health Company and every other Medical Diagnosis test stay exactly as they are.

## What gets hidden

Four cards in total, all currently live:

- **Stool Bacteria and Parasites PCR** — Medical Diagnosis, showing £1.00
- **Chlamydia Trachomatis PCR** — Medical Diagnosis, showing £1.00
- **Chlamydia trachomatis / Neisseria gonorrhoea PCR / Trichomonas vaginalis PCR** — Medical Diagnosis, showing £1.00
- **ECG Test** — Randox Health, £120.00, not a blood test

The £1.00 figures are placeholders published in the provider's own product feed for lab components rather than real consumer prices, so the cards are misleading as they stand.

## How

Each of the four is marked inactive by its own database record, one row at a time, by exact name and provider. No bulk rule, no pattern matching, no deletion — the rows stay in place and can be switched back on at any time.

## Verification

After the change: confirm the count of live tests per provider drops only by those four (Medical Diagnosis 157 to 154, Randox 67 to 66, everyone else unchanged), and confirm the four cards no longer appear in listings.
