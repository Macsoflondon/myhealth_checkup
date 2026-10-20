-- Strip stale fee wording from Medical Diagnosis collection_method text.
--
-- About 113 medical-diagnosis rows store text such as
--   "In-clinic appointment — venous blood draw (phlebotomy fee £21)".
-- The £21 is out of date. Collection fees now come from
-- public.provider_collection_fee_rules and are shown in their own row, so a
-- fee amount baked into collection_method can only ever be wrong.
--
-- Rollback: not automatically reversible, as the removed amount differed per
-- row only in principle. To restore, re-append the old wording, for example
--   UPDATE public.provider_tests
--      SET collection_method = collection_method || ' (phlebotomy fee £21)'
--    WHERE provider_id = 'medical-diagnosis'
--      AND collection_method = 'In-clinic appointment — venous blood draw';
-- or take the values from a pre-migration backup/PITR snapshot.

UPDATE public.provider_tests
   SET collection_method = regexp_replace(
         collection_method,
         '\s*\(phlebotomy fee £\d+(\.\d{2})?\)',
         '',
         'g'
       )
 WHERE provider_id = 'medical-diagnosis'
   AND collection_method ~ '\s*\(phlebotomy fee £\d+(\.\d{2})?\)';
