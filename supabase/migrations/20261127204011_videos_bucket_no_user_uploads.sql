-- Platform screening, 27 Nov 2026: close uploads to the unused videos bucket.
--
-- The private videos bucket accepted uploads of up to 200 MB from any
-- signed-in member into their own folder, and members can create signed
-- links to their own files. No page or function uses the bucket and it holds
-- no files, so it worked only as free file hosting for anyone who signs up.
-- Member uploads and changes stop. Reading and deleting own files stays, and
-- the service role keeps full access. The bucket itself is kept.

drop policy if exists "Authenticated users can upload videos" on storage.objects;
drop policy if exists "Users can upload their own videos" on storage.objects;
drop policy if exists "Users can update their own videos" on storage.objects;
