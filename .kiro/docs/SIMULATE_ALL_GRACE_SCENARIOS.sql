-- SIMULATE ALL GRACE PERIOD SCENARIOS
-- Run these one by one to see different banner states

-- ========================================
-- SCENARIO 1: Grace Period Day 1 (2 days left)
-- ========================================
UPDATE public.subscriptions
SET 
  status = 'expired',
  started_at = CURRENT_DATE - INTERVAL '4 days',
  expires_at = CURRENT_DATE - INTERVAL '1 day'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Expected Banner:
-- 🔴 Trial berakhir
--    Berakhir 26 April 2026. Akses akan diblokir dalam 2 hari.
--    ⚠️ Masa tenggang 3 hari — perpanjang sekarang!

-- ========================================
-- SCENARIO 2: Grace Period Day 2 (1 day left)
-- ========================================
UPDATE public.subscriptions
SET 
  status = 'expired',
  started_at = CURRENT_DATE - INTERVAL '5 days',
  expires_at = CURRENT_DATE - INTERVAL '2 days'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Expected Banner:
-- 🔴 Trial berakhir
--    Berakhir 25 April 2026. Akses akan diblokir dalam 1 hari.
--    ⚠️ Masa tenggang 3 hari — perpanjang sekarang!

-- ========================================
-- SCENARIO 3: Grace Period Day 3 (Last day - 0 days left)
-- ========================================
UPDATE public.subscriptions
SET 
  status = 'expired',
  started_at = CURRENT_DATE - INTERVAL '6 days',
  expires_at = CURRENT_DATE - INTERVAL '3 days'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Expected Banner:
-- 🔴 Trial berakhir
--    Berakhir 24 April 2026. Akses akan diblokir besok!
--    ⚠️ Masa tenggang 3 hari — perpanjang sekarang!

-- ========================================
-- SCENARIO 4: Grace Period ENDED (Will be BLOCKED)
-- ========================================
UPDATE public.subscriptions
SET 
  status = 'expired',
  started_at = CURRENT_DATE - INTERVAL '7 days',
  expires_at = CURRENT_DATE - INTERVAL '4 days'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Expected Result:
-- ❌ CANNOT ACCESS DASHBOARD
-- 🚫 Redirect to /subscription-expired

-- ========================================
-- VERIFY CURRENT STATE
-- ========================================
SELECT 
  p.email,
  s.status,
  s.expires_at,
  CURRENT_DATE as today,
  (CURRENT_DATE - s.expires_at) as days_since_expired,
  CASE 
    WHEN (CURRENT_DATE - s.expires_at) <= 3 THEN (3 - (CURRENT_DATE - s.expires_at))
    ELSE 0
  END as grace_days_left,
  CASE 
    WHEN (CURRENT_DATE - s.expires_at) > 3 THEN 'BLOCKED'
    WHEN (CURRENT_DATE - s.expires_at) > 0 THEN 'GRACE_PERIOD'
    ELSE 'ACTIVE'
  END as access_status
FROM public.subscriptions s
JOIN auth.users p ON s.user_id = p.id
WHERE p.email = 'crystarore08@gmail.com';

-- ========================================
-- RESET TO ACTIVE TRIAL (When done testing)
-- ========================================
UPDATE public.subscriptions
SET 
  status = 'trial',
  started_at = CURRENT_DATE,
  expires_at = CURRENT_DATE + INTERVAL '3 days'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);
