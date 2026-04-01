-- Tambah kolom extra_images untuk menyimpan array URL gambar tambahan pada menu
ALTER TABLE menus ADD COLUMN IF NOT EXISTS extra_images TEXT[] DEFAULT '{}';
