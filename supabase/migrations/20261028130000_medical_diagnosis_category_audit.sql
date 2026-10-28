-- Medical Diagnosis category audit, 28/10/2026. Data-only; already applied to production via service role. Kept for the record.
update public.provider_tests set category='Fertility', canonical_category='fertility' where id='b3b5fdfc-6fdc-4ae8-9d19-283de1ccd998'; -- 3 Hormones - Mix&Match
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='84b67191-5a26-4229-bd9d-d97bcecca0e2'; -- Abdominal Health
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='ecb4be3d-4aff-43d0-aafd-b7ed33881bc4'; -- ALEX3
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='706603b5-c580-4f96-b31f-fc9035cf8948'; -- Allergy
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='6f39cfc6-eb2e-4327-ad4c-6e4735fdba0f'; -- Allergy Profile I (11 Individual Allergens) + IgE
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='e44df164-dc55-433a-ad86-2370ad8bc2e3'; -- Allergy profile II (20 Individual Allergens)
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='79720b80-e499-442c-b656-41cc25b59be6'; -- Allergy Profile III (40 Individual Allergens)
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='c9ebf798-1815-40fe-a958-02a2eeab98a1'; -- Allergy profile IV (16) UK Panel
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='95174586-a3ae-4e70-9c87-dfecae1c5f4c'; -- Allergy profile IX (20) Food
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='1dfc019e-fa49-4bc3-977e-ea995405bd96'; -- Allergy Profile V (16) UK Panel + IgE
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='4ebd7b7d-3fe1-40b0-a1e2-35a384b2746e'; -- Allergy profile VI (30) Atopic
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='d411e828-df81-4cc7-9e92-81003af2e1a3'; -- Allergy profile VII (30) Paediatric
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='2906891f-f776-4171-9d69-a911ea238f1a'; -- Allergy profile VIII (20) Inhalation
update public.provider_tests set category='Allergy', canonical_category='allergy-testing' where id='43284cde-c22b-4fe0-bd52-87db52369415'; -- Allergy profile X - Milk plus Gluten
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='cab439e8-18f3-4356-bb7b-1bc88109e2c7'; -- Amenorrhea Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='307bbec6-a635-4075-abeb-5b697d1d6695'; -- Anaemia Profile I
update public.provider_tests set category='General Health', canonical_category='general-health' where id='c8f441fa-3cdb-4cdc-aaf6-7d427e2de77d'; -- Anaemia Profile II
update public.provider_tests set category='General Health', canonical_category='general-health' where id='7d98dcaf-06db-4be2-85b4-39c2eed6b148'; -- Anaemia Profile III
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='0d5efc76-7dd9-403a-8caf-ea7505e3f301'; -- Andropause Profile
update public.provider_tests set category='Fertility', canonical_category='fertility' where id='05b697ae-c4fe-440e-aeeb-344a96ed7fa7'; -- Antenatal Profile
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='bc2cefcb-800d-4dbb-89ba-d4d80f13b5ac'; -- Basic Vitamin Screen
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='0746b3e7-96c5-4957-9c5b-fef791c902b2'; -- Basic Vitamin Screen II
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='734ab6d5-169e-46ab-87f0-91e01272f2c1'; -- Bloodborne Pathogens
update public.provider_tests set category='Sports & Fitness', canonical_category='sports-performance' where id='d4bca88f-dadb-435e-85b0-065de3bb3a4b'; -- Bodybuilder Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='4eedf5f4-0cc3-4fb0-8260-b621312772d8'; -- Bone Profile
update public.provider_tests set category='Heart Health', canonical_category='heart' where id='53cfb185-04d0-42dd-8a15-492cef9c4ffc'; -- Cardiac Panel Profile I
update public.provider_tests set category='Heart Health', canonical_category='heart' where id='cc2762a0-2ba6-4a49-9ea7-e52f1b757788'; -- Cardiac Panel Profile II
update public.provider_tests set category='Heart Health', canonical_category='heart' where id='6e520e74-d74c-40d6-81e2-a763d5291a3e'; -- Cardiac Panel Profile III
update public.provider_tests set category='Heart Health', canonical_category='heart' where id='f5d9f655-802f-4acc-af7b-42269acdcddf'; -- Cardiovascular Screen
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='5fe861b0-5b18-4a54-892c-c5880c6c7349'; -- Chlamydia trachomatis / Neisseria gonorrhoea PCR
update public.provider_tests set category='General Health', canonical_category='general-health' where id='98e80759-902c-4a20-9b4f-42fbcdc39c65'; -- Coagulation Profile I
update public.provider_tests set category='General Health', canonical_category='general-health' where id='923e7f03-0b42-411b-8b83-20b8e6865108'; -- Coagulation Profile II
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='6708252d-4b5e-4fb9-a8f4-c450e4c97717'; -- Coeliac Profile
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='5404feaa-90ba-45c3-a4f3-264d8322c6b7'; -- Coeliac Profile II
update public.provider_tests set category='General Health', canonical_category='general-health' where id='a03bd3fd-55aa-43eb-a229-efbf610da487'; -- Comprehensive Profile +
update public.provider_tests set category='General Health', canonical_category='general-health' where id='a9b5d749-6826-4c3c-b847-effb07ce52c5'; -- Comprehensive Profile plus Premium Report
update public.provider_tests set category='General Health', canonical_category='general-health' where id='92b61f5b-1b01-4eaf-bbb0-4c143ede8f12'; -- Demodex spp. microscopy
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='3f345106-27ef-4303-912a-62056b19ccc7'; -- Depression Profile - Females
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='3796e3e2-4e62-4de5-abe4-e77c61f1023d'; -- Depression Profile - Males
update public.provider_tests set category='General Health', canonical_category='general-health' where id='da7ac249-2244-431c-b546-54f7bd3f4880'; -- Detox Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='dddd5e1d-0343-4c76-a12a-8b81544b171c'; -- Detox Profile Plus
update public.provider_tests set category='Diabetes', canonical_category='diabetes' where id='55f577ac-abee-4db4-a419-ce8e8c9f1343'; -- Diabetes Profile I
update public.provider_tests set category='Diabetes', canonical_category='diabetes' where id='1e0f93e7-7f87-497c-8cad-4377750aefc7'; -- Diabetes Profile II
update public.provider_tests set category='Diabetes', canonical_category='diabetes' where id='2630760c-969e-4295-830a-38e66ad0dcac'; -- Fasting Insulin Resistance Index (FIRI)
update public.provider_tests set category='Fertility', canonical_category='fertility' where id='90261ac9-2c0b-4c85-ac6a-42a84fe12ed8'; -- FSH-LH Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='61b10970-cb2b-4e60-9e04-72c43baab78b'; -- Full Biochemistry & Haematology Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='94e3fcef-35e9-4580-8821-3424e6e816d3'; -- Full Biochemistry & Haematology Profile & CRP
update public.provider_tests set category='General Health', canonical_category='general-health' where id='93524cdc-d9d4-4d57-94de-9f58f0f215df'; -- Full Biochemistry Profile
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='492bf5f2-c9f6-4fcd-9b63-b223cbf6740d'; -- Full Health Assessment – Men
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='068bff53-2f35-4b55-a192-38a13551bf69'; -- Full Health Assessment – Women
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='e6dbe6d7-c6b6-4258-979e-c584ca58db80'; -- Gardnerella vaginalis PCR
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='1f0651ff-5da5-4a3f-81d8-487e5da12b10'; -- Gastrointestinal Screen - Bacteria
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='8572d681-3390-4963-aa32-4f309248668f'; -- Gastrointestinal Screen - Helminths
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='4283f026-4d61-496a-9b47-946a9266a095'; -- Gastrointestinal Screen - Parasites
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='89075f15-bb9c-4fcb-8087-375d4a9e22e3'; -- Gastrointestinal Screen - Viruses
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='6dfdef56-e457-48ab-9aa4-a3a202e184fb'; -- Gastrointestinal Screen – Bacteria and Parasites
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='475a5ffa-28de-4496-8b06-988f830f8f46'; -- Gastrointestinal Screen – Stool Culture (PCR)
update public.provider_tests set category='Sports & Fitness', canonical_category='sports-performance' where id='9d39c983-7b8a-4c3b-ab19-0d23eb3d8cfa'; -- Glutathione
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='8b2e07cc-a1f6-45b5-a78b-a8507751f3f7'; -- Gyne Profile - Female
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='4967d517-472c-47c2-8e0a-2fe7fc66c982'; -- Gyne Profile - Male
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='79e78ee2-9ca5-4d77-964a-5f069313f1d7'; -- Gyne Profile Plus - Female
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='dbd5380c-9690-43d8-b509-b297fa0645ad'; -- Gyne Profile Plus - Male
update public.provider_tests set category='General Health', canonical_category='general-health' where id='6252325d-37c5-473a-8d08-a2d04cbc8c4b'; -- Hair loss profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='2ba9e350-7e4b-4735-ba85-3820a09a7295'; -- Health Screening Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='b4827989-36b1-4be0-a698-ce895a9b9794'; -- Heavy Metals Screen
update public.provider_tests set category='General Health', canonical_category='general-health' where id='56cf3e87-c8b9-423b-8432-1252a787dd3f'; -- Hematology Profile
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='5e908d72-3f62-4cb3-884e-a5cbac3b0e94'; -- Hepatic Profile (LFT, Liver Function Tests)
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='b5c65501-bed2-49ed-bc4d-f84f8fb12fe6'; -- Hepatitis A B C Profile
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='ffdb3e75-96e6-4fc7-ae8d-5ebc7acc97ef'; -- Hepatitis A Profile
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='6b3786b9-4358-4d23-8022-2e2d1a590623'; -- Hepatitis B Profile
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='e7b63b73-1d16-4ec2-9815-13bb14d47dc5'; -- Hirsutism Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='c5887210-fed1-4a2b-9ac6-50af00b6b81e'; -- Impotence Profile
update public.provider_tests set category='Fertility', canonical_category='fertility' where id='7bfb6620-b312-493c-8eec-d64821e535c1'; -- INFERTILITY Profile - Female
update public.provider_tests set category='Fertility', canonical_category='fertility' where id='8546b7de-d1bd-4027-aabb-0ba44e8f47f6'; -- INFERTILITY Profile - Male
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='8d1d9d03-ad7e-480f-918a-7f29e9017113'; -- Iron Status Profile
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='3317e0f4-8ec8-4134-9887-9309f8c66230'; -- Kidney profile
update public.provider_tests set category='Heart Health', canonical_category='heart' where id='7924ebed-eed5-4083-91d2-109dc2c708f0'; -- Lipid Profile
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='0a091251-ccba-43f6-aa62-fe5d101093f8'; -- Liver, Pancreas & Stomach Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='e952410b-51b6-48ab-b75e-14d653956617'; -- Longevity Ultimate Tracker
update public.provider_tests set category='General Health', canonical_category='general-health' where id='ef460159-82b6-4407-bca1-467ebad44d1f'; -- Lupus Anticoagulant
update public.provider_tests set category='General Health', canonical_category='general-health' where id='1597e5a9-b14c-462e-bdff-9052c3bd7076'; -- Lymphocyte Subsets (CD57)
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='211d7f6a-d746-4210-871a-5df2233da331'; -- Men’s Essentials
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='05dce4d6-a2dd-4887-9744-6377e86a2c6a'; -- Men's Essentials Plus
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='48c587ef-cd3f-4d90-8556-108180c557aa'; -- Menopausal Profile
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='01f0886b-ab35-4a17-bbba-ea839f80bf3a'; -- Menstrual Cycle and Ovulation Control
update public.provider_tests set category='General Health', canonical_category='general-health' where id='6523d979-e78e-4392-ab97-a1951a948135'; -- Metabolic Panel
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='29adf168-182a-4fb2-9874-36dc78db8d7a'; -- Mineral & Vitamin Screen
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='511678d1-9972-4d1b-b009-25630a863647'; -- Mineral Screen
update public.provider_tests set category='General Health', canonical_category='general-health' where id='e378bf5e-15b4-42bf-8239-ae849cdf9366'; -- MMR (Measles IgG, Mumps IgG, Rubella IgG)
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='a2e9277b-912c-42ea-a1c4-2fc2760e009b'; -- Mycoplasma / Ureaplasma PCR
update public.provider_tests set category='General Health', canonical_category='general-health' where id='7f600b26-b830-4bb1-be87-d8ee35987b55'; -- NK Cells Cytotoxicity Assay
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='f730db75-ee18-4bb0-9f52-bbaff5d366f4'; -- Nutritional Status
update public.provider_tests set category='Diabetes', canonical_category='diabetes' where id='ba2b2cdf-c642-4faa-86c5-8cb0f27bd280'; -- OGTT 0' 120'
update public.provider_tests set category='Diabetes', canonical_category='diabetes' where id='de8196f7-96d8-47d1-ac23-075178b765e4'; -- OGTT 0' 60' 120'
update public.provider_tests set category='General Health', canonical_category='general-health' where id='65942af3-8b5f-4872-84b2-6aa1d3131d7f'; -- Pediatric Profile I
update public.provider_tests set category='General Health', canonical_category='general-health' where id='f42683cc-25a6-4505-9979-d616598aecee'; -- Pediatric Profile II
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='6e4b3772-31e4-4079-9c6a-ffa86eb9b7a1'; -- Polycystic Ovary Syndrome Profile I
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='97b0531f-7a8f-4d30-b2d1-4d6b6513624d'; -- Polycystic Ovary Syndrome Profile II
update public.provider_tests set category='General Health', canonical_category='general-health' where id='d7c5b4f7-1388-4868-b633-e4c903c9d8b2'; -- Pre operation Profile
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='465768d5-988a-462c-8bc3-ddeefd19b8f8'; -- Prostate Profile
update public.provider_tests set category='Cancer Screening', canonical_category='cancer-screening' where id='971b058e-6037-47f2-9a45-5ffc603cdbbf'; -- Quantitative Faecal Immunochemical Test (QFIT)
update public.provider_tests set category='General Health', canonical_category='general-health' where id='84c7ab3e-81e4-4386-aa42-b37cd98468fa'; -- Rheumatoid Profile I
update public.provider_tests set category='General Health', canonical_category='general-health' where id='b6bcb080-ccf4-45b9-9f8c-c375b47787ba'; -- Rheumatoid Profile II
update public.provider_tests set category='Cancer Screening', canonical_category='cancer-screening' where id='1498bc8b-969e-41d7-9748-1ece0806a7e2'; -- Risk of Ovarian Malignancy Algorithm (ROMA)
update public.provider_tests set category='General Health', canonical_category='general-health' where id='11996691-f4eb-418c-8b73-0fa9e8932a91'; -- Serotonin
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='281d1926-2ae1-4e89-ba1a-9014aaa05cfb'; -- Sexual Health Profile Advanced
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='713ff8aa-2342-4b3d-9b32-3ee5e3fa070a'; -- Sexual Health Profile I - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='8e1d0d69-2783-4278-8081-7ad6cb55a33a'; -- Sexual Health Profile I - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='99103e34-7d47-4247-bc91-fd0589914b9d'; -- Sexual Health Profile II - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='159baa27-f245-455d-9c6c-441e39f444f4'; -- Sexual Health Profile II - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='2958fb79-f01d-4b2a-a336-bb73671bf3cb'; -- Sexual Health Profile III - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='5422a4bf-ca7e-4409-90fb-ce83c6f4c108'; -- Sexual Health Profile III - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='52a903c9-74ff-40dd-a7d5-2688396ebc43'; -- Sexual Health Profile IV - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='940d3ecd-df2c-4ba8-8b47-911033b6c285'; -- Sexual Health Profile IV - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='e58e38d0-79b1-43fe-a164-0f21c387fcdd'; -- Sexual Health Profile Premium - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='97ad0291-3d4f-4767-83ed-f20a05374aa9'; -- Sexual Health Profile Premium - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='6b329e61-d907-493d-82da-23bc7b9e6ee5'; -- Sexual Health Profile Premium Plus - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='360a459a-0eaf-466f-810b-e244d4631340'; -- Sexual Health Profile Premium Plus - Male
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='d915a914-a356-4cb5-908e-0eaed195e98a'; -- Sexual Health Profile V - Female
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='1f6869c5-6ef7-4e6c-9f3d-5f831ce91aaa'; -- Sexual Health Profile V - Male
update public.provider_tests set category='General Health', canonical_category='general-health' where id='104132c1-7d9c-4b71-95da-b2fd6d14cad1'; -- Short Biochemistry & Haematology Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='db1c9174-9bdf-4842-8c3e-eff25365f3a6'; -- Short Biochemistry Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='b69ffa9c-d64e-49ef-9e99-fe8997bdadc2'; -- Sputum
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='33608472-b345-42ca-b7c1-98686ad1088b'; -- STI I PCR (Polymerase Chain Reaction)
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='1525021c-2531-4b1b-8ed5-4756574142a7'; -- STI II PCR (Polymerase Chain Reaction)
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='26ea82e1-129a-4918-b7fb-ec9cce7ede20'; -- STI PCR III
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='6f5ca00e-6a09-433b-9e52-638f0f70bc60'; -- Stool Culture / Bacteria PCR
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='75cb6df0-bdb0-4730-ba4c-712f5cecbd98'; -- Stool For Ova, Cysts and Parasites
update public.provider_tests set category='Cancer Screening', canonical_category='cancer-screening' where id='da8518cf-ade5-4be8-8c42-6c10c2c3f228'; -- Testicular Tumor Profile
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='48bd3f31-cea7-4a62-9706-86d7cd6ab2d1'; -- Testosterone – Key Markers
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='83aa078b-8bfd-4b5a-b184-cd5148221a6f'; -- Testosterone Check (Testosterone & SHBG)
update public.provider_tests set category='Men''s Health', canonical_category='mens-health' where id='3a5359ef-9984-4a45-88ee-0d40a86bf92a'; -- Testosterone Profile
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='e0718543-3d06-4bb7-8dc1-df99fbdd428e'; -- Thyroid
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='940b8d94-d009-4897-b4dd-148bfb39b49f'; -- Thyroid Antibodies
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='00f71a64-1c1f-407b-b8a0-7008e32b9d66'; -- Thyroid Profile I
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='e688719b-cc25-4164-b17d-69f3c7599711'; -- Thyroid Profile II (incl. TG Ab)
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='997cd1ec-becb-453d-a7e1-113b03b0e8f3'; -- Thyroid Profile II (incl. TPO Ab)
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='53911d64-d78f-4bd5-ae1b-67b1b0c5b88f'; -- Thyroid Profile III
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='465f4178-25de-4033-96ef-9597bb95e601'; -- Thyroid Profile IV
update public.provider_tests set category='Thyroid', canonical_category='thyroid' where id='42cd5244-99ac-4cb6-9945-4fd5ec9f5f74'; -- Thyroid Profile V
update public.provider_tests set category='General Health', canonical_category='general-health' where id='db3d8c17-6ecd-4767-beb4-f5637abece94'; -- TORCH profile
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='70de581d-2b56-4e57-bba0-849c34f8fbf8'; -- Urea & Electrolytes Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='832e6f3c-1fab-4990-84ba-09a0367f208f'; -- Urine Examination & Culture
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='4453fba5-7661-4acb-8a45-fcd36f8f814d'; -- Viral Early Detection
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='eb94964b-4d74-4413-91b9-db5cdbc0efa3'; -- Viral Screen
update public.provider_tests set category='Sexual Health', canonical_category='sexual-health' where id='3fe71141-1f00-421a-9f93-0c20efc67d16'; -- Viral Screen II
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='f93af6d7-39a8-4abe-9f54-7b4e59e11b61'; -- Vitamin Screen
update public.provider_tests set category='General Health', canonical_category='general-health' where id='30256d70-66ff-4214-ac38-85e4d584f4e1'; -- Weight Loss / GLP-1 Profile
update public.provider_tests set category='General Health', canonical_category='general-health' where id='3314170a-ca57-41a0-94dc-d6c983704fae'; -- Weight Loss / GLP-1 Profile Plus
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='c3d97b0f-8ef0-422d-8bda-b12cfb4c7ba3'; -- Women's Hormones
update public.provider_tests set category='Women''s Health', canonical_category='womens-health' where id='82d6efc2-ba96-4a54-bca6-77fcfcb60e9d'; -- Women's Hormones Plus
update public.provider_tests set category='Vitamins & Minerals', canonical_category='vitamins' where id='a00f854a-1047-4124-bce1-6a36f69517ac'; -- Youth Vitamins
update public.provider_tests set category='Gut Health', canonical_category='gut' where id='9a209c41-8d0b-4c54-ac41-e953eb914ffe'; -- Zonulin
