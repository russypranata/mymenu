-- Make plan_type nullable so trial subscriptions don't have a misleading plan type
-- Best practice: plan_type should only be set when user actually buys a plan

-- Drop existing constraint and NOT NULL
ALTER TABLE public.subscriptions
  ALTER COLUMN plan_type DROP NOT NULL,
  ALTER COLUMN plan_type DROP DEFAULT;

-- Drop old check constraint
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Re-add check constraint that allows NULL
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
    CHECK (plan_type IS NULL OR plan_type IN ('monthly', 'annual'));

-- Clear plan_type for trial subscriptions (they don't have a plan yet)
UPDATE public.subscriptions
  SET plan_type = NULL
  WHERE origin = 'trial' AND status IN ('trial', 'expired');

-- Update handle_new_user to NOT set plan_type on trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'user', 'active');

  INSERT INTO public.subscriptions (user_id, status, started_at, expires_at, plan_type, origin)
  VALUES (
    NEW.id,
    'trial',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    NULL,
    'trial'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
