-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL UNIQUE REFERENCES stores(id) ON DELETE CASCADE,
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS store_settings_store_id_idx ON store_settings(store_id);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for store_settings
DROP POLICY IF EXISTS "Users can view own store settings" ON store_settings;
CREATE POLICY "Users can view own store settings"
  ON store_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_settings.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own store settings" ON store_settings;
CREATE POLICY "Users can insert own store settings"
  ON store_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_settings.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own store settings" ON store_settings;
CREATE POLICY "Users can update own store settings"
  ON store_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_settings.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all store settings" ON store_settings;
CREATE POLICY "Admins can view all store settings"
  ON store_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all store settings" ON store_settings;
CREATE POLICY "Admins can manage all store settings"
  ON store_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public can view store settings" ON store_settings;
CREATE POLICY "Public can view store settings"
  ON store_settings FOR SELECT
  USING (true);
