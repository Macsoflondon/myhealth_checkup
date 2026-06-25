
CREATE POLICY "Block anon read on notification_history"
ON public.notification_history
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anon write on notification_history"
ON public.notification_history
FOR INSERT
TO anon
WITH CHECK (false);
