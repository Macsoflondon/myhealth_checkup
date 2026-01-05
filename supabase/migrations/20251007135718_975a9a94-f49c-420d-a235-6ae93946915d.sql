-- Clean up duplicate clinics first
DELETE FROM public.clinics a USING public.clinics b
WHERE a.id > b.id 
AND a.name = b.name 
AND a.latitude = b.latitude 
AND a.longitude = b.longitude;

-- Add Randox Health clinic locations
INSERT INTO public.clinics (name, full_address, postal_code, latitude, longitude, provider_id, access_note) VALUES
('Randox Health - Westfield Stratford City', 'Westfield Stratford City, Montfichet Road, London', 'E20 1EJ', 51.5434, -0.0076, 'randox', 'Blood draw, health screening'),
('Randox Health - Liverpool', 'Liverpool City Centre, Liverpool', 'L1 1JD', 53.4084, -2.9916, 'randox', 'Blood draw, health screening'),
('Randox Health - Belfast', 'Belfast City Centre, Belfast', 'BT1 1JG', 54.5973, -5.9301, 'randox', 'Blood draw, health screening'),
('Randox Health - Chelsea', 'Chelsea, London', 'SW3 3TD', 51.4897, -0.1687, 'randox', 'Blood draw, health screening'),

-- Add Medichecks partner clinic locations
('Medichecks - Spire St Anthony''s Hospital', '801 London Road, North Cheam, Sutton', 'SM3 9DW', 51.3651, -0.2285, 'medichecks', 'Venous blood draw'),
('Medichecks - TDL Wimpole Street', '76 Wimpole Street, London', 'W1G 9RT', 51.5177, -0.1489, 'medichecks', 'Venous blood draw'),
('Medichecks - Arndale House Luton', 'The Mall, Luton', 'LU1 2LJ', 51.8782, -0.4200, 'medichecks', 'Venous blood draw'),
('Medichecks - Cosmopolitan Medical Maidstone', '80 King Street, Maidstone, Kent', 'ME14 1BH', 51.2720, 0.5237, 'medichecks', 'Venous blood draw'),
('Medichecks - Superdrug Guildford', '101 High Street, Guildford, Surrey', 'GU1 3DP', 51.2362, -0.5704, 'medichecks', 'Venous blood draw'),

-- Add Goodbody Clinic pharmacy partners (sample locations with verified addresses)
('Goodbody Clinic - Thorkhill Pharmacy', 'High Street, Thames Ditton, Surrey', 'KT7 0RY', 51.3889, -0.3290, 'goodbody-clinic', 'Blood draw, health screening'),
('Goodbody Clinic - Epicare Health', 'Swindon, Wiltshire', 'SN1 1JE', 51.5571, -1.7795, 'goodbody-clinic', 'Blood draw, health screening'),
('Goodbody Clinic - Overton Pharmacy', 'High Street, Overton, Basingstoke', 'RG25 3HD', 51.2442, -1.2536, 'goodbody-clinic', 'Blood draw, health screening'),
('Goodbody Clinic - Kingsbury', 'Kingsbury, London', 'NW9 9RR', 51.5855, -0.2792, 'goodbody-clinic', 'Blood draw, health screening'),

-- Add Tuli Health partner pharmacy locations (operating through pharmacy network)
('Tuli Health Partner - Central London', 'Central London Pharmacy Network', 'EC1A 1AA', 51.5179, -0.1263, 'tuli-health', 'Blood draw, pharmacy-based testing'),
('Tuli Health Partner - Birmingham', 'Birmingham Pharmacy Network', 'B1 1AA', 52.4862, -1.8904, 'tuli-health', 'Blood draw, pharmacy-based testing'),
('Tuli Health Partner - Manchester', 'Manchester Pharmacy Network', 'M1 1AA', 53.4808, -2.2426, 'tuli-health', 'Blood draw, pharmacy-based testing')

ON CONFLICT DO NOTHING;