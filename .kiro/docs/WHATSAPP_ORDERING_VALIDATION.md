# WhatsApp Ordering Validation Implementation

## Overview
Implemented validation to ensure "Enable Ordering" feature requires WhatsApp number to be filled. This prevents users from enabling cart/ordering functionality without a valid WhatsApp contact.

## Problem Statement
Previously, users could enable the ordering feature without filling in their WhatsApp number, causing:
- Cart buttons to appear on public menu
- Customers unable to complete orders (no WhatsApp to send to)
- Poor user experience

## Solution Approach
Multi-layered validation combining backend logic, UI warnings, and frontend safeguards:

### 1. Backend Validation (`src/lib/actions/store.ts`)
**Auto-disable ordering if WhatsApp is empty:**
```typescript
// In updateStoreSettings function
const { data: store } = await supabase
  .from('stores').select('id, whatsapp').eq('id', input.storeId).eq('user_id', user.id).single()

// Auto-disable ordering if WhatsApp is empty
let finalEnableOrdering = input.enableOrdering
if (input.enableOrdering !== undefined && input.enableOrdering === true) {
  if (!store.whatsapp || store.whatsapp.trim() === '') {
    finalEnableOrdering = false
  }
}
```

**Behavior:**
- When user tries to enable ordering without WhatsApp → automatically disabled
- Prevents invalid state at database level
- Silent correction (no error thrown)

### 2. UI Warning & Toggle Disable (`src/components/store-appearance-form.tsx`)
**Added storeWhatsapp prop:**
```typescript
interface Props {
  storeId: string
  storeName: string
  storeSlug: string
  storeDescription?: string | null
  storeWhatsapp?: string | null  // NEW
  settings: Tables<'store_settings'> | null
}
```

**Warning message when WhatsApp is empty:**
```tsx
{!storeWhatsapp && (
  <div className="flex items-start gap-2 mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700">
      Isi nomor WhatsApp di tab <strong>Informasi Dasar</strong> terlebih dahulu untuk mengaktifkan fitur pemesanan.
    </p>
  </div>
)}
```

**Disabled toggle when WhatsApp is empty:**
```tsx
<button 
  type="button" 
  onClick={() => storeWhatsapp && setEnableOrdering(v => !v)}
  disabled={!storeWhatsapp}
  className={`... ${!storeWhatsapp ? 'bg-gray-200 cursor-not-allowed opacity-50' : ...}`}
  title={!storeWhatsapp ? 'Isi nomor WhatsApp terlebih dahulu' : undefined}
>
```

**Behavior:**
- Toggle is visually disabled (grayed out) when WhatsApp is empty
- Yellow warning box appears below toggle
- Clicking toggle does nothing when disabled
- Tooltip shows reason when hovering

### 3. Settings Page Update (`src/app/(dashboard)/store/[id]/settings/page.tsx`)
**Pass WhatsApp to appearance form:**
```tsx
<StoreAppearanceForm 
  storeId={store.id} 
  storeName={store.name} 
  storeSlug={store.slug}
  storeDescription={store.description}
  storeWhatsapp={store.whatsapp}  // NEW
  settings={settings} 
/>
```

### 4. Public Page Safeguard (`src/app/[slug]/page.tsx`)
**Double-check before rendering cart:**
```typescript
// Only enable ordering if both setting is ON and WhatsApp is filled
const enableOrdering = (store.store_settings?.enable_ordering ?? true) && !!store.whatsapp
```

**Behavior:**
- Even if database has `enable_ordering = true` but no WhatsApp
- Cart will NOT render on public page
- Prevents edge cases and race conditions

## User Flow

### Scenario 1: New Store (No WhatsApp)
1. User creates store without WhatsApp
2. Goes to Settings → Tampilan Publik
3. Sees "Enable Ordering" toggle is **disabled** (grayed out)
4. Sees yellow warning: "Isi nomor WhatsApp di tab Informasi Dasar terlebih dahulu"
5. Goes to "Informasi Dasar" tab
6. Fills WhatsApp number
7. Returns to "Tampilan Publik" tab
8. Toggle is now **enabled** and can be turned on

