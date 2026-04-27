-- Create subscription_history table
-- Records every subscription period for audit trail and user transparency

CREATE TABLE IF NOT EXISTS public.subscription_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type   TEXT NOT NULL DEFAULT 'monthly'
              CONSTRAINT subscription_history_plan_type_check
              CHECK (plan_type IN ('monthly', 'annual', 'trial')),
  origin      TEXT NOT NULL DEFAULT 'trial'
              CONSTRAINT subscription_history_origin_check
              CHECK (origin IN ('trial', 'paid')),
  started_at  TIMESTAMPTZ NOT NULL,
  ended_at    TIMESTAMPTZ,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS subscription_history_user_id_idx
  ON public.subscription_history(user_id, created_at DESC);

-- RLS: users can only read their own history; admins can read all
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription history"
  ON public.subscription_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscription history"
  ON public.subscription_history
  FOR ALL
  USING (public.is_admin());

-- Backfill: insert history record for all existing subscriptions
-- so history is not empty after migration
-- Use 'trial' plan_type for trial origin, actual plan_type for paid origin
INSERT INTO public.subscription_history (user_id, plan_type, origin, started_at, ended_at, note, created_at)
SELECT
  user_id,
  CASE 
    WHEN origin = 'trial' THEN 'trial'
    ELSE COALESCE(plan_type, 'monthly')
  END,
  origin,
  COALESCE(started_at, created_at),
  CASE WHEN status IN ('expired') THEN expires_at ELSE NULL END,
  'Migrasi data awal',
  created_at
FROM public.subscriptions
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_history sh 
  WHERE sh.user_id = subscriptions.user_id
);

-- Trigger: auto-insert history when a new trial subscription is created on signup
-- This handles new user registrations going forward
CREATE OR REPLACE FUNCTION public.handle_new_subscription_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-insert for trial origin (signup flow)
  -- Paid activations are inserted by admin server actions
  IF NEW.origin = 'trial' AND (TG_OP = 'INSERT') THEN
    INSERT INTO public.subscription_history (user_id, plan_type, origin, started_at, ended_at, note)
    VALUES (
      NEW.user_id,
      'trial',
      'trial',
      COALESCE(NEW.started_at, NOW()),
      NEW.expires_at,
      'Trial gratis 3 hari'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_insert_subscription_history ON public.subscriptions;
CREATE TRIGGER auto_insert_subscription_history
  AFTER INSERT ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription_history();
