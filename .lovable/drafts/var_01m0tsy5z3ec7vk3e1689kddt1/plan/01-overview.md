# Fix the side-by-side comparison data for these four tests

The comparison table isn't wrong in how it renders — it's rendering exactly what the database holds, and the database rows are incomplete. Checks against the live provider pages confirm:

| Field | What we show | What the provider states |
| --- | --- | --- |
| Goodbody – Advanced Well Woman, biomarkers | 51 | 52 |
| London Medical Laboratory – Well Woman Premier Plus, biomarkers | 21 | 47 across the listed panels |
| Clinilabs – Essentials Female Hormone, collection fee | None | £30 phlebotomy at clinic (£50 for walk-ins) |
| All four – clinical review | Blank (—) | A written clinical/doctor's report is included |
| Goodbody – collection options | Single clinic line | In-clinic phlebotomy included in the £195 total, or home visit for £20 more |

Two of the underlying columns (`collection_fee_type`, `clinical_review_type`) are empty on every one of these four rows, which is why the table falls back to "None" and "—". That's the root cause of the fee and review columns, and it will affect other listings too.
