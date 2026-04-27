-- Add origin column to subscriptions table
-- Tracks whether a subscription originated from trial or paid activation
-- 'trial'  = created automatically on signup, never activated by admin
-- 'paid'   = activated by admin after payment confirmation

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'trial'
  CONSTRAINT subscriptions_origin_check
    CHECK (origin IN ('trial', 'paid'));

-- Backfill: existing subscriptions that were active or are currently active
-- are considered paid; everything else stays as trial
UPDATE public.subscriptions
  SET origin = 'paid'
  WHERE status = 'active';

-- Update handle_new_user to explicitly set origin = 'trial' on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'user', 'active');

  -- Create 3-day trial subscription with explicit origin
  INSERT INTO public.subscriptions (user_id, status, started_at, expires_at, plan_type, origin)
  VALUES (
    NEW.id,
    'trial',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    'monthly',
    'trial'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
