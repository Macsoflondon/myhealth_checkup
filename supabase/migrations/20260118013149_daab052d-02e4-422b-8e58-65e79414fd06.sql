-- Security Fix: Add audit logging for health_insights INSERT operations
-- and restrict admin/moderator SELECT to prevent bulk data access

-- 1. Create an audit trigger function for health_insights
CREATE OR REPLACE FUNCTION public.audit_health_insights_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    action,
    record_id,
    new_data,
    created_at
  ) VALUES (
    auth.uid(),
    'health_insights',
    'INSERT',
    NEW.id,
    jsonb_build_object(
      'insight_type', NEW.insight_type,
      'title', NEW.title,
      'target_user_id', NEW.user_id,
      'priority', NEW.priority
    ),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create trigger to audit all health_insights inserts
DROP TRIGGER IF EXISTS audit_health_insights_insert_trigger ON public.health_insights;
CREATE TRIGGER audit_health_insights_insert_trigger
  AFTER INSERT ON public.health_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_health_insights_insert();

-- 3. Add policy to prevent admins from viewing ALL insights (separation of duties)
-- Admins should only see insights they created or that belong to them
-- First, add a created_by column if it doesn't exist
ALTER TABLE public.health_insights 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 4. Create policy for admins to only view insights they created (for audit purposes)
-- This prevents unauthorized aggregation of health patterns
CREATE POLICY "Admins can only view insights they created"
ON public.health_insights
FOR SELECT
TO authenticated
USING (
  -- Users can always see their own insights
  (auth.uid() = user_id)
  OR
  -- Admins can see insights they created (for auditing their own work)
  (has_role(auth.uid(), 'admin') AND created_by = auth.uid())
  OR
  -- Moderators can see insights they created
  (has_role(auth.uid(), 'moderator') AND created_by = auth.uid())
);

-- 5. Drop the old permissive policy
DROP POLICY IF EXISTS "Users can view their own insights" ON public.health_insights;

-- 6. Update INSERT policy to automatically set created_by
CREATE OR REPLACE FUNCTION public.set_health_insight_creator()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS set_health_insight_creator_trigger ON public.health_insights;
CREATE TRIGGER set_health_insight_creator_trigger
  BEFORE INSERT ON public.health_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.set_health_insight_creator();

-- 7. Add comment for documentation
COMMENT ON COLUMN public.health_insights.created_by IS 'User ID of the admin/moderator who created this insight - for audit trail';