-- ── Store Gallery ──────────────────────────────────────────────────────────
-- Tabel untuk menyimpan foto-foto galeri suasana toko

CREATE TABLE IF NOT EXISTS store_gallery (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    uuid        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url   text        NOT NULL,
  caption     text        CHECK (char_length(caption) <= 80),
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index untuk query galeri per toko diurutkan berdasarkan sort_order
CREATE INDEX IF NOT EXISTS idx_store_gallery_store_id_sort
  ON store_gallery(store_id, sort_order);

-- Row Level Security
ALTER TABLE store_gallery ENABLE ROW LEVEL SECURITY;

-- Owner bisa melakukan semua operasi pada foto milik tokonya
CREATE POLICY "owner_manage_gallery" ON store_gallery
  FOR ALL
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Public bisa membaca semua foto galeri (untuk halaman menu publik)
CREATE POLICY "public_read_gallery" ON store_gallery
  FOR SELECT
  USING (true);

-- ── store_settings: tambah kolom gallery_enabled ────────────────────────────
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS gallery_enabled boolean NOT NULL DEFAULT false;

-- ── Storage bucket store-gallery ────────────────────────────────────────────
-- Buat bucket untuk menyimpan foto galeri toko
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-gallery',
  'store-gallery',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: owner bisa upload foto ke folder tokonya
CREATE POLICY "owner_upload_gallery" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'store-gallery'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM stores WHERE user_id = auth.uid()
    )
  );

-- Storage policy: owner bisa hapus foto milik tokonya
CREATE POLICY "owner_delete_gallery" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'store-gallery'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM stores WHERE user_id = auth.uid()
    )
  );

-- Storage policy: public bisa membaca semua foto galeri
CREATE POLICY "public_read_gallery_storage" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'store-gallery');
