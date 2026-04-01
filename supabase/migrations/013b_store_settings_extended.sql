-- Tambah kolom baru ke store_settings
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS opening_hours TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_button_text TEXT DEFAULT 'Pesan via WhatsApp',
  ADD COLUMN IF NOT EXISTS show_price BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS font TEXT DEFAULT 'sans',
  ADD COLUMN IF NOT EXISTS menu_layout TEXT DEFAULT 'list';
