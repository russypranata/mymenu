-- Enforce one active/trial subscription per user at the DB level.
-- Prevents duplicate active subscriptions from race conditions or bugs.
--
-- Strategy: partial unique index — only one row per user_id where status
-- is 'active' or 'trial'. Expired/cancelled subscriptions are kept as
-- historical records and are not constrained.

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_active_per_user
  ON public.subscriptions (user_id)
  WHERE status IN ('active', 'trial');
