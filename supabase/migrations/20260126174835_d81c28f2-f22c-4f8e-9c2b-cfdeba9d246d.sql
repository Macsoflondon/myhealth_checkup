-- Add DELETE policy to appointments table
-- Using Option 2: Prevent deletion for healthcare compliance
-- Users should cancel appointments via status update, not delete

-- Create policy to prevent user deletion (maintain audit trail)
CREATE POLICY "Appointments cannot be deleted by users"
  ON public.appointments FOR DELETE
  USING (false);

-- Allow admins to delete appointments if absolutely necessary
CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));