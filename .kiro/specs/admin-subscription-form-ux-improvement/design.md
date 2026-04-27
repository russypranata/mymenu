# Design Document: Admin Subscription Form UX Improvement

## Overview

This design adds contextual helper text to the admin subscription edit modal to clarify the difference between manual date editing and automatic subscription extension. The implementation follows a minimal approach: adding helper text and current date display without modifying any existing functionality or business logic.

The design leverages existing patterns from the codebase (Indonesian date formatting, Tailwind styling conventions) and follows industry best practices from platforms like Stripe and AWS admin panels.

## Architecture

### Component Modification Strategy

The implementation modifies only the `SubActions` component (`src/app/(admin)/admin/subscriptions/sub-actions.tsx`). No new components are created, and no changes are made to parent components or server actions.

**Rationale**: The SubActions component already owns the modal UI and has access to all necessary data through props. Adding helper text is purely a presentational change that doesn't require architectural modifications.

### Data Flow

```
page.tsx (parent)
  ├─ Fetches subscription data including expires_at
  ├─ Passes currentExpiresAt prop to SubActions
  └─ SubActions component
      ├─ Receives currentExpiresAt as new prop
      ├─ Formats dates using Indonesian locale
      ├─ Determines if subscription is expired (client-side)
      └─ Renders helper text conditionally
```

**Key Decision**: Date comparison logic runs client-side in the modal component rather than server-side. This is appropriate because:
1. The logic is simple (compare dates)
2. No database queries are needed
3. The modal is already a client component
4. Reduces server load for a UI-only feature

## Components and Interfaces

### Modified Component: SubActions

**File**: `src/app/(admin)/admin/subscriptions/sub-actions.tsx`

**New Prop**:
```typescript
interface SubActionsProps {
  subscriptionId: string
  currentStatus: string
  currentPlanType?: 'monthly' | 'annual'
  currentExpiresAt?: string | null  // NEW: ISO date string from database
}
```

**Helper Functions** (added to component):

```typescript
// Format date to "DD MMMM YYYY" in Indonesian
function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return 'Belum ada tanggal berakhir'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

// Check if subscription is expired (expires_at is today or in the past)
function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return true
  const expiryDate = new Date(dateStr)
  const today = new Date()
  // Set both to midnight for accurate day comparison
  expiryDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return expiryDate.getTime() <= today.getTime()
}
```

**Rationale for Helper Functions**:
- `formatDateLong`: Matches existing date formatting pattern used in `src/lib/actions/admin.ts` (lines 140, 183, 257)
- `isExpired`: Uses `.getTime()` for accurate comparison as specified in requirements (Requirement 6.5)
- Both functions are pure and testable
- Placed inside component to avoid creating new utility files (minimal approach)

### Parent Component: page.tsx

**File**: `src/app/(admin)/admin/subscriptions/page.tsx`

**Modification**: Pass `currentExpiresAt` prop to SubActions component

```typescript
// Before:
<SubActions 
  subscriptionId={sub.id} 
  currentStatus={sub.status ?? ''} 
  currentPlanType={sub.plan_type as 'monthly' | 'annual' ?? 'monthly'} 
/>

// After:
<SubActions 
  subscriptionId={sub.id} 
  currentStatus={sub.status ?? ''} 
  currentPlanType={sub.plan_type as 'monthly' | 'annual' ?? 'monthly'}
  currentExpiresAt={sub.expires_at}  // NEW
/>
```

**Note**: This change is required in both desktop table and mobile card list sections.

## Data Models

No database schema changes are required. The feature uses existing subscription data:

```typescript
// Existing subscription data structure (from getAdminSubscriptions query)
{
  id: string
  status: string | null
  plan_type: string | null
  started_at: string | null
  expires_at: string | null  // Used for helper text
  profiles: {
    email: string
    display_name: string | null
  }
}
```

## UI Modifications

### Manual Edit Section

**Current Structure**:
```
Edit Manual (section title)
├─ Status dropdown
├─ Tanggal Berakhir date picker
└─ Simpan Perubahan button
```

**New Structure**:
```
Edit Manual (section title)
├─ Helper text: "Untuk koreksi data atau set tanggal spesifik"
├─ Current expiry display: "Berakhir saat ini: [formatted date]"
├─ Status dropdown
├─ Tanggal Berakhir date picker
└─ Simpan Perubahan button
```

**Implementation**:
```tsx
<div className="space-y-3">
  <div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      Edit Manual
    </p>
    <p className="text-xs text-gray-400 mt-1">
      Untuk koreksi data atau set tanggal spesifik
    </p>
    <p className="text-xs text-gray-500 mt-1">
      Berakhir saat ini: {formatDateLong(currentExpiresAt)}
    </p>
  </div>
  {/* Existing status dropdown */}
  {/* Existing date picker */}
  {/* Existing save button */}
</div>
```

**Styling Rationale**:
- `text-xs`: Matches existing secondary text size (used in labels, helper text throughout modal)
- `text-gray-400`: Used for helper/hint text (consistent with "Custom perpanjang:" text)
- `text-gray-500`: Used for labels and slightly more prominent secondary text
- `mt-1`: Provides 4px spacing between lines (existing pattern in component)

### Extend Section

**Current Structure**:
```
Perpanjang Langganan (section title)
├─ Quick extend buttons (1 Bulan, 1 Tahun)
└─ Custom extend form
```

**New Structure**:
```
Perpanjang Langganan (section title)
├─ Dynamic helper text (based on expiry status)
├─ Quick extend buttons (1 Bulan, 1 Tahun)
└─ Custom extend form
```

