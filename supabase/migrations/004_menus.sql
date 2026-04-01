-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS menus_store_id_idx ON menus(store_id);
CREATE INDEX IF NOT EXISTS menus_category_id_idx ON menus(category_id);
CREATE INDEX IF NOT EXISTS menus_is_active_idx ON menus(is_active);
CREATE INDEX IF NOT EXISTS menus_store_active_idx ON menus(store_id, is_active);

-- Enable RLS
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menus
DROP POLICY IF EXISTS "Users can view own menus" ON menus;
CREATE POLICY "Users can view own menus"
  ON menus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = menus.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own menus" ON menus;
CREATE POLICY "Users can insert own menus"
  ON menus FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = menus.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own menus" ON menus;
CREATE POLICY "Users can update own menus"
  ON menus FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = menus.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own menus" ON menus;
CREATE POLICY "Users can delete own menus"
  ON menus FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = menus.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all menus" ON menus;
CREATE POLICY "Admins can view all menus"
  ON menus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all menus" ON menus;
CREATE POLICY "Admins can manage all menus"
  ON menus FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public can view active menus" ON menus;
CREATE POLICY "Public can view active menus"
  ON menus FOR SELECT
  USING (is_active = true);
