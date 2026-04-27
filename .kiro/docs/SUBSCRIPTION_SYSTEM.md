# Subscription System Documentation

## Overview

Sistem langganan Menuly mendukung trial gratis dan paket berbayar (bulanan/tahunan).

## Database Schema

### Table: `subscriptions`

Menyimpan status langganan aktif user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key ke profiles |
| `status` | TEXT | Status: 'trial', 'active', 'expired' |
| `plan_type` | TEXT | Jenis paket: 'trial', 'monthly', 'annual' |
| `origin` | TEXT | Asal langganan: 'trial', 'paid' |
| `started_at` | TIMESTAMPTZ | Tanggal mulai |
| `expires_at` | TIMESTAMPTZ | Tanggal berakhir |
| `created_at` | TIMESTAMPTZ | Tanggal dibuat |

### Table: `subscription_history`

Menyimpan riwayat semua periode langganan untuk audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key ke profiles |
| `plan_type` | TEXT | Jenis paket: 'trial', 'monthly', 'annual' |
| `origin` | TEXT | Asal langganan: 'trial', 'paid' |
| `started_at` | TIMESTAMPTZ | Tanggal mulai periode |
| `ended_at` | TIMESTAMPTZ | Tanggal berakhir periode (nullable) |
| `note` | TEXT | Catatan tambahan |
| `created_at` | TIMESTAMPTZ | Tanggal record dibuat |

## Business Rules

### 1. Trial Subscription

- **Duration**: 3 hari
- **Origin**: `'trial'`
- **Plan Type**: `'trial'` (di history) atau `'monthly'` (di subscriptions)
- **Display**: Selalu tampilkan sebagai "Trial Gratis"
- **Badge**: Amber (kuning)

**Contoh:**
```sql
-- subscriptions table
origin = 'trial', plan_type = 'monthly', status = 'trial'

-- subscription_history table
origin = 'trial', plan_type = 'trial'
```

### 2. Paid Subscription - Monthly

- **Duration**: 30 hari
- **Price**: Rp20.000
- **Origin**: `'paid'`
- **Plan Type**: `'monthly'`
- **Display**: "Paket Bulanan"
- **Badge**: Light green

### 3. Paid Subscription - Annual

- **Duration**: 365 hari
- **Price**: Rp200.000
- **Origin**: `'paid'`
- **Plan Type**: `'annual'`
- **Display**: "Paket Tahunan"
- **Badge**: Dark green
- **Savings**: Rp40.000 vs 12x monthly

## Display Logic

### Determining Plan Label

```typescript
function getPlanLabel(planType: string, origin: string): string {
  // ALWAYS check origin first
  if (origin === 'trial') return 'Trial Gratis'
  
  // For paid subscriptions, use plan_type
  if (planType === 'annual') return 'Paket Tahunan'
  return 'Paket Bulanan'
}
```

### Badge Styling

```typescript
function getPlanBadgeClass(planType: string, origin: string): string {
  // Trial: amber badge
  if (origin === 'trial') return 'bg-amber-50 text-amber-600 border border-amber-100'
  
  // Annual: dark green badge
  if (planType === 'annual') return 'bg-green-800 text-white'
  
  // Monthly: light green badge
  return 'bg-green-100 text-green-700 border border-green-200'
}
```

## User Journey

### 1. New User Registration

```
1. User registers → trigger: handle_new_user()
2. Create profile with status = 'active'
3. Create subscription: status = 'trial', origin = 'trial', plan_type = 'monthly'
4. Auto-insert history: plan_type = 'trial', origin = 'trial'
5. User gets 3 days free trial
```

### 2. Trial to Paid Conversion

```
1. User contacts admin via WhatsApp
2. User transfers payment (Rp20k or Rp200k)
3. Admin activates subscription via admin panel
4. Update subscription: status = 'active', origin = 'paid', plan_type = 'monthly'/'annual'
5. Insert history: origin = 'paid', plan_type = 'monthly'/'annual'
6. Send WhatsApp confirmation
```

### 3. Subscription Renewal

```
1. User contacts admin before expiry
2. User transfers payment
3. Admin extends subscription via admin panel
4. Update expires_at, set status = 'active', origin = 'paid'
5. Insert new history record
6. Send WhatsApp confirmation
```

### 4. Subscription Expiry

```
1. Cron job runs daily (pg_cron)
2. Check subscriptions where expires_at < NOW()
3. Update status = 'expired'
4. User loses access to features
5. Redirect to suspended page
```

## Helper Functions

### Location: `src/lib/subscription-helpers.ts`

Centralized utilities untuk konsistensi display:

