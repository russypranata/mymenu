-- Add phone column to profiles for WhatsApp contact
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
