-- Create store_locations table if not exists
CREATE TABLE IF NOT EXISTS store_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  opening_hours TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add whatsapp column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_locations' 
    AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE store_locations ADD COLUMN whatsapp VARCHAR(20);
  END IF;
END $$;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_store_locations_store_id ON store_locations(store_id);
CREATE INDEX IF NOT EXISTS idx_store_locations_is_primary ON store_locations(is_primary);

-- Enable RLS
ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view store locations" ON store_locations;
DROP POLICY IF EXISTS "Store owner can insert locations" ON store_locations;
DROP POLICY IF EXISTS "Store owner can update locations" ON store_locations;
DROP POLICY IF EXISTS "Store owner can delete locations" ON store_locations;

-- RLS Policies
-- Users can view locations of any store (public)
CREATE POLICY "Anyone can view store locations"
  ON store_locations
  FOR SELECT
  USING (true);

-- Only store owner can insert locations
CREATE POLICY "Store owner can insert locations"
  ON store_locations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_locations.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Only store owner can update locations
CREATE POLICY "Store owner can update locations"
  ON store_locations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_locations.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Only store owner can delete locations
CREATE POLICY "Store owner can delete locations"
  ON store_locations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_locations.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_location ON store_locations;
DROP FUNCTION IF EXISTS ensure_single_primary_location();

-- Function to ensure only one primary location per store
CREATE OR REPLACE FUNCTION ensure_single_primary_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    -- Set all other locations for this store to non-primary
    UPDATE store_locations
    SET is_primary = false
    WHERE store_id = NEW.store_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single primary location
CREATE TRIGGER trigger_ensure_single_primary_location
  BEFORE INSERT OR UPDATE ON store_locations
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_location();

-- Migrate existing store data to locations
-- Create primary location for each existing store that doesn't have one yet
INSERT INTO store_locations (store_id, name, address, opening_hours, whatsapp, is_primary)
SELECT 
  s.id,
  'Lokasi Utama',
  COALESCE(s.address, ''),
  ss.opening_hours,
  s.whatsapp,
  true
FROM stores s
LEFT JOIN store_settings ss ON ss.store_id = s.id
WHERE (s.address IS NOT NULL OR s.whatsapp IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1 FROM store_locations sl 
    WHERE sl.store_id = s.id
  )
ON CONFLICT DO NOTHING;

-- Add comment
COMMENT ON TABLE store_locations IS 'Stores can have multiple locations/branches';
