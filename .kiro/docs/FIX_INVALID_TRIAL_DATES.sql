-- Fix Invalid Trial Subscription Dates
-- Problem: Some subscriptions have expires_at before started_at or in the past
-- Solution: Reset trial subscriptions to proper 3-day duration from today

-- Step 1: Check current invalid subscriptions
SELECT 
  id,
  user_id,
  status,
  started_at,
  expires_at,
  CASE 
    WHEN expires_at < started_at THEN 'expires_before_started'
    WHEN expires_at < CURRENT_DATE AND status = 'trial' THEN 'expired_trial'
    ELSE 'ok'
  END as issue
FROM public.subscriptions
WHERE status = 'trial'
  AND (expires_at < started_at OR expires_at < CURRENT_DATE);

-- Step 2: Fix all invalid trial subscriptions
-- Reset to proper 3-day trial from today
UPDATE public.subscriptions
SET 
  started_at = CURRENT_DATE,
  expires_at = CURRENT_DATE + INTERVAL '3 days',
  status = 'trial'
WHERE status = 'trial'
  AND (expires_at < started_at OR expires_at < CURRENT_DATE);

-- Step 3: Verify the fix
SELECT 
  id,
  user_id,
  status,
  started_at,
  expires_at,
  expires_at - started_at as duration_days
FROM public.subscriptions
WHERE status = 'trial'
ORDER BY started_at DESC;

-- Expected result: All trial subscriptions should have:
-- - started_at = today
-- - expires_at = today + 3 days
-- - duration_days = 3
