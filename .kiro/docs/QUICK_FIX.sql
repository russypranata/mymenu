-- ============================================
-- QUICK FIX: Enable Dark Mode for Testing
-- Run this if you want to test immediately
-- ============================================

-- First, add the columns if not exists
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS dark_mode_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS border_radius text DEFAULT 'rounded',
ADD COLUMN IF NOT EXISTS card_style text DEFAULT 'card',
ADD COLUMN IF NOT EXISTS text_size text DEFAULT 'md',
ADD COLUMN IF NOT EXISTS background_pattern text DEFAULT 'none';

-- Then, enable dark mode for ALL stores (for testing)
UPDATE store_settings 
SET dark_mode_enabled = true;

-- Verify
SELECT 
  s.name as store_name,
  ss.dark_mode_enabled,
  ss.accent_color,
  ss.border_radius,
  ss.card_style
FROM store_settings ss
JOIN stores s ON s.id = ss.store_id;

-- If you see dark_mode_enabled = true, it's working!
