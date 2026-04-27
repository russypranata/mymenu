-- ============================================
-- MENU SECTION TEXT CUSTOMIZATION MIGRATION
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- 
-- What it does:
-- - Adds menu_section_title column to stores table
-- - Adds menu_section_subtitle column to stores table
-- - Both columns are optional (nullable)
-- - Default values handled in application code
--
-- After running this:
-- 1. Go to Settings Toko in your dashboard
-- 2. Scroll to "Teks Bagian Menu" section
-- 3. Customize title & subtitle or leave empty for defaults
-- ============================================

-- Add customizable menu section title and subtitle to stores table
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS menu_section_title TEXT,
ADD COLUMN IF NOT EXISTS menu_section_subtitle TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.stores.menu_section_title IS 'Custom title for menu section (e.g., "Menu Kami", "Our Menu"). Falls back to "Menu Kami" if null.';
COMMENT ON COLUMN public.stores.menu_section_subtitle IS 'Custom subtitle for menu section. Falls back to "Pilih menu favorit Anda" if null.';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'stores' 
AND column_name IN ('menu_section_title', 'menu_section_subtitle');
