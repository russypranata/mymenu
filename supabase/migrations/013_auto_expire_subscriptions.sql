-- Function to auto-expire subscriptions where expires_at has passed
-- Called as a scheduled job or triggered on read
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void AS $$
  UPDATE public.subscriptions
  SET status = 'expired'
  WHERE status IN ('trial', 'active')
    AND expires_at IS NOT NULL
    AND expires_at < CURRENT_DATE;
$$ LANGUAGE sql SECURITY DEFINER;

-- Trigger: auto-expire on any INSERT or UPDATE to subscriptions table
-- This ensures status is always consistent when data changes
CREATE OR REPLACE FUNCTION public.trigger_expire_subscription()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL
     AND NEW.expires_at < CURRENT_DATE
     AND NEW.status IN ('trial', 'active') THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_expire_subscription ON public.subscriptions;
CREATE TRIGGER auto_expire_subscription
  BEFORE INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_expire_subscription();
