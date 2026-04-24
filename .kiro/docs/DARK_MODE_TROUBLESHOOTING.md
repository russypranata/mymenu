# Dark Mode Troubleshooting Guide

## Checklist untuk Mengaktifkan Dark Mode

### ✅ Step 1: Jalankan Migration di Database

**Apakah sudah dijalankan?** ⬜

1. Login ke Supabase Dashboard
2. Buka SQL Editor
3. Copy paste dari `.kiro/docs/RUN_THIS_MIGRATION.sql`
4. Run query
5. Verify dengan query:
```sql
SELECT dark_mode_enabled, accent_color, border_radius, card_style, text_size, background_pattern
FROM store_settings
WHERE store_id = 'YOUR_STORE_ID';
```

**Expected Result**: Semua column ada dengan nilai default

---

### ✅ Step 2: Aktifkan Dark Mode di Settings

**Apakah sudah diaktifkan?** ⬜

1. Login ke dashboard
2. Go to: Store → Settings → Tampilan Publik
3. Scroll ke "Dark Mode untuk Pelanggan"
4. Toggle ON (hijau)
5. Klik "Simpan Tampilan"

**Expected Result**: Toggle berubah hijau dan tersimpan

---

### ✅ Step 3: Verify di Database

**Apakah tersimpan?** ⬜

Run query:
```sql
SELECT dark_mode_enabled 
FROM store_settings 
WHERE store_id = 'YOUR_STORE_ID';
```

**Expected Result**: `dark_mode_enabled = true`

---

### ✅ Step 4: Clear Cache & Reload

**Sudah clear cache?** ⬜

1. **Browser Cache**:
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Or: Hard refresh (Ctrl+Shift+R)

2. **Next.js Cache** (if running locally):
   ```bash
   rm -rf .next
   npm run build
   npm run dev
   ```

3. **Vercel Cache** (if deployed):
   - Go to Vercel dashboard
   - Redeploy atau tunggu auto-deploy

---

### ✅ Step 5: Cek Halaman Publik

**Apakah toggle muncul?** ⬜

1. Buka halaman publik menu: `yourstore.mymenu.id`
2. Lihat di kanan bawah (di atas cart button jika ada)
3. Seharusnya ada tombol bulat dengan icon bulan 🌙

**Jika TIDAK muncul**:
- Cek console browser (F12) untuk error
- Verify `dark_mode_enabled = true` di database
- Clear cache dan reload

**Jika MUNCUL tapi tidak berfungsi**:
- Klik tombol
- Cek apakah background berubah
- Cek localStorage: `dark-mode-{storeId}` should be 'true'

---

## Common Issues & Solutions

### Issue 1: Toggle tidak muncul
**Cause**: `dark_mode_enabled` masih `false` atau `null`
**Solution**: 
1. Jalankan migration
2. Save settings lagi di dashboard
3. Verify di database

### Issue 2: Toggle muncul tapi tidak berubah warna
**Cause**: Theme provider tidak ter-initialize
**Solution**:
1. Hard refresh (Ctrl+Shift+R)
2. Clear localStorage
3. Reload page

### Issue 3: Klik toggle tapi tidak ada perubahan
**Cause**: State tidak tersinkronisasi
**Solution**:
1. Check browser console untuk error
2. Verify ThemeProvider wraps semua components
3. Check localStorage value changes

### Issue 4: Dark mode aktif tapi masih terang
**Cause**: Components belum menggunakan theme context
**Solution**: Sudah fixed di latest code

### Issue 5: Error "Could not find accent_color column"
**Cause**: Migration belum dijalankan
**Solution**: Jalankan migration SQL di Supabase

---

## Debug Commands

### Check Database
```sql
-- Check if columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'store_settings' 
AND column_name LIKE '%dark%';

-- Check current values
SELECT id, store_id, dark_mode_enabled, accent_color, border_radius
FROM store_settings;

-- Update manually (for testing)
UPDATE store_settings 
SET dark_mode_enabled = true 
WHERE store_id = 'YOUR_STORE_ID';
```

### Check Browser Console
```javascript
// Check localStorage
console.log(localStorage.getItem('dark-mode-YOUR_STORE_ID'));

// Check if ThemeProvider is working
// Should log current theme state
```

### Check Network Tab
1. Open DevTools (F12)
2. Network tab
3. Reload page
4. Check response for store data
5. Verify `dark_mode_enabled: true` in response

---

## Expected Behavior

### When Dark Mode is OFF (default)
- No toggle button visible
- Page uses default theme (light or dark based on `theme` setting)
- No localStorage entry

### When Dark Mode is ON
- Toggle button visible (bottom right)
- Button shows moon icon 🌙 (light mode) or sun icon ☀️ (dark mode)
- Click toggles between light/dark
- Preference saved in localStorage
- Background changes immediately
- All text colors adapt
- Card styles adapt

---

## Testing Checklist

- [ ] Migration ran successfully
- [ ] Dark mode enabled in settings
- [ ] Settings saved successfully
- [ ] Database shows `dark_mode_enabled = true`
- [ ] Cache cleared
- [ ] Page reloaded
- [ ] Toggle button visible
- [ ] Toggle button clickable
- [ ] Background changes on click
- [ ] Text colors change
- [ ] Preference persists on reload
- [ ] Works on mobile
- [ ] Works on desktop
- [ ] No console errors

---

## Still Not Working?

1. **Check browser console** for JavaScript errors
2. **Check network tab** for failed requests
3. **Verify migration** ran successfully
4. **Check database** values directly
5. **Try different browser** to rule out cache issues
6. **Check if deployed** - local vs production might differ

## Contact Support

If still not working after all steps:
1. Screenshot of settings page (showing toggle ON)
2. Screenshot of database query result
3. Screenshot of browser console errors
4. Screenshot of public page (showing no toggle)
5. Browser and OS version