### Scenario 2: Existing Store (Has WhatsApp)
1. User has WhatsApp filled
2. Toggle works normally
3. Can enable/disable ordering freely

### Scenario 3: Remove WhatsApp After Enabling Ordering
1. User has ordering enabled
2. User removes WhatsApp from "Informasi Dasar"
3. Next time they save "Tampilan Publik" settings:
   - Backend auto-disables ordering
   - Toggle becomes disabled
   - Warning appears

### Scenario 4: Public Page Protection
1. Even if database has invalid state (ordering ON, no WhatsApp)
2. Public page checks both conditions
3. Cart does NOT render
4. Menu is display-only

## Technical Details

### Files Modified
1. `src/lib/actions/store.ts` - Backend validation
2. `src/components/store-appearance-form.tsx` - UI warning & toggle disable
3. `src/app/(dashboard)/store/[id]/settings/page.tsx` - Pass WhatsApp prop
4. `src/app/[slug]/page.tsx` - Public page safeguard

### Database Schema
No changes needed. Uses existing columns:
- `stores.whatsapp` (TEXT, nullable)
- `store_settings.enable_ordering` (BOOLEAN, default TRUE)

### Validation Rules
- WhatsApp is required when `enable_ordering = true`
- Empty string or NULL WhatsApp → auto-disable ordering
- Frontend prevents enabling toggle without WhatsApp
- Backend enforces rule even if frontend bypassed
- Public page double-checks before rendering

## Benefits

### For Store Owners
- Clear guidance: can't enable ordering without WhatsApp
- Visual feedback: disabled toggle + warning message
- Prevents configuration mistakes
- Better onboarding experience

### For Customers
- Never see broken cart functionality
- Always have valid WhatsApp to send orders
- Better user experience on public menu

### For System
- Data integrity: no invalid states
- Multiple validation layers
- Graceful handling of edge cases
- No breaking changes to existing stores

## Testing Checklist

- [ ] New store without WhatsApp → toggle disabled
- [ ] Fill WhatsApp → toggle becomes enabled
- [ ] Enable ordering with WhatsApp → works
- [ ] Remove WhatsApp → toggle becomes disabled again
- [ ] Try to enable ordering without WhatsApp → stays disabled
- [ ] Public page with ordering ON but no WhatsApp → no cart
- [ ] Public page with ordering ON and WhatsApp → cart appears
- [ ] Backend saves with ordering ON but no WhatsApp → auto-disabled

## Future Enhancements

### Possible Improvements
1. **Real-time validation**: Check WhatsApp format when toggling
2. **Inline link**: "Isi nomor WhatsApp" as clickable link to scroll to Informasi Dasar
3. **Toast notification**: Show message when auto-disabled by backend
4. **Admin dashboard**: Flag stores with invalid configurations

### Not Implemented (By Design)
- ❌ Throw error when enabling without WhatsApp (too harsh)
- ❌ Auto-fill WhatsApp from profile (different purposes)
- ❌ Allow ordering without WhatsApp (defeats purpose)

## Related Features

### Contact Structure Simplification
This validation works with the simplified contact structure:
- **Profile Phone** (`profiles.phone`) - Admin notifications (private)
- **Store WhatsApp** (`stores.whatsapp`) - Customer orders (public)
- **Locations** - Informational only (no WhatsApp per location)

All orders go to single store WhatsApp, making validation straightforward.

### Enable Ordering Toggle
This validation ensures the "Enable Ordering" feature works correctly:
- When ON + WhatsApp filled → Full cart functionality
- When ON + No WhatsApp → Auto-disabled (backend) or prevented (frontend)
- When OFF → No cart, display-only menu

## Conclusion

The implementation provides robust validation through multiple layers:
1. **Backend** - Auto-disable if invalid
2. **Frontend** - Prevent invalid state
3. **UI** - Clear warnings and guidance
4. **Public** - Safeguard against edge cases

This ensures store owners can't accidentally enable ordering without WhatsApp, and customers always have a working order flow.
