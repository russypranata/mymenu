-- Tambah kolom banner_images untuk mendukung multiple banner / slideshow di hero
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS banner_images text[] DEFAULT '{}';
