# Naming Consistency Audit Report

**Date:** April 24, 2026  
**Project:** MyMenu SaaS  
**Issue:** Mixed Indonesian and English naming conventions

---

## Executive Summary

The codebase contains **mixed Indonesian and English naming** across routes, components, and content. This creates inconsistency and can confuse developers, especially international contributors.

**Severity:** Medium  
**Impact:** Developer experience, maintainability, internationalization readiness  
**Recommendation:** Standardize to English for code, keep Indonesian for user-facing content only

---

## 1. Route Naming Analysis

### Indonesian Route Names (User-Facing Pages)
These are **public marketing/legal pages** with Indonesian URLs:

| Route | Purpose | English Equivalent |
|-------|---------|-------------------|
| `/bantuan` | Help/Support page | `/help` or `/support` |
| `/harga` | Pricing page | `/pricing` |
| `/privasi` | Privacy policy | `/privacy` |
| `/syarat` | Terms & conditions | `/terms` |

### English Route Names (Application Routes)
| Route | Purpose |
|-------|---------|
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth routes |
| `/dashboard` | Main dashboard |
| `/store`, `/menu`, `/profile`, `/admin` | Core app routes |
| `/onboarding`, `/suspended` | App state routes |

### Mixed Naming Issue
- **Dashboard route:** `/guide` (English)
- **Equivalent content:** "Panduan Penggunaan" (Indonesian title)
- **Inconsistency:** Route is English but all content is Indonesian

---

## 2. Content Language Analysis

### Pages with Indonesian Content
All pages use **Indonesian language** for:
- Page titles and headings
- Button labels
- Form labels
- Error messages
- Help text
- Metadata

**Examples:**
```typescript
// src/app/bantuan/page.tsx
title: 'Bantuan — MyMenu'
"Pusat Bantuan"
"Pertanyaan umum dan cara menghubungi kami"

// src/app/harga/page.tsx
title: 'Harga — MyMenu'
"Satu harga, semua fitur"
"Tidak ada paket-paketan membingungkan"

// src/app/(dashboard)/guide/page.tsx
title: 'Panduan — MyMenu'
"Panduan Penggunaan"
"Pelajari cara mengelola halaman menu digital Anda"
```

---

## 3. Code-Level Naming

### ✅ Good: English Naming
All technical code uses **consistent English naming**:

**Components:**
- `new-store-form.tsx`, `edit-store-form.tsx`
- `menu-list.tsx`, `menu-detail-modal.tsx`
- `category-manager.tsx`, `analytics-chart.tsx`
- `store-appearance-form.tsx`, `whatsapp-button.tsx`

**Libraries:**
- `src/lib/actions/`, `src/lib/queries/`, `src/lib/supabase/`
- `password.ts`, `subscription.ts`, `utils.ts`

**Database:**
- Tables: `profiles`, `stores`, `menus`, `categories`, `subscriptions`
- Columns: `name`, `slug`, `description`, `created_at`

### ⚠️ Mixed: Variable/String Content
While variable names are English, **string values are Indonesian**:

```typescript
// Component props and variables: English ✅
const schema = z.object({
  name: z.string().min(1, 'Nama toko tidak boleh kosong.'), // ❌ Indonesian error
  slug: z.string().min(1, 'URL toko tidak boleh kosong.'),  // ❌ Indonesian error
})

// Labels in JSX
<label>Nama Toko <span>*</span></label>  // ❌ Indonesian
<label>URL Toko <span>*</span></label>   // ❌ Indonesian
```

---

## 4. Recommendations

### Option A: Full English (Best Practice) ⭐
**Standardize everything to English for international readiness**

#### Changes Required:
1. **Rename routes:**
   - `/bantuan` → `/help` or `/support`
   - `/harga` → `/pricing`
   - `/privasi` → `/privacy`
   - `/syarat` → `/terms`

2. **Keep route structure, translate content:**
   - Extract all Indonesian strings to translation files
   - Implement i18n (next-intl or similar)
   - Support both Indonesian and English

3. **Benefits:**
   - International developer-friendly
   - Easier to add multi-language support later
   - Standard practice for SaaS applications
   - Better SEO for international markets

