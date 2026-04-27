-- QUICK FIX: Create 3-Day Trial for crystarore08@gmail.com
-- Copy-paste this entire script to Supabase SQL Editor and run

-- Delete old subscription (if exists)
DELETE FROM public.subscriptions
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Create fresh 3-day trial
INSERT INTO public.subscriptions (user_id, status, started_at, expires_at, plan_type, origin)
SELECT 
  id,
  'trial',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  'monthly',
  'trial'
FROM auth.users
WHERE email = 'crystarore08@gmail.com';

-- Verify
SELECT 
  p.email,
  s.status,
  s.started_at,
  s.expires_at,
  (s.expires_at - s.started_at) as days
FROM public.subscriptions s
JOIN auth.users p ON s.user_id = p.id
WHERE p.email = 'crystarore08@gmail.com';