- `getPlanLabel(planType, origin)` - Get human-readable label
- `getPlanBadgeClass(planType, origin)` - Get Tailwind CSS classes
- `getPlanAmount(planType)` - Get formatted price
- `getPlanDuration(planType)` - Get duration label
- `getDaysUntilExpiry(expiresAt)` - Calculate days remaining
- `isSubscriptionActive(expiresAt)` - Check if still active

## Components

### SubscriptionBanner

**Location**: `src/components/subscription-banner.tsx`

Menampilkan status langganan di dashboard layout.

**Props:**
- `status`: 'trial' | 'active' | 'expired'
- `planType`: 'monthly' | 'annual' | null
- `origin`: 'trial' | 'paid' | null
- `expiresAt`: string | null
- `daysUntilExpiry`: number | null

### SubscriptionSection

**Location**: `src/components/subscription-section.tsx`

Menampilkan detail langganan dan tombol perpanjangan di halaman profile.

**Features:**
- Display current subscription info
- Payment modal with QRIS
- Plan selector (monthly/annual)
- WhatsApp integration

### SubscriptionHistorySection

**Location**: `src/components/subscription-history.tsx`

Menampilkan riwayat semua periode langganan.

**Features:**
- List all subscription periods
- Show active/expired status
- Display plan badges correctly based on origin
- Show notes for each period

## Admin Actions

### Location: `src/lib/actions/admin.ts`

#### createTrialSubscription(userId)

Membuat trial subscription baru untuk user.

```typescript
// Creates 3-day trial
// Inserts history with plan_type = 'trial', origin = 'trial'
```

#### updateSubscription(subscriptionId, data)

Update subscription status/plan.

```typescript
// When activating: set origin = 'paid'
// Insert history record
// Send WhatsApp notification
```

#### extendSubscription(subscriptionId, days)

Perpanjang subscription dengan X hari.

```typescript
// Extend expires_at
// Set status = 'active', origin = 'paid'
// Insert history record
// Send WhatsApp notification
```

## Testing Checklist

### Display Tests

- [ ] Trial subscription shows "Trial Gratis" with amber badge
- [ ] Monthly paid shows "Paket Bulanan" with light green badge
- [ ] Annual paid shows "Paket Tahunan" with dark green badge
- [ ] History correctly shows all periods
- [ ] Active period has green dot indicator
- [ ] Expired period has gray dot indicator

### Flow Tests

- [ ] New user gets 3-day trial automatically
- [ ] Trial to monthly conversion works
- [ ] Trial to annual conversion works
- [ ] Monthly renewal works
- [ ] Annual renewal works
- [ ] Expiry redirects to suspended page
- [ ] WhatsApp notifications sent correctly

### Edge Cases

- [ ] User with no subscription history
- [ ] User with multiple trial periods
- [ ] User switching from monthly to annual
- [ ] User with expired trial then paid subscription
- [ ] Admin extending already expired subscription

## Migration History

1. **024**: Update trial duration to 3 days
2. **027**: Add plan_type column (monthly/annual)
3. **028**: Add origin column (trial/paid)
4. **029**: Create subscription_history table with correct backfill logic

**Note**: If migration 029 was already run with old logic, use the manual fix script in `.kiro/docs/FIX_SUBSCRIPTION_HISTORY.sql`

## Best Practices

### 1. Always Check Origin First

```typescript
// ❌ Wrong
if (planType === 'trial') return 'Trial Gratis'

// ✅ Correct
if (origin === 'trial') return 'Trial Gratis'
```

### 2. Use Helper Functions

```typescript
// ❌ Wrong - duplicated logic
const label = planType === 'annual' ? 'Paket Tahunan' : 'Paket Bulanan'

// ✅ Correct - centralized
const label = getPlanLabel(planType, origin)
```

### 3. Insert History on Every Change

```typescript
// When activating/extending subscription
await supabase.from('subscription_history').insert({
  user_id,
  plan_type,
  origin,
  started_at,
  ended_at,
  note: 'Descriptive note'
})
```

### 4. Validate Plan Type

```typescript
if (data.plan_type && !['monthly', 'annual'].includes(data.plan_type)) {
  return { error: 'Jenis paket tidak valid.' }
}
```

## Troubleshooting

### Issue: Trial shows as "Paket Bulanan"

**Cause**: Checking `plan_type` instead of `origin`

**Fix**: Always check `origin === 'trial'` first

### Issue: History shows wrong badge colors

**Cause**: Not passing `origin` to badge function

**Fix**: Use `getPlanBadgeClass(planType, origin)`

### Issue: Inconsistent data in history

**Cause**: Old migration backfill used wrong logic

**Fix**: Run migration 030 to fix existing data

## Future Enhancements

- [ ] Automatic payment via payment gateway
- [ ] Promo codes / discount system
- [ ] Quarterly plan option
- [ ] Grace period after expiry
- [ ] Email notifications
- [ ] Subscription analytics dashboard
