-- Buat bucket menu-images untuk foto menu
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: owner bisa upload ke folder store miliknya
DROP POLICY IF EXISTS "Owner can upload menu image" ON storage.objects;
CREATE POLICY "Owner can upload menu image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'menu-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: owner bisa update/hapus foto menu miliknya
DROP POLICY IF EXISTS "Owner can update menu image" ON storage.objects;
CREATE POLICY "Owner can update menu image"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'menu-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owner can delete menu image" ON storage.objects;
CREATE POLICY "Owner can delete menu image"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'menu-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: siapa saja bisa baca (public bucket)
DROP POLICY IF EXISTS "Public can read menu images" ON storage.objects;
CREATE POLICY "Public can read menu images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');
