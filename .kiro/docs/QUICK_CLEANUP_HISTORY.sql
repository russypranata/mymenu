-- QUICK CLEANUP: Remove all subscription history for crystarore08@gmail.com
-- System will auto-create new history when subscription changes

-- Delete all history
DELETE FROM public.subscription_history
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'crystarore08@gmail.com'
);

-- Verify - should be empty
SELECT COUNT(*) as history_count
FROM public.subscription_history sh
JOIN auth.users u ON sh.user_id = u.id
WHERE u.email = 'crystarore08@gmail.com';

-- Expected: history_count = 0

-- Note: History will be auto-created when:
-- 1. Admin activates subscription
-- 2. Subscription expires and user renews
-- 3. Admin extends subscription
