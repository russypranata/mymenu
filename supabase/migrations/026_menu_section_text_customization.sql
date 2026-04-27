-- Add customizable menu section title and subtitle to stores table
-- These fields are optional with sensible defaults

ALTER TABLE public.stores
ADD COLUMN menu_section_title TEXT,
ADD COLUMN menu_section_subtitle TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.stores.menu_section_title IS 'Custom title for menu section (e.g., "Menu Kami", "Our Menu"). Falls back to default if null.';
COMMENT ON COLUMN public.stores.menu_section_subtitle IS 'Custom subtitle for menu section. Falls back to default if null.';
