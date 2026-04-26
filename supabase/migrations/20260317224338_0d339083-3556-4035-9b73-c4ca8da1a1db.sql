-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own insights" ON public.health_insights;

-- Create a restrictive UPDATE policy: users can only update is_read on their own insights
-- We use a trigger to enforce that only is_read can be changed
CREATE OR REPLACE FUNCTION public.restrict_health_insights_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow changes to is_read field
  IF NEW.insight_type IS DISTINCT FROM OLD.insight_type
    OR NEW.title IS DISTINCT FROM OLD.title
    OR NEW.description IS DISTINCT FROM OLD.description
    OR NEW.priority IS DISTINCT FROM OLD.priority
    OR NEW.action_items IS DISTINCT FROM OLD.action_items
    OR NEW.expires_at IS DISTINCT FROM OLD.expires_at
    OR NEW.related_biomarkers IS DISTINCT FROM OLD.related_biomarkers
    OR NEW.related_test_results IS DISTINCT FROM OLD.related_test_results
    OR NEW.created_by IS DISTINCT FROM OLD.created_by
    OR NEW.user_id IS DISTINCT FROM OLD.user_id
  THEN
    -- Allow admins/moderators to update all fields
    IF public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Users may only update the is_read field on health insights';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_health_insights_update_restriction
  BEFORE UPDATE ON public.health_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_health_insights_update();

-- Recreate UPDATE policy scoped to own rows
CREATE POLICY "Users can mark own insights as read"
ON public.health_insights
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);