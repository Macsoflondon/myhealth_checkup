
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('d9f18008-53f2-4bc5-a034-a12954445370', 'admin'),
  ('d9f18008-53f2-4bc5-a034-a12954445370', 'user')
ON CONFLICT (user_id, role) DO NOTHING;
