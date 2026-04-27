# Banner Mobile Styling & Button Behavior Fix

## Issues Fixed

### 1. Mobile Styling Improvement
**Problem**: Badge "trial berakhir" di mobile kurang rapi (not neat on mobile)

**Solution**: 
- Changed banner layout from `flex-row` to `flex-col sm:flex-row` for stacked layout on mobile
- Made button full-width on mobile with `w-full sm:w-auto`
- Button now appears below the text content on mobile instead of side-by-side
- Improved spacing and alignment for better mobile appearance

**Files Modified**:
- `src/components/subscription-banner.tsx`

### 2. Button Behavior Fix
**Problem**: Button "Perpanjang" di banner links to `/profile` but should open modal directly

**Solution**:
- Created `SubscriptionSectionWrapper` client component to detect URL hash `#renew`
- When banner button is clicked, navigates to `/profile#renew`
- Profile page wrapper detects hash and automatically opens the subscription modal
- Hash is cleaned up after detection for clean URL
- Modal opens with correct plan selection

**Files Created**:
- `src/components/subscription-section-wrapper.tsx`

**Files Modified**:
- `src/components/subscription-section.tsx` - Added `initialModalOpen` prop
- `src/app/(dashboard)/profile/page.tsx` - Uses wrapper component
- `src/components/subscription-banner-wrapper.tsx` - Already existed, no changes needed

## How It Works

### Flow:
1. User sees expired/trial banner in dashboard
2. User clicks "Perpanjang" button
3. Banner wrapper navigates to `/profile#renew`
4. Profile page loads
5. `SubscriptionSectionWrapper` detects `#renew` hash
6. Modal opens automatically
7. Hash is removed from URL for clean state

### Mobile Layout:
- **Mobile (< 640px)**: Icon and content stacked vertically, button full-width below text
- **Desktop (≥ 640px)**: Icon and content side-by-side, button inline with text

## Testing Checklist

- [ ] Banner displays correctly on mobile (stacked layout)
- [ ] Banner displays correctly on desktop (side-by-side layout)
- [ ] "Perpanjang" button opens modal when clicked from banner
- [ ] Modal opens with correct plan selection
- [ ] URL is clean after modal opens (no hash visible)
- [ ] Modal can be closed and reopened normally
- [ ] Works for both trial and paid subscription expiry

## Technical Details

### State Management:
- Banner uses callback prop `onRenewClick` to trigger navigation
- Profile page uses `useEffect` to detect hash on mount
- Modal state is controlled by `initialModalOpen` prop
- Hash is cleaned up using `window.history.replaceState`

### Responsive Classes:
- `flex-col sm:flex-row` - Stack on mobile, row on desktop
- `w-full sm:w-auto` - Full width on mobile, auto on desktop
- `px-4 sm:px-5` - Smaller padding on mobile
- `gap-3` - Consistent spacing between elements

## Related Files

- `src/components/subscription-banner.tsx` - Banner display component
- `src/components/subscription-banner-wrapper.tsx` - Banner navigation wrapper
- `src/components/subscription-section.tsx` - Subscription card with modal
- `src/components/subscription-section-wrapper.tsx` - Profile page wrapper for hash detection
- `src/app/(dashboard)/profile/page.tsx` - Profile page
- `src/app/(dashboard)/layout.tsx` - Dashboard layout with banner

## Notes

- This approach uses URL hash for state communication between components
- Alternative approaches considered: Context API, URL params, direct modal state lifting
- Hash approach chosen for simplicity and clean separation of concerns
- Works seamlessly with Next.js App Router and server components