**Implementation**:
```tsx
<div className="border-t border-gray-100 pt-4 space-y-3">
  <div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      Perpanjang Langganan
    </p>
    <p className="text-xs text-gray-400 mt-1">
      {isExpired(currentExpiresAt)
        ? 'Langganan sudah expired, akan extend dari hari ini'
        : `Otomatis extend dari tanggal berakhir saat ini: ${formatDateLong(currentExpiresAt)}`}
    </p>
  </div>
  {/* Existing quick extend buttons */}
  {/* Existing custom extend form */}
</div>
```

**Conditional Logic**:
- If `isExpired(currentExpiresAt)` returns `true`: Show "akan extend dari hari ini"
- If `isExpired(currentExpiresAt)` returns `false`: Show "Otomatis extend dari..." with formatted date
- This matches the existing business logic in `extendSubscription` action (lines 218-226 in `src/lib/actions/admin.ts`)

## Error Handling

### Edge Cases

1. **Null expires_at**: Display "Belum ada tanggal berakhir" in current expiry display
2. **Invalid date string**: `formatDateLong` will return "Invalid Date" - acceptable for admin interface
3. **Expired subscription**: Helper text correctly shows "akan extend dari hari ini"
4. **Future expiry**: Helper text correctly shows formatted future date

**Rationale**: These edge cases are handled gracefully without throwing errors. The admin interface can tolerate "Invalid Date" display since admins can recognize and fix data issues.

### No New Error States

This feature does not introduce new error states because:
- No new API calls are made
- No new form validation is added
- Date formatting failures are non-critical (display-only)
- Existing error handling (from updateSubscription/extendSubscription) remains unchanged

## Testing Strategy

### Unit Tests

**Test File**: `src/app/(admin)/admin/subscriptions/sub-actions.test.tsx` (new file)

**Test Cases**:

1. **Helper Text Display**
   - Manual edit section shows "Untuk koreksi data atau set tanggal spesifik"
   - Current expiry displays formatted date when expires_at is provided
   - Current expiry displays "Belum ada tanggal berakhir" when expires_at is null

2. **Date Formatting**
   - `formatDateLong('2024-12-31T00:00:00Z')` returns "31 Desember 2024"
   - `formatDateLong(null)` returns "Belum ada tanggal berakhir"
   - Handles various date formats (ISO strings from database)

3. **Expiry Status Detection**
   - `isExpired('2024-01-01T00:00:00Z')` returns true (past date)
   - `isExpired('2025-12-31T00:00:00Z')` returns false (future date)
   - `isExpired(null)` returns true (no expiry = expired)
   - Today's date is treated as expired

4. **Conditional Helper Text**
   - Expired subscription shows "Langganan sudah expired, akan extend dari hari ini"
   - Active subscription shows "Otomatis extend dari tanggal berakhir saat ini: [date]"

5. **Existing Functionality Preserved**
   - Status dropdown still works
   - Date picker still works
   - Save button still calls updateSubscription
   - Extend buttons still call extendSubscription
   - All existing props are still used

**Testing Approach**: Use React Testing Library with mocked server actions. Focus on UI rendering and conditional logic, not business logic (already tested in server actions).

### Manual Testing Checklist

1. Open admin subscriptions page
2. Click "Edit" on a subscription with future expiry date
3. Verify manual edit section shows current expiry date
4. Verify extend section shows "Otomatis extend dari..." with date
5. Click "Edit" on an expired subscription
6. Verify extend section shows "akan extend dari hari ini"
7. Test with subscription that has null expires_at
8. Verify "Belum ada tanggal berakhir" is displayed
9. Verify all existing functionality still works (save, extend buttons)

### Visual Regression Testing

**Recommendation**: Take screenshots of modal in three states:
1. Active subscription (future expiry)
2. Expired subscription (past expiry)
3. No expiry date (null expires_at)

Compare before/after to ensure helper text integrates seamlessly with existing design.

## Implementation Checklist

- [ ] Add `currentExpiresAt` prop to SubActions component interface
- [ ] Add `formatDateLong` helper function to SubActions component
- [ ] Add `isExpired` helper function to SubActions component
- [ ] Add helper text to Manual Edit section
- [ ] Add current expiry display to Manual Edit section
- [ ] Add conditional helper text to Extend section
- [ ] Update SubActions call in page.tsx (desktop table)
- [ ] Update SubActions call in page.tsx (mobile card list)
- [ ] Write unit tests for helper functions
- [ ] Write unit tests for conditional rendering
- [ ] Manual testing on dev environment
- [ ] Visual regression testing (optional)

## Deployment Considerations

### Zero Downtime

This feature can be deployed with zero downtime because:
- No database migrations required
- No API changes
- Backward compatible (new prop is optional with default handling)
- No breaking changes to existing functionality

### Rollback Plan

If issues are discovered:
1. Revert the two-file change (SubActions component + page.tsx)
2. No database rollback needed
3. No cache clearing needed

### Performance Impact

**Negligible**: 
- Two small helper functions (pure, no external calls)
- Minimal additional DOM elements (3 text elements)
- No additional network requests
- No additional re-renders (helper text is static once modal opens)

## Future Enhancements

Potential improvements outside the scope of this feature:

1. **Timezone Awareness**: Currently uses browser timezone for date comparison. Could use server timezone or user's configured timezone.
2. **Relative Time Display**: Show "expires in 5 days" instead of absolute date.
3. **Validation Warning**: Show warning if admin sets expiry date in the past.
4. **Audit Log**: Track when admins manually edit vs extend subscriptions.

These enhancements are not included to maintain the minimal scope of this feature.