4. **Effort:** High (requires i18n setup + translation)

---

### Option B: Hybrid Approach (Pragmatic) ✅
**Keep Indonesian for user-facing content, English for code**

#### Current State (Already Implemented):
- ✅ All code (components, functions, variables) in English
- ✅ All database schema in English
- ✅ All technical documentation in English
- ✅ Indonesian content for Indonesian market

#### What to Keep:
- Keep `/bantuan`, `/harga`, `/privasi`, `/syarat` routes (SEO benefit for Indonesian market)
- Keep Indonesian UI strings (target market is Indonesian UMKM)
- Keep English code structure

#### What to Fix:
1. **Document the convention** in CONTRIBUTING.md:
   ```markdown
   ## Naming Conventions
   - **Code:** English only (components, functions, variables, types)
   - **Routes:** Indonesian for public pages, English for app routes
   - **UI Content:** Indonesian (target market)
   - **Comments:** English preferred, Indonesian acceptable
   ```

2. **Add route mapping documentation:**
   ```typescript
   // Route naming convention:
   // Public marketing pages: Indonesian URLs for SEO
   // - /bantuan (help), /harga (pricing), /privasi (privacy), /syarat (terms)
   // Application routes: English URLs
   // - /dashboard, /store, /menu, /profile, /admin
   ```

3. **Benefits:**
   - Minimal changes required
   - SEO-friendly for Indonesian market
   - Clear separation of concerns
   - Maintains current working state

4. **Effort:** Low (documentation only)

---

### Option C: Full Indonesian (Not Recommended) ❌
**Translate all code to Indonesian**

#### Why Not Recommended:
- ❌ Non-standard in international dev community
- ❌ Harder for international developers to contribute
- ❌ Most frameworks/libraries use English conventions
- ❌ Reduces code portability
- ❌ Makes it harder to get help from global community

---

## 5. Specific Inconsistencies to Address

### Route vs Content Mismatch
| Current Route | Page Title | Recommendation |
|--------------|------------|----------------|
| `/guide` | "Panduan Penggunaan" | Keep route, it's fine (or rename to `/panduan` for consistency) |

### Demo Route
- `src/app/demo-kedai-kopi/` - Empty folder, should be removed or documented

---

## 6. Implementation Priority

### High Priority (Do Now)
1. ✅ Document naming convention in CONTRIBUTING.md
2. ✅ Add route naming explanation in README.md
3. ✅ Remove or document `demo-kedai-kopi` folder

### Medium Priority (Consider)
1. Decide on `/guide` vs `/panduan` consistency
2. Add JSDoc comments to explain Indonesian string context
3. Consider extracting strings to constants file for easier future i18n

### Low Priority (Future)
1. Implement full i18n if expanding to other markets
2. Add English language toggle
3. Create translation management system

---

## 7. Conclusion

**Current State:** Hybrid approach (English code, Indonesian content)  
**Assessment:** Acceptable for Indonesian-market SaaS  
**Action Required:** Documentation to formalize the convention

The mixed naming is **intentional and appropriate** for the target market (Indonesian UMKM), but should be **documented** to prevent confusion.

### Recommended Next Steps:
1. Accept hybrid approach as the standard
2. Document the convention clearly
3. Ensure all future code follows: English code, Indonesian UI
4. Plan for i18n if international expansion is considered

---

## 8. Files to Update

### Documentation Files
- [ ] `CONTRIBUTING.md` - Add naming convention section
- [ ] `README.md` - Explain route structure
- [ ] `.kiro/steering/naming-conventions.md` - Create steering file for AI agents

### Code Cleanup
- [ ] Remove or document `src/app/demo-kedai-kopi/`
- [ ] Consider renaming `/guide` to `/panduan` for consistency (optional)

### No Changes Needed
- ✅ All component names (already English)
- ✅ All function names (already English)
- ✅ All database schema (already English)
- ✅ All type definitions (already English)

---

**Audit Completed By:** Kiro AI  
**Status:** Ready for Review  
**Recommendation:** Option B (Hybrid Approach) with documentation
