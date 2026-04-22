-- Add ip column to analytics for rate limiting (already used in code but column may not exist)
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS ip TEXT;

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS analytics_ip_store_event_idx ON analytics(ip, store_id, event_type, created_at);
