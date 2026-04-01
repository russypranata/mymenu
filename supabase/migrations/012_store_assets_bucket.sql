-- Bucket untuk logo dan banner toko
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Owner can upload store asset" ON storage.objects;
CREATE POLICY "Owner can upload store asset"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'store-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Owner can update store asset" ON storage.objects;
CREATE POLICY "Owner can update store asset"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'store-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Owner can delete store asset" ON storage.objects;
CREATE POLICY "Owner can delete store asset"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'store-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Public can read store assets" ON storage.objects;
CREATE POLICY "Public can read store assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'store-assets');
