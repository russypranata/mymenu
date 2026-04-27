# Menu Section Text Customization - Migration Guide

## Overview
Fitur ini memungkinkan pemilik toko untuk mengkustomisasi teks judul dan subjudul di bagian menu pada halaman publik mereka.

## Database Changes
Migration file: `supabase/migrations/026_menu_section_text_customization.sql`

Menambahkan 2 kolom baru di tabel `stores`:
- `menu_section_title` (TEXT, nullable) - Judul bagian menu
- `menu_section_subtitle` (TEXT, nullable) - Subjudul bagian menu

## Default Values
Jika kolom kosong (null), akan menggunakan default:
- Title: "Menu Kami"
- Subtitle: "Pilih menu favorit Anda"

## How to Run Migration

### Local Development (Supabase CLI)
```bash
supabase db reset
```

### Production (Supabase Dashboard)
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Masuk ke SQL Editor
4. Copy-paste isi file `supabase/migrations/026_menu_section_text_customization.sql`
5. Klik "Run"

Atau gunakan Supabase CLI:
```bash
supabase db push
```

## Files Changed
1. `supabase/migrations/026_menu_section_text_customization.sql` - Migration file
2. `src/components/public-menu-content.tsx` - Component untuk menampilkan teks
3. `src/app/[slug]/page.tsx` - Pass props ke component
4. `src/components/store-appearance-form.tsx` - Form input untuk edit
5. `src/app/(dashboard)/store/[id]/settings/page.tsx` - Pass props ke form
6. `src/lib/actions/store.ts` - Action untuk save data

## Testing
1. Jalankan migration
2. Buka halaman settings toko
3. Scroll ke bagian "Teks Bagian Menu"
4. Ubah judul dan subjudul
5. Simpan
6. Buka halaman publik toko untuk melihat perubahan
7. Kosongkan field untuk kembali ke default

## Notes
- Field ini optional, tidak wajib diisi
- Maksimal 50 karakter untuk judul
- Maksimal 100 karakter untuk subjudul
- Jika kosong, akan menggunakan default value yang sudah ditentukan
