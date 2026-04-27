-- Reset ALL Trial Subscriptions to Proper 3-Day Duration
-- Use this if you want to give all trial users a fresh 3-day trial from today

-- Step 1: Backup current trial subscriptions (optional)
CREATE TABLE IF NOT EXISTS subscriptions_backup_trial AS
SELECT * FROM public.subscriptions WHERE status = 'trial';

-- Step 2: Check how many trial subscriptions will be affected
SELECT 
  COUNT(*) as total_trial_subscriptions,
  COUNT(CASE WHEN expires_at < CURRENT_DATE THEN 1 END) as expired_trials,
  COUNT(CASE WHEN expires_at >= CURRENT_DATE THEN 1 END) as active_trials
FROM public.subscriptions
WHERE status = 'trial';

-- Step 3: Reset ALL trial subscriptions to 3 days from today
UPDATE public.subscriptions
SET 
  started_at = CURRENT_DATE,
  expires_at = CURRENT_DATE + INTERVAL '3 days',
  status = 'trial',
  origin = 'trial',
  plan_type = 'monthly'
WHERE status = 'trial';

-- Step 4: Verify the reset
SELECT 
  user_id,
  status,
  started_at,
  expires_at,
  (expires_at - started_at) as duration_days,
  CASE 
    WHEN expires_at > CURRENT_DATE THEN 'Active'
    ELSE 'Expired'
  END as current_status
FROM public.subscriptions
WHERE status = 'trial'
ORDER BY started_at DESC;

-- Expected result: All trial subscriptions should show:
-- - started_at = today (2026-04-27)
-- - expires_at = today + 3 days (2026-04-30)
-- - duration_days = 3
-- - current_status = 'Active'
