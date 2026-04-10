

## Permanently Delete Deactivated Tests from Database

**What**: Delete 7 deactivated test rows from `provider_tests` table permanently.

**Tests to delete**:
1. ECG Heart Monitor - Track Your Heart Health
2. Ear Wax Microsuction - book in your nearest clinic
3. Goodbody Clinic - Private Health Tests
4. Full Body MRI Scan - Comprehensive Health Insights
5. Full Body MRI Scan Services | Book with Goodbody Clinic
6. MRI Scan - Part Body for Accurate Imaging
7. Oncologist Consultation

**How**: Create a Supabase migration with a `DELETE` statement targeting these 7 rows by their IDs:

```sql
DELETE FROM provider_tests WHERE id IN (
  'fef653bb-f12c-47a0-992d-7ac87bb2c22b',
  'd3bb0ea4-6018-4fe3-8f3b-aaa0769a602f',
  '0eb6011f-7aed-4261-a2fe-ee144be52587',
  '99c2d85c-811b-47ee-b16a-396006127ca0',
  '916ed7db-c45a-4f01-8dfd-f2dbbb5aa9da',
  'f561c02d-4262-4453-b1b6-aa6f9340afa0',
  'b89fe1bd-4481-4db4-a03f-844533367662'
);
```

**Risk**: Low. These tests are already deactivated and not visible on the platform. Deletion is permanent — they cannot be recovered without re-scraping or manual re-entry.

