-- Update handle_new_user to create a 3-day trial subscription on signup (was 7 days)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'user', 'active');

  -- Create 3-day trial subscription automatically
  INSERT INTO public.subscriptions (user_id, status, started_at, expires_at)
  VALUES (
    NEW.id,
    'trial',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
