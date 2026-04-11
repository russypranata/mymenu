-- Add phone number and social media links to store_settings
alter table store_settings
  add column if not exists phone text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists tiktok text;
