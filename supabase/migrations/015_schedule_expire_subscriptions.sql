-- Schedule expire_subscriptions() to run daily via pg_cron
-- This ensures subscription statuses in DB stay accurate without needing
-- an INSERT/UPDATE trigger to fire first (fixes stale data in admin panel).
--
-- Requires pg_cron extension. Enable it in Supabase:
-- Dashboard → Database → Extensions → pg_cron
--
-- The job runs every day at 00:05 UTC.

SELECT cron.schedule(
  'expire-subscriptions-daily',   -- job name (unique)
  '5 0 * * *',                    -- cron expression: 00:05 UTC daily
  $$ SELECT public.expire_subscriptions(); $$
);
