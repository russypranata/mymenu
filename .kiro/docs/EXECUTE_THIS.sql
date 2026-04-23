-- ============================================
-- SIMPLIFY CONTACT STRUCTURE
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Remove WhatsApp from store_locations
--    Locations are now for informational display only
ALTER TABLE store_locations 
DROP COLUMN IF EXISTS whatsapp;

COMMENT ON TABLE store_locations IS 'Store locations for informational display only (address, opening hours). Orders go to store.whatsapp.';

-- 2. Document stores.whatsapp purpose
COMMENT ON COLUMN stores.whatsapp IS 'WhatsApp number for customer orders. All orders from all locations go to this number.';

-- 3. Remove phone from store_settings
--    No longer needed - only social media in settings
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS phone;

COMMENT ON TABLE store_settings IS 'Store appearance and display settings. Social media links for footer display.';

-- 4. Add enable_ordering toggle (from previous migration)
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS enable_ordering BOOLEAN DEFAULT true;

COMMENT ON COLUMN store_settings.enable_ordering IS 'When true, customers can add items to cart and order via WhatsApp. When false, menu is display-only.';

-- Update existing records
UPDATE store_settings 
SET enable_ordering = true 
WHERE enable_ordering IS NULL;

-- ============================================
-- DONE! ✅
-- ============================================
-- 
-- What changed:
-- ✅ Removed store_locations.whatsapp
-- ✅ Removed store_settings.phone  
-- ✅ Added store_settings.enable_ordering
-- 
-- Now you have:
-- 1. Profile Phone (profiles.phone) - for admin notifications
-- 2. Store WhatsApp (stores.whatsapp) - for customer orders
-- 3. Locations (address + hours only) - for display
-- 
-- ============================================
