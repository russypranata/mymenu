-- ============================================
-- FIX SUBSCRIPTION HISTORY - TRIAL RECORDS
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- 
-- What it does:
-- - Updates all trial origin records to have plan_type = 'trial'
-- - Ensures consistent display: trial origin always shows "Trial Gratis"
-- - Fixes the issue where trial shows as "Paket Bulanan"
--
-- Safe to run multiple times (idempotent)
-- ============================================

-- Step 1: Check current state
SELECT 
  origin,
  plan_type,
  COUNT(*) as count
FROM public.subscription_history
GROUP BY origin, plan_type
ORDER BY origin, plan_type;

-- Step 2: Fix trial records
UPDATE public.subscription_history
SET plan_type = 'trial'
WHERE origin = 'trial' AND plan_type != 'trial';

-- Step 3: Verify the fix
SELECT 
  origin,
  plan_type,
  COUNT(*) as count
FROM public.subscription_history
GROUP BY origin, plan_type
ORDER BY origin, plan_type;

-- Expected result after fix:
-- origin | plan_type | count
-- -------+-----------+-------
-- trial  | trial     | X
-- paid   | monthly   | Y
-- paid   | annual    | Z

-- Step 4: Check sample records
SELECT 
  user_id,
  plan_type,
  origin,
  started_at,
  ended_at,
  note,
  created_at
FROM public.subscription_history
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Find any remaining inconsistent records
SELECT 
  id,
  user_id,
  plan_type,
  origin,
  note
FROM public.subscription_history
WHERE origin = 'trial' AND plan_type != 'trial';
-- Should return 0 rows

-- 2. Check all trial records are correct
SELECT 
  COUNT(*) as trial_records_count
FROM public.subscription_history
WHERE origin = 'trial' AND plan_type = 'trial';
-- Should match total trial records

-- 3. Check paid records are not affected
SELECT 
  origin,
  plan_type,
  COUNT(*) as count
FROM public.subscription_history
WHERE origin = 'paid'
GROUP BY origin, plan_type;
-- Should show monthly and annual counts unchanged

-- ============================================
-- ROLLBACK (if needed)
-- ============================================
-- If you need to rollback, you can restore from backup
-- or manually update specific records:
-- 
-- UPDATE public.subscription_history
-- SET plan_type = 'monthly'
-- WHERE origin = 'trial' AND plan_type = 'trial';
-- 
-- (Not recommended - the fix is the correct state)
-- ============================================
