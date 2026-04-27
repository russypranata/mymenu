-- Fix Subscription for crystarore08@gmail.com
-- This will create a fresh 3-day trial subscription for this user

-- Step 1: Find the user_id for crystarore08@gmail.com
SELECT 
  id as user_id,
  email,
  display_name,
  phone,
  role,
  status
FROM auth.users
WHERE email = 'crystarore08@gmail.com';

-- Step 2: Check current subscription (if any)
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.status,
  s.started_at,
  s.expires_at,
  s.plan_type,
  s.origin,
  p.email
FROM public.subscriptions s
JOIN auth.users p ON s.user_id = p.id
WHERE p.email = 'crystarore08@gmail.com';

-- Step 3: Delete old subscription (if exists)
DELETE FROM public.subscriptions
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Step 4: Create fresh 3-day trial subscription
INSERT INTO public.subscriptions (
  user_id,
  status,
  started_at,
  expires_at,
  plan_type,
  origin
)
SELECT 
  id,
  'trial',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  'monthly',
  'trial'
FROM auth.users
WHERE email = 'crystarore08@gmail.com';

-- Step 5: Verify the new subscription
SELECT 
  s.id as subscription_id,
  p.email,
  s.status,
  s.started_at,
  s.expires_at,
  (s.expires_at - s.started_at) as duration_days,
  s.plan_type,
  s.origin
FROM public.subscriptions s
JOIN auth.users p ON s.user_id = p.id
WHERE p.email = 'crystarore08@gmail.com';

-- Expected result:
-- email: crystarore08@gmail.com
-- status: trial
-- started_at: 2026-04-27
-- expires_at: 2026-04-30
-- duration_days: 3
-- plan_type: monthly
-- origin: trial
