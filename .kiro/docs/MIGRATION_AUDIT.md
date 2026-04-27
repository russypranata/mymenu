# Migration Files Audit Report

## Overview

Audit semua migration files di `supabase/migrations/` untuk memastikan:
1. ✅ Semua file valid dan bisa dijalankan
2. ✅ Tidak ada konflik antar migration
3. ✅ Urutan migration sudah benar
4. ⚠️ Identifikasi naming issues

## Migration Files List (30 files)

### Initial Schema (001-009)
| # | File | Status | Purpose |
|---|------|--------|---------|
| 001 | `profiles.sql` | ✅ Valid | Create profiles table |
| 002 | `stores.sql` | ✅ Valid | Create stores table |
| 003 | `categories.sql` | ✅ Valid | Create categories table |
| 004 | `menus.sql` | ✅ Valid | Create menus table |
| 005 | `subscriptions.sql` | ✅ Valid | Create subscriptions table |
| 006 | `store_settings.sql` | ✅ Valid | Create store_settings table |
| 007 | `analytics.sql` | ✅ Valid | Create analytics table |
| 008 | `profile_columns.sql` | ✅ Valid | Add columns to profiles |
| 009 | `avatars_bucket.sql` | ✅ Valid | Create avatars storage bucket |

### Fixes & Features (010-019)
| # | File | Status | Purpose |
|---|------|--------|---------|
| 010 | `fix_profiles_rls.sql` | ✅ Valid | Fix RLS infinite recursion |
| 011 | `menu_images_bucket.sql` | ✅ Valid | Create menu images bucket |
| 012 | `store_assets_bucket.sql` | ✅ Valid | Create store assets bucket |
| 013 | `auto_expire_subscriptions.sql` | ✅ Valid | Auto-expire function |
| **013b** | `store_settings_extended.sql` | ⚠️ **Naming Issue** | Extend store_settings |
| 014 | `auto_trial_on_signup.sql` | ✅ Valid | Auto-create trial on signup |
| **014b** | `menu_extra_images.sql` | ⚠️ **Naming Issue** | Add extra_images to menus |
| 015 | `schedule_expire_subscriptions.sql` | ✅ Valid | Schedule expiry with pg_cron |
| 016 | `subscription_unique_constraint.sql` | ✅ Valid | One active sub per user |
| 017 | `store_contact_social.sql` | ✅ Valid | Add contact & social fields |
| 018 | `analytics_improvements.sql` | ✅ Valid | Improve analytics table |
| 019 | `add_phone_to_profiles.sql` | ✅ Valid | Add phone to profiles |

### Recent Features (020-029)
| # | File | Status | Purpose |
|---|------|--------|---------|
| 020 | `store_locations.sql` | ✅ Valid | Add store locations |
| 021 | `enable_ordering_toggle.sql` | ✅ Valid | Add ordering toggle |
| 022 | `simplify_contact_structure.sql` | ✅ Valid | Simplify contact fields |
| 023 | `advanced_theme_customization.sql` | ✅ Valid | Add theme options |
| 024 | `update_trial_to_3_days.sql` | ✅ Valid | Change trial to 3 days |
| 025 | `analytics_retention_90_days.sql` | ✅ Valid | 90-day retention policy |
| 026 | `menu_section_text_customization.sql` | ✅ Valid | Customizable menu text |
| 027 | `add_plan_type_to_subscriptions.sql` | ✅ Valid | Add monthly/annual plans |
| 028 | `add_origin_to_subscriptions.sql` | ✅ Valid | Add trial/paid origin |
| 029 | `subscription_history.sql` | ✅ Valid | Create history table |

## Issues Found

### ⚠️ Issue 1: Naming Convention - Files with "b" suffix

**Files:**
- `013b_store_settings_extended.sql`
- `014b_menu_extra_images.sql`

**Problem:**
- Naming dengan suffix "b" tidak standar
- Supabase migrations biasanya menggunakan numbering sequential
- Bisa menyebabkan confusion tentang urutan eksekusi

**Impact:**
- ✅ **Tidak ada masalah teknis** - Supabase akan run berdasarkan alphabetical order
- ✅ File akan dijalankan setelah 013 dan 014 (karena "013b" > "013")
- ⚠️ **Hanya masalah naming convention**

**Execution Order:**
```
013_auto_expire_subscriptions.sql      ← First
013b_store_settings_extended.sql       ← Second (alphabetically after 013)
014_auto_trial_on_signup.sql           ← Third
014b_menu_extra_images.sql             ← Fourth (alphabetically after 014)
015_schedule_expire_subscriptions.sql  ← Fifth
```

**Recommendation:**
- ✅ **Keep as is** - Tidak perlu diubah karena sudah berjalan di production
- ✅ Untuk migration baru, gunakan numbering sequential (030, 031, dst)
- ⚠️ Jangan rename file yang sudah ada (bisa break migration history)

### ✅ Issue 2: Function Overwrites (Expected Behavior)

**Files that overwrite functions:**
- `014_auto_trial_on_signup.sql` - Creates `handle_new_user()` (7 days trial)
- `024_update_trial_to_3_days.sql` - Overwrites `handle_new_user()` (3 days trial)
- `027_add_plan_type_to_subscriptions.sql` - Overwrites `handle_new_user()` (adds plan_type)
- `028_add_origin_to_subscriptions.sql` - Overwrites `handle_new_user()` (adds origin)

