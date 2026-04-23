-- ============================================
-- Migration: Simplify Contact Structure
-- Description: Remove WhatsApp from locations (info only), use single store WhatsApp for orders
-- ============================================

-- Remove WhatsApp column from store_locations
-- Locations are now for informational purposes only (address, opening hours)
ALTER TABLE store_locations 
DROP COLUMN IF EXISTS whatsapp;

-- Add comment to clarify purpose
COMMENT ON TABLE store_locations IS 'Store locations for informational display only (address, opening hours). Orders go to store.whatsapp.';

-- Ensure stores.whatsapp exists and is properly set up
COMMENT ON COLUMN stores.whatsapp IS 'WhatsApp number for customer orders. All orders from all locations go to this number.';

-- Remove deprecated phone field from store_settings (if exists)
-- This was causing confusion - we only need store.whatsapp for orders
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS phone;

COMMENT ON TABLE store_settings IS 'Store appearance and display settings. Contact info (WhatsApp, social media) for footer display.';
