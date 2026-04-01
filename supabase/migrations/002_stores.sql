-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  whatsapp TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS stores_user_id_idx ON stores(user_id);
CREATE INDEX IF NOT EXISTS stores_slug_idx ON stores(slug);
CREATE INDEX IF NOT EXISTS stores_slug_unique_idx ON stores(slug) WHERE slug IS NOT NULL;

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
DROP POLICY IF EXISTS "Users can view own stores" ON stores;
CREATE POLICY "Users can view own stores"
  ON stores FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stores" ON stores;
CREATE POLICY "Users can insert own stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stores" ON stores;
CREATE POLICY "Users can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own stores" ON stores;
CREATE POLICY "Users can delete own stores"
  ON stores FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all stores" ON stores;
CREATE POLICY "Admins can view all stores"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all stores" ON stores;
CREATE POLICY "Admins can update all stores"
  ON stores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete all stores" ON stores;
CREATE POLICY "Admins can delete all stores"
  ON stores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public can view stores by slug" ON stores;
CREATE POLICY "Public can view stores by slug"
  ON stores FOR SELECT
  USING (true);
