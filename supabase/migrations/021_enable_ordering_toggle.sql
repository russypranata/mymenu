-- Add enable_ordering column to store_settings
-- This allows stores to disable ordering feature and use menu as pure showcase

ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS enable_ordering BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN store_settings.enable_ordering IS 'When true, customers can add items to cart and order via WhatsApp. When false, menu is display-only.';

-- Update existing records to have ordering enabled by default (backward compatible)
UPDATE store_settings 
SET enable_ordering = true 
WHERE enable_ordering IS NULL;
