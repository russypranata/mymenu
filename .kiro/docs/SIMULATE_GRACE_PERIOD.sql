-- SIMULATE GRACE PERIOD: Make subscription expired but still within 3-day grace period
-- This will show the RED WARNING BANNER with countdown

-- For crystarore08@gmail.com

-- Option 1: Expired 1 day ago (Grace Period Day 1 - 2 days left)
UPDATE public.subscriptions
SET 
  status = 'expired',
  started_at = CURRENT_DATE - INTERVAL '4 days',
  expires_at = CURRENT_DATE - INTERVAL '1 day'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Verify
SELECT 
  p.email,
  s.status,
  s.started_at,
  s.expires_at,
  CURRENT_DATE as today,
  (CURRENT_DATE - s.expires_at) as days_since_expired,
  (3 - (CURRENT_DATE - s.expires_at)) as grace_days_left
FROM public.subscriptions s
JOIN auth.users p ON s.user_id = p.id
WHERE p.email = 'crystarore08@gmail.com';

-- Expected banner:
-- 🔴 Trial berakhir
--    Berakhir [yesterday]. Akses akan diblokir dalam 2 hari.
--    ⚠️ Masa tenggang 3 hari — perpanjang sekarang!
