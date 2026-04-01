-- Buat bucket avatars untuk foto profil owner
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: owner bisa upload ke folder miliknya sendiri
DROP POLICY IF EXISTS "Owner can upload own avatar" ON storage.objects;
CREATE POLICY "Owner can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: owner bisa update/hapus avatar miliknya sendiri
DROP POLICY IF EXISTS "Owner can update own avatar" ON storage.objects;
CREATE POLICY "Owner can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owner can delete own avatar" ON storage.objects;
CREATE POLICY "Owner can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: siapa saja bisa baca (public bucket)
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
CREATE POLICY "Public can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
