-- Clean Up Subscription History for crystarore08@gmail.com
-- Remove old/duplicate trial history records

-- Step 1: Check current subscription history
SELECT 
  sh.id,
  sh.plan_type,
  sh.origin,
  sh.started_at,
  sh.ended_at,
  sh.note,
  sh.created_at
FROM public.subscription_history sh
JOIN auth.users u ON sh.user_id = u.id
WHERE u.email = 'crystarore08@gmail.com'
ORDER BY sh.created_at DESC;

-- Step 2: Delete old trial history (keep only the latest one)
-- This will remove the "22 April - 26 April" record
DELETE FROM public.subscription_history
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
)
AND started_at < CURRENT_DATE - INTERVAL '5 days';

-- Step 3: Verify - should only show the current trial
SELECT 
  sh.plan_type,
  sh.origin,
  sh.started_at,
  sh.ended_at,
  sh.note
FROM public.subscription_history sh
JOIN auth.users u ON sh.user_id = u.id
WHERE u.email = 'crystarore08@gmail.com'
ORDER BY sh.started_at DESC;

-- Expected result: Only 1 record
-- Trial Gratis: 27 April 2026 - 30 April 2026
