# Documentation

This folder contains technical documentation and SQL scripts for the Menuly application.

## Files

### System Documentation

- **[SUBSCRIPTION_SYSTEM.md](./SUBSCRIPTION_SYSTEM.md)** - Comprehensive guide to the subscription system
  - Database schema
  - Business rules
  - Display logic
  - User journey flows
  - Helper functions
  - Best practices
  - Troubleshooting

### SQL Scripts

#### Migration Scripts (Auto-run by Supabase)

All migration files are in `supabase/migrations/` and run automatically in order:

- `001-019` - Initial schema setup
- `020_store_locations.sql` - Add store locations support
- `021_enable_ordering_toggle.sql` - Add ordering on/off toggle
- `022_simplify_contact_structure.sql` - Simplify contact fields
- `023_advanced_theme_customization.sql` - Add theme customization
- `024_update_trial_to_3_days.sql` - Update trial duration
- `025_analytics_retention_90_days.sql` - Analytics retention policy
- `026_menu_section_text_customization.sql` - Customizable menu section text
- `027_add_plan_type_to_subscriptions.sql` - Add plan type support
- `028_add_origin_to_subscriptions.sql` - Add origin tracking
- `029_subscription_history.sql` - Create history table

#### Manual Fix Scripts (Run as Needed)

- **[FIX_SUBSCRIPTION_HISTORY.sql](./FIX_SUBSCRIPTION_HISTORY.sql)** - Fix existing trial records in production
  - Updates trial origin records to have correct plan_type
  - Includes verification queries
  - Safe to run multiple times (idempotent)
  - **Run this ONLY if migration 029 was already executed with old logic**
  - **For new deployments, migration 029 already has correct logic**

## How to Use

### For Developers

1. Read `SUBSCRIPTION_SYSTEM.md` to understand the subscription architecture
2. Use helper functions from `src/lib/subscription-helpers.ts`
3. Follow best practices documented in the system guide
4. Run unit tests: `npm test subscription-helpers`

### For Database Administrators

1. Check current state with verification queries
2. Run fix scripts in Supabase Dashboard > SQL Editor
3. Verify results with provided queries
4. Monitor subscription_history table for consistency

### For Troubleshooting

If you see issues with subscription display:

1. Check `SUBSCRIPTION_SYSTEM.md` > Troubleshooting section
2. Run `FIX_SUBSCRIPTION_HISTORY.sql` to fix data
3. Verify helper functions are being used correctly
4. Check that components import from `subscription-helpers.ts`

## Quick Reference

### Display Rules

```typescript
// ✅ Correct: Check origin first
if (origin === 'trial') return 'Trial Gratis'

// ❌ Wrong: Checking plan_type only
if (planType === 'trial') return 'Trial Gratis'
```

### Badge Colors

- **Trial** (origin='trial'): Amber badge
- **Monthly Paid** (origin='paid', plan_type='monthly'): Light green badge
- **Annual Paid** (origin='paid', plan_type='annual'): Dark green badge

### Helper Functions

```typescript
import {
  getPlanLabel,
  getPlanBadgeClass,
  getPlanAmount,
  getPlanDuration,
  getDaysUntilExpiry,
  isSubscriptionActive,
} from '@/lib/subscription-helpers'

// Usage
const label = getPlanLabel(planType, origin)
const badgeClass = getPlanBadgeClass(planType, origin)
const amount = getPlanAmount('monthly') // "Rp20.000"
const duration = getPlanDuration('annual') // "/tahun"
const days = getDaysUntilExpiry(expiresAt) // number | null
const isActive = isSubscriptionActive(expiresAt) // boolean
```

## Contributing

When making changes to the subscription system:

1. Update `SUBSCRIPTION_SYSTEM.md` documentation
2. Add/update unit tests in `src/lib/__tests__/subscription-helpers.test.ts`
3. Create migration file if schema changes
4. Update this README if adding new scripts
5. Test thoroughly with all subscription types (trial, monthly, annual)
6. Update CHANGELOG.md

## Support

For questions or issues:

1. Check documentation first
2. Review troubleshooting section
3. Check existing migrations and fix scripts
4. Contact development team if issue persists
