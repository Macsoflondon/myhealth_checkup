
# Clinic Data Import Plan

## Current State

| Metric | Value |
|--------|-------|
| Clinics in database | 43 |
| Target | 100+ |
| Clinics in import file | 379 |
| Gap to close | 57+ clinics needed |

### Current Provider Distribution
- London Medical Laboratory: 12
- Medichecks: 11
- Goodbody Clinic: 9
- Randox: 8
- Unassigned: 3

### Import File Breakdown
The `clinics_import_data.json` contains 379 clinics including:
- Tuli Health pharmacy partners: ~70+ clinics
- Ultrasound Direct locations: ~15 clinics
- Superdrug Nurse Clinics: ~5 clinics
- Independent clinics and aesthetics: ~200+
- Other named providers: ~50+

---

## Issue Identified

The `bulk-add-clinics` edge function is missing a provider mapping for **Tuli Health** clinics. Looking at the import data, approximately 70+ clinics are named "Tuli Health - [Pharmacy Name]" but the function will incorrectly classify them as "independent" instead of "tuli-health".

### Current Provider Detection (Missing Tuli)
```javascript
// Current function checks for:
- superdrug
- ultrasound direct
- medichecks
- goodbody
- randox
- london medical
- lola
- thriva
// ❌ Missing: tuli
```

---

## Implementation Steps

### Step 1: Update Provider Detection
Add Tuli Health to the `determineProvider()` function in `bulk-add-clinics`:

```javascript
if (name.includes('tuli')) return 'tuli-health';
```

This ensures the 70+ Tuli Health pharmacy partners are correctly categorised.

### Step 2: Deploy Updated Edge Function
Deploy the updated `bulk-add-clinics` function to enable correct provider assignment.

### Step 3: Execute Import via Admin UI
Navigate to `/admin/quick-clinic-import` while logged in as admin and click "Import Pre-Collected Clinic Data".

The import process:
1. Fetches `/clinics_import_data.json` (379 clinics)
2. For each clinic:
   - Determines provider from name
   - Geocodes address via Nominatim API
   - Inserts into `clinics` table
3. Rate-limited at 1 second per clinic to respect Nominatim limits
4. Total time: ~6-7 minutes

### Step 4: Handle Duplicates
The current function uses simple INSERT which will fail on duplicates. We should add upsert logic or duplicate checking to handle clinics that may already exist.

---

## Technical Changes Required

### File: `supabase/functions/bulk-add-clinics/index.ts`

**Change 1**: Add Tuli Health provider mapping

```javascript
function determineProvider(clinicName: string): string {
  const name = clinicName.toLowerCase();
  
  // Add Tuli Health check (high priority - many clinics)
  if (name.includes('tuli')) return 'tuli-health';
  
  // ... existing checks
}
```

**Change 2**: Add duplicate handling with upsert

```javascript
const { error } = await supabase
  .from('clinics')
  .upsert({
    name: clinic.name,
    full_address: clinic.fullAddress,
    postal_code: clinic.postalCode,
    latitude,
    longitude,
    provider_id: providerId,
    access_note: clinic.appointmentRequired ? 'Appointment required' : 'No appointment required'
  }, {
    onConflict: 'name,postal_code',
    ignoreDuplicates: true
  });
```

---

## Expected Outcomes

After successful import:

| Metric | Before | After |
|--------|--------|-------|
| Total clinics | 43 | 400+ |
| Tuli Health | 0 | 70+ |
| Ultrasound Direct | 0 | 15+ |
| Superdrug | 0 | 5+ |
| Independent/Other | 3 | 200+ |
| Target met | No | Yes (100+ achieved) |

### Geographic Coverage
The import includes clinics across:
- Scotland (Edinburgh, Glasgow, Paisley, Kirkwall)
- Northern Ireland (Enniskillen)
- Wales (implied in nationwide coverage)
- England (London, Manchester, Birmingham, Bristol, etc.)

---

## Risk Considerations

1. **Geocoding Rate Limits**: Nominatim has a 1 request/second limit. The function already respects this with 1-second delays.

2. **Import Duration**: 379 clinics × 1 second = ~6-7 minutes total processing time.

3. **Partial Failures**: If geocoding fails for a clinic, it's still inserted with NULL coordinates. These can be geocoded later.

4. **Duplicate Handling**: Current function will error on duplicates. The upsert change will handle this gracefully.

---

## Verification Queries

After import, verify with:

```sql
-- Total count
SELECT COUNT(*) as total_clinics FROM clinics;

-- By provider
SELECT provider_id, COUNT(*) as count 
FROM clinics 
GROUP BY provider_id 
ORDER BY count DESC;

-- Geocoding success rate
SELECT 
  COUNT(*) as total,
  COUNT(latitude) as geocoded,
  ROUND(COUNT(latitude)::numeric / COUNT(*)::numeric * 100, 1) as geocoded_pct
FROM clinics;

-- Geographic distribution
SELECT 
  LEFT(postal_code, 2) as area,
  COUNT(*) as clinics
FROM clinics
WHERE postal_code IS NOT NULL
GROUP BY LEFT(postal_code, 2)
ORDER BY clinics DESC
LIMIT 20;
```
