-- Tambah kolom display_name dan avatar_url ke tabel profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(50),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;
