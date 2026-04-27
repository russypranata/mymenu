-- Add plan_type column to subscriptions table
-- Supports 'monthly' (30 days) and 'annual' (365 days) subscription plans

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'monthly'
  CONSTRAINT subscriptions_plan_type_check
    CHECK (plan_type IN ('monthly', 'annual'));

-- Backfill existing rows (safety net, DEFAULT handles new rows)
UPDATE public.subscriptions
  SET plan_type = 'monthly'
  WHERE plan_type IS NULL;

-- Update handle_new_user to include plan_type = 'monthly' on trial INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'user', 'active');

  -- Create 3-day trial subscription automatically with plan_type
  INSERT INTO public.subscriptions (user_id, status, started_at, expires_at, plan_type)
  VALUES (
    NEW.id,
    'trial',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    'monthly'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
