-- Expand billing.status to cover every Stripe terminal event we care about,
-- and keep the raw Stripe event for forensics. update_updated_at() is defined
-- in 001_profiles.sql and reused across other tables.

ALTER TABLE billing DROP CONSTRAINT IF EXISTS billing_status_check;

ALTER TABLE billing
  ADD CONSTRAINT billing_status_check
  CHECK (status IN ('pending', 'paid', 'refunded', 'failed', 'disputed', 'expired'));

ALTER TABLE billing
  ADD COLUMN stripe_event JSONB,
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

CREATE TRIGGER billing_updated_at
  BEFORE UPDATE ON billing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
