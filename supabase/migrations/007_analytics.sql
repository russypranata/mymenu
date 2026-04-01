-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS analytics_store_id_idx ON analytics(store_id);
CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics(event_type);
CREATE INDEX IF NOT EXISTS analytics_created_at_idx ON analytics(created_at);
CREATE INDEX IF NOT EXISTS analytics_store_event_idx ON analytics(store_id, event_type);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = analytics.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics;
CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = analytics.store_id AND stores.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all analytics" ON analytics;
CREATE POLICY "Admins can view all analytics"
  ON analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all analytics" ON analytics;
CREATE POLICY "Admins can manage all analytics"
  ON analytics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public can insert analytics" ON analytics;
CREATE POLICY "Public can insert analytics"
  ON analytics FOR INSERT
  WITH CHECK (true);
