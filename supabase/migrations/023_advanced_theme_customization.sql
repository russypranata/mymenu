-- Add advanced theme customization fields to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS dark_mode_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS border_radius text DEFAULT 'rounded' CHECK (border_radius IN ('sharp', 'rounded', 'pill')),
ADD COLUMN IF NOT EXISTS card_style text DEFAULT 'card' CHECK (card_style IN ('minimal', 'card', 'elevated')),
ADD COLUMN IF NOT EXISTS text_size text DEFAULT 'md' CHECK (text_size IN ('sm', 'md', 'lg')),
ADD COLUMN IF NOT EXISTS background_pattern text DEFAULT 'none' CHECK (background_pattern IN ('none', 'dots', 'grid', 'waves'));

-- Add comment for documentation
COMMENT ON COLUMN store_settings.dark_mode_enabled IS 'Enable dark mode toggle for customers';
COMMENT ON COLUMN store_settings.accent_color IS 'Secondary accent color for buttons, badges, etc';
COMMENT ON COLUMN store_settings.border_radius IS 'Border radius style: sharp (0px), rounded (12px), pill (24px)';
COMMENT ON COLUMN store_settings.card_style IS 'Menu card visual style';
COMMENT ON COLUMN store_settings.text_size IS 'Base text size scale';
COMMENT ON COLUMN store_settings.background_pattern IS 'Subtle background pattern';
