-- Analytics retention policy: delete records older than 90 days
-- This runs as a scheduled job to keep the analytics table lean

CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM public.analytics
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup to run daily at 02:00 UTC
-- Requires pg_cron extension (available on Supabase)
SELECT cron.schedule(
  'cleanup-analytics-daily',
  '0 2 * * *',
  $$SELECT public.cleanup_old_analytics()$$
);
