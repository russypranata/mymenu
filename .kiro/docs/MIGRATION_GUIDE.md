# Migration Guide: Advanced Theme Customization

## Problem
Error: `Could not find the 'accent_color' column of 'store_settings' in the schema cache`

## Root Cause
Database migration belum dijalankan di production. Column baru belum ada di database.

## Solution

### Step 1: Run Migration in Supabase

1. **Login ke Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste Migration SQL**
   ```sql
   -- Add advanced theme customization fields to store_settings
   ALTER TABLE store_settings
   ADD COLUMN IF NOT EXISTS dark_mode_enabled boolean DEFAULT false,
   ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#10b981',
   ADD COLUMN IF NOT EXISTS border_radius text DEFAULT 'rounded' CHECK (border_radius IN ('sharp', 'rounded', 'pill')),
   ADD COLUMN IF NOT EXISTS card_style text DEFAULT 'card' CHECK (card_style IN ('minimal', 'card', 'elevated')),
   ADD COLUMN IF NOT EXISTS text_size text DEFAULT 'md' CHECK (text_size IN ('sm', 'md', 'lg')),
   ADD COLUMN IF NOT EXISTS background_pattern text DEFAULT 'none' CHECK (background_pattern IN ('none', 'dots', 'grid', 'waves'));

   -- Add comments for documentation
   COMMENT ON COLUMN store_settings.dark_mode_enabled IS 'Enable dark mode toggle for customers';
   COMMENT ON COLUMN store_settings.accent_color IS 'Secondary accent color for buttons, badges, etc';
   COMMENT ON COLUMN store_settings.border_radius IS 'Border radius style: sharp (0px), rounded (12px), pill (24px)';
   COMMENT ON COLUMN store_settings.card_style IS 'Menu card visual style';
   COMMENT ON COLUMN store_settings.text_size IS 'Base text size scale';
   COMMENT ON COLUMN store_settings.background_pattern IS 'Subtle background pattern';
   ```

4. **Run the Query**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for success message

5. **Verify Migration**
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'store_settings' 
   AND column_name IN (
     'dark_mode_enabled', 
     'accent_color', 
     'border_radius', 
     'card_style', 
     'text_size', 
     'background_pattern'
   )
   ORDER BY column_name;
   ```
   
   Should return 6 rows with the new columns.

### Step 2: Restart Application (if needed)

If using Vercel or similar:
1. Go to your deployment dashboard
2. Trigger a redeploy or wait for automatic deployment
3. Or just wait a few minutes for cache to clear

### Step 3: Verify Fix

1. Login to your application
2. Go to Store Settings page
3. Error should be gone
4. New theme customization options should appear

## Alternative: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Apply migration
supabase db push

# Or apply specific migration
supabase migration up
```

## Error Handling Improvements

We've also improved error handling so technical errors don't show to users:

### Before:
```
Error: Could not find the 'accent_color' column of 'store_settings' in the schema cache
```
❌ Technical error exposed to user

### After:
```
Sistem sedang dalam pembaruan. Silakan coba lagi dalam beberapa saat.
```
✅ User-friendly message

### Changes Made:

1. **Dashboard Error Handler** (`src/app/(dashboard)/error.tsx`)
   - Detects schema errors
   - Shows user-friendly message
   - Logs technical details only in development

2. **Global Error Handler** (`src/app/error.tsx`)
   - Same improvements
   - Consistent error messaging

3. **Settings Page** (`src/app/(dashboard)/store/[id]/settings/page.tsx`)
   - Graceful handling of missing columns
   - Doesn't crash if schema mismatch
   - Logs errors appropriately

## Best Practices Applied

### ✅ Security
- Technical errors not exposed to users
- Error details only logged in development
- Production errors sent to monitoring service

### ✅ User Experience
- Clear, actionable error messages
- No technical jargon
- Retry functionality available

### ✅ Developer Experience
- Errors still logged for debugging
- Clear migration instructions
- Easy to verify success

## Rollback (if needed)

If you need to rollback the migration:

```sql
ALTER TABLE store_settings
DROP COLUMN IF EXISTS dark_mode_enabled,
DROP COLUMN IF EXISTS accent_color,
DROP COLUMN IF EXISTS border_radius,
DROP COLUMN IF EXISTS card_style,
DROP COLUMN IF EXISTS text_size,
DROP COLUMN IF EXISTS background_pattern;
```

⚠️ **Warning**: This will delete data in these columns if any exists.

## Troubleshooting

### Error persists after migration
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check if migration actually ran successfully
4. Verify columns exist in database

### Migration fails
1. Check database permissions
2. Verify table `store_settings` exists
3. Check for conflicting column names
4. Review error message in SQL Editor

### Still seeing technical errors
1. Verify code changes are deployed
2. Check if using latest version
3. Clear application cache
4. Restart application server

## Support

If issues persist:
1. Check Supabase logs
2. Check application logs
3. Verify database schema
4. Contact support with error details

## Summary

✅ Migration SQL ready to run
✅ Error handling improved
✅ User experience protected
✅ Developer debugging maintained
✅ Clear rollback path available

Run the migration and the error will be resolved!