**Status:** ✅ **This is correct behavior**
- Each migration updates the function with new requirements
- Latest version (028) is the current implementation
- This is standard practice for evolving functions

### ✅ Issue 3: Backfill Logic in Migration 029

**File:** `029_subscription_history.sql`

**Original Issue:**
```sql
-- OLD (Wrong)
CASE WHEN status = 'trial' THEN 'trial' ELSE plan_type END
```

**Fixed:**
```sql
-- NEW (Correct)
CASE 
  WHEN origin = 'trial' THEN 'trial'
  ELSE COALESCE(plan_type, 'monthly')
END
```

**Status:** ✅ **Already fixed in this PR**

## Validation Checks

### ✅ Check 1: No Duplicate Table Creations
```sql
-- All CREATE TABLE use IF NOT EXISTS
-- No conflicts found
```

### ✅ Check 2: No Conflicting Column Additions
```sql
-- All ALTER TABLE use ADD COLUMN IF NOT EXISTS
-- No conflicts found
```

### ✅ Check 3: Function Dependencies
```sql
-- Functions are properly ordered
-- is_admin() created before used in policies
-- handle_new_user() properly evolved through migrations
```

### ✅ Check 4: RLS Policies
```sql
-- Policies properly use SECURITY DEFINER functions
-- No infinite recursion issues (fixed in 010)
```

### ✅ Check 5: Foreign Key Constraints
```sql
-- All foreign keys reference existing tables
-- Proper ON DELETE CASCADE where needed
```

## Migration Execution Order

Supabase runs migrations in **alphabetical order**:

```
001_profiles.sql
002_stores.sql
003_categories.sql
004_menus.sql
005_subscriptions.sql
006_store_settings.sql
007_analytics.sql
008_profile_columns.sql
009_avatars_bucket.sql
010_fix_profiles_rls.sql
011_menu_images_bucket.sql
012_store_assets_bucket.sql
013_auto_expire_subscriptions.sql
013b_store_settings_extended.sql      ← After 013
014_auto_trial_on_signup.sql
014b_menu_extra_images.sql            ← After 014
015_schedule_expire_subscriptions.sql
016_subscription_unique_constraint.sql
017_store_contact_social.sql
018_analytics_improvements.sql
019_add_phone_to_profiles.sql
020_store_locations.sql
021_enable_ordering_toggle.sql
022_simplify_contact_structure.sql
023_advanced_theme_customization.sql
024_update_trial_to_3_days.sql
025_analytics_retention_90_days.sql
026_menu_section_text_customization.sql
027_add_plan_type_to_subscriptions.sql
028_add_origin_to_subscriptions.sql
029_subscription_history.sql
```

## Recommendations

### For Existing Migrations
1. ✅ **Do NOT rename or reorder** - Migration history must be preserved
2. ✅ **Keep 013b and 014b as is** - Already in production
3. ✅ **All migrations are valid** - No technical issues

### For New Migrations
1. ✅ Use sequential numbering: `030_`, `031_`, `032_`, etc.
2. ✅ Use descriptive names: `030_add_feature_name.sql`
3. ✅ Always use `IF NOT EXISTS` for idempotency
4. ✅ Always use `CREATE OR REPLACE` for functions
5. ✅ Test locally before deploying

### Migration Best Practices
```sql
-- ✅ Good: Idempotent
ALTER TABLE table_name 
ADD COLUMN IF NOT EXISTS column_name TYPE;

-- ❌ Bad: Will fail if run twice
ALTER TABLE table_name 
ADD COLUMN column_name TYPE;

-- ✅ Good: Can be run multiple times
CREATE OR REPLACE FUNCTION func_name() ...

-- ❌ Bad: Will fail if function exists
CREATE FUNCTION func_name() ...
```

## Summary

### Overall Status: ✅ ALL MIGRATIONS VALID

| Category | Count | Status |
|----------|-------|--------|
| Total Migrations | 30 | ✅ All Valid |
| Naming Issues | 2 | ⚠️ Cosmetic Only |
| Technical Issues | 0 | ✅ None |
| Conflicts | 0 | ✅ None |
| Dependencies | All OK | ✅ Resolved |

### Key Findings

1. ✅ **All migrations are technically valid**
2. ✅ **No conflicts or breaking changes**
3. ✅ **Proper use of IF NOT EXISTS and CREATE OR REPLACE**
4. ⚠️ **Minor naming inconsistency** (013b, 014b) - cosmetic only
5. ✅ **Function evolution is correct** (handle_new_user updates)
6. ✅ **Migration 029 backfill logic fixed** in this PR

### Action Items

- ✅ **No action needed** for existing migrations
- ✅ **Continue with deployment** - all migrations safe to run
- ✅ **Use sequential numbering** for future migrations (030+)
- ✅ **Document migration 029 fix** in changelog

## Conclusion

**All migration files in `supabase/migrations/` are valid and safe to deploy.**

The only "issue" is cosmetic naming (013b, 014b) which doesn't affect functionality. These should be kept as-is to preserve migration history.

New migrations (028, 029) are properly structured and will run correctly in production.

✅ **Ready for deployment!**
