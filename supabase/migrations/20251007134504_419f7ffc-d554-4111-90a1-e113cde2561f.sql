-- Insert additional clinic locations from clinics_master.json
INSERT INTO public.clinics (name, full_address, postal_code, latitude, longitude, provider_id) VALUES
('Britannia Pharmacy', 'Britannia Pharmacy, London', 'E14 3BT', 51.4951, -0.0180, 'london-medical-laboratory'),
('Tower Bridge Wellness Pharmacy', 'Tower Bridge Wellness Pharmacy, London', 'SE1 2NJ', 51.5045, -0.0759, 'london-medical-laboratory'),
('Green Light Pharmacy - Stepney', 'Green Light Pharmacy - Stepney, London', 'E1 4FG', 51.5186, -0.0478, 'london-medical-laboratory'),
('Sheel Pharmacy', 'Sheel Pharmacy, London', 'SE13 7PA', 51.4628, 0.0043, 'london-medical-laboratory'),
('LetterBoxPharmacy', 'LetterBoxPharmacy, London', 'E1 5LQ', 51.5144, -0.0406, 'london-medical-laboratory'),
('GOODWILL PHARMACY', 'GOODWILL PHARMACY, London', 'SE10 0BH', 51.4825, 0.0051, 'london-medical-laboratory'),
('Green Light Pharmacy - Bromley by Bow', 'Green Light Pharmacy - Bromley by Bow, London', 'E3 3FF', 51.5253, -0.0109, 'london-medical-laboratory'),
('My Private Chemist', 'My Private Chemist, London', 'EC2M 4NS', 51.5177, -0.0839, 'london-medical-laboratory'),
('Haggerston Pharmacy', 'Haggerston Pharmacy, London', 'E8 4HU', 51.5394, -0.0726, 'london-medical-laboratory')
ON CONFLICT DO NOTHING;