# Audit Konsistensi Penamaan Folder & File

## 📊 Analisis Inkonsistensi Bahasa

### ✅ Kategori 1: Public-Facing Routes (Bahasa Indonesia - BENAR)
Folder/route yang diakses langsung oleh pengguna akhir menggunakan bahasa Indonesia:

- ✅ `/bantuan` - Halaman bantuan/help
- ✅ `/harga` - Halaman pricing
- ✅ `/privasi` - Halaman privacy policy
- ✅ `/syarat` - Halaman terms & conditions
- ✅ `/demo-kedai-kopi` - Demo store (slug toko)
- ✅ `/[slug]` - Dynamic store pages (slug toko)

**Alasan:** Ini adalah URL yang dilihat pengguna Indonesia, jadi menggunakan bahasa Indonesia adalah pilihan yang tepat untuk SEO dan user experience.

---

### ✅ Kategori 2: Internal/Technical Routes (Bahasa Inggris - BENAR)
Folder/route untuk sistem internal, admin, dan developer menggunakan bahasa Inggris:

- ✅ `/(admin)` - Admin panel
- ✅ `/(auth)` - Authentication routes
  - ✅ `/login`
  - ✅ `/register`
  - ✅ `/forgot-password`
  - ✅ `/reset-password`
- ✅ `/(dashboard)` - User dashboard
  - ✅ `/dashboard`
  - ✅ `/profile`
  - ✅ `/store`
  - ✅ `/menu`
  - ✅ `/guide`
- ✅ `/api` - API routes
- ✅ `/auth/callback` - OAuth callback
- ✅ `/onboarding` - Onboarding flow
- ✅ `/suspended` - Suspended account page

**Alasan:** Ini adalah konvensi standar dalam development. Route groups, API endpoints, dan dashboard biasanya menggunakan bahasa Inggris.

---

## ❌ Inkonsistensi yang Ditemukan

### 1. **Folder `/guide` di Dashboard**
- **Lokasi:** `src/app/(dashboard)/guide/`
- **Masalah:** Menggunakan bahasa Inggris di dalam dashboard yang seharusnya konsisten
- **Rekomendasi:** 
  - **OPSI A (Recommended):** Tetap `/guide` karena ini adalah istilah teknis yang umum dipahami
  - **OPSI B:** Ubah ke `/panduan` untuk konsistensi penuh dengan bahasa Indonesia

### 2. **Folder `/store` vs Konten Indonesia**
- **Lokasi:** `src/app/(dashboard)/store/`
- **Masalah:** Nama folder "store" dalam bahasa Inggris, tapi konten UI menggunakan "Toko"
- **Rekomendasi:**
  - **OPSI A (Recommended):** Tetap `/store` karena ini adalah route internal dashboard
  - **OPSI B:** Ubah ke `/toko` untuk konsistensi dengan UI

### 3. **Folder `/menu` di Dashboard**
- **Lokasi:** `src/app/(dashboard)/menu/`
- **Masalah:** "Menu" adalah kata yang sama dalam bahasa Indonesia dan Inggris
- **Status:** ✅ **TIDAK PERLU DIUBAH** - kata "menu" universal

---

## 🎯 Rekomendasi Akhir

### Strategi: **Hybrid Approach (Recommended)**

Gunakan prinsip berikut:
1. **Public-facing URLs** → Bahasa Indonesia (untuk SEO & UX lokal)
2. **Internal/Dashboard URLs** → Bahasa Inggris (standar development)
3. **API endpoints** → Bahasa Inggris (standar industri)
4. **Slug toko** → Tetap dinamis, tidak perlu ditranslate

### Tidak Perlu Diubah:
- ✅ Route groups: `(admin)`, `(auth)`, `(dashboard)` - standar Next.js
- ✅ Dashboard routes: `/dashboard`, `/profile`, `/store`, `/menu` - konvensi internal
- ✅ Auth routes: `/login`, `/register`, `/forgot-password` - standar industri
- ✅ API routes: `/api/*` - standar REST API
- ✅ Public routes: `/bantuan`, `/harga`, `/privasi`, `/syarat` - sudah benar
- ✅ Store slugs: `/[slug]` - dinamis, tidak perlu translate

### Opsional untuk Konsistensi Maksimal:
Jika ingin konsistensi 100% bahasa Indonesia di semua user-facing routes:

| Current | Suggested | Priority | Reason |
|---------|-----------|----------|--------|
| `/guide` | `/panduan` | LOW | "Guide" cukup universal |
| `/store` | `/toko` | LOW | Route internal, tidak user-facing |
| `/profile` | `/profil` | LOW | Route internal, tidak user-facing |
| `/dashboard` | `/dasbor` | VERY LOW | Istilah teknis standar |

---

## 📝 Kesimpulan

**Status Saat Ini: ✅ SUDAH CUKUP KONSISTEN**

Project ini sudah mengikuti best practice dengan:
- Public URLs menggunakan bahasa Indonesia (`/bantuan`, `/harga`, `/privasi`, `/syarat`)
- Internal/technical URLs menggunakan bahasa Inggris (standar development)
- Slug toko tetap dinamis dan tidak perlu ditranslate

**Rekomendasi:** Tidak perlu melakukan perubahan besar. Struktur saat ini sudah optimal untuk:
- SEO lokal (public pages dalam bahasa Indonesia)
- Developer experience (internal routes dalam bahasa Inggris)
- Maintainability (mengikuti konvensi Next.js)

---

## 🔧 Jika Tetap Ingin Mengubah

Jika Anda tetap ingin konsistensi penuh bahasa Indonesia di dashboard, berikut perubahan yang diperlukan:

### Perubahan Minimal (Recommended):
```
/guide → /panduan
```

### Perubahan Maksimal (Not Recommended):
```
/dashboard → /dasbor
/profile → /profil
/store → /toko
/guide → /panduan
/menu → /menu (tetap sama)
```

**⚠️ Warning:** Mengubah route internal dapat:
- Mempengaruhi bookmarks pengguna
- Memerlukan redirect rules
- Meningkatkan kompleksitas maintenance
- Tidak memberikan benefit SEO (karena route internal)

---

## 📌 Catatan Penting

1. **Slug Toko (`/[slug]`)**: Sudah benar, tidak perlu translate. Ini adalah dynamic route untuk store pages.

2. **Route Groups**: `(admin)`, `(auth)`, `(dashboard)` adalah Next.js route groups, tidak muncul di URL, jadi tidak perlu diubah.

3. **API Routes**: Harus tetap bahasa Inggris untuk standar REST API.

4. **Component Files**: Nama file component (`.tsx`) sebaiknya tetap bahasa Inggris untuk konsistensi dengan ekosistem React/Next.js.

---

**Dibuat:** 2026-04-24  
**Status:** Ready for Review
