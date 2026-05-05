# Implementation Plan: Galeri Foto Toko

## Overview

Implementasi fitur Galeri Foto Toko secara bertahap: database dan types, lalu Server Actions, kemudian komponen dashboard, lalu komponen publik, dan terakhir integrasi ke halaman yang ada.

## Tasks

- [ ] 1. Database migration dan update TypeScript types
  - Buat `supabase/migrations/031_store_gallery.sql`:
    - Tabel `store_gallery` dengan kolom `id`, `store_id`, `image_url`, `caption`, `sort_order`, `created_at`
    - Index pada `(store_id, sort_order)`
    - RLS: owner bisa CRUD, public bisa SELECT
    - `ALTER TABLE store_settings ADD COLUMN gallery_enabled boolean NOT NULL DEFAULT false`
  - Update `src/types/database.types.ts`:
    - Tambah tipe `store_gallery` (Row, Insert, Update)
    - Tambah `gallery_enabled: boolean` ke `store_settings` Row/Insert/Update
  - _Requirements: 1.1, 2.6, 6.2, 6.3_

- [ ] 2. Buat Supabase Storage bucket `store-gallery`
  - Buat migration atau jalankan via Supabase dashboard: bucket `store-gallery` dengan public read access
  - Tambah storage policy: owner bisa INSERT/DELETE file di path `{store_id}/*`
  - _Requirements: 2.2_

- [ ] 3. Implementasi query dan Server Actions galeri
  - [ ] 3.1 Buat `src/lib/queries/gallery.ts`
    - Fungsi `getGalleryByStore(storeId: string)` — SELECT dari `store_gallery` ORDER BY `sort_order` ASC
    - _Requirements: 7.5_

  - [ ] 3.2 Buat `src/lib/actions/gallery.ts`
    - `uploadGalleryPhoto(formData, storeId)`:
      - Validasi auth, tipe file, ukuran (maks 5 MB), dan batas 12 foto
      - Upload ke Storage path `{store_id}/{uuid}.jpg`
      - INSERT row ke `store_gallery`
      - `revalidatePath` halaman settings
    - `updateGalleryCaption(photoId, caption)`:
      - Validasi caption maks 80 karakter
      - UPDATE `caption` di `store_gallery`
      - `revalidatePath` halaman settings
    - `deleteGalleryPhoto(photoId, imageUrl, storeId)`:
      - Hapus file dari Storage
      - DELETE row dari `store_gallery`
      - `revalidatePath` halaman settings
    - `reorderGalleryPhotos(photos: {id, sort_order}[])`:
      - Batch UPDATE `sort_order` untuk setiap foto
      - `revalidatePath` halaman settings
    - `toggleGallery(storeId, enabled)`:
      - UPSERT `gallery_enabled` di `store_settings`
      - `revalidatePath` halaman settings dan halaman publik
    - _Requirements: 2.1–2.7, 3.2–3.4, 4.3–4.5, 5.2–5.3, 6.2–6.4_

- [ ] 4. Buat komponen `GalleryManager` untuk dashboard
  - Buat `src/components/gallery-manager.tsx` (Client Component)
  - Props: `storeId`, `initialPhotos`, `galleryEnabled`
  - Toggle switch "Tampilkan Galeri di Halaman Publik" → panggil `toggleGallery`
  - Counter "X/12 foto"
  - Grid 3 kolom dengan thumbnail, input caption (auto-save on blur), tombol hapus
  - Tombol "Tambah Foto" → file picker → `ImageCropModal` → `uploadGalleryPhoto`
  - Tombol panah atas/bawah untuk reorder → `reorderGalleryPhotos`
  - Konfirmasi sebelum hapus foto
  - _Requirements: 1.1–1.4, 2.1–2.7, 3.1–3.4, 4.1–4.5, 5.1–5.3, 6.1–6.4_

- [ ] 5. Buat komponen `GalleryLightbox`
  - Buat `src/components/gallery-lightbox.tsx` (Client Component)
  - Props: `photos`, `initialIndex`, `onClose`
  - Gunakan `useFocusTrap` hook yang sudah ada
  - Keyboard: Escape (tutup), ArrowLeft/ArrowRight (navigasi)
  - Touch swipe: `touchstart`/`touchend` dengan delta threshold 50px
  - Indikator posisi "X / Y"
  - Caption di bawah foto
  - Backdrop click → tutup
  - `document.body.style.overflow = 'hidden'` saat terbuka, restore saat tutup
  - _Requirements: 8.1–8.7_

- [ ] 6. Buat komponen `PublicGallery`
  - Buat `src/components/public-gallery.tsx` (Client Component)
  - Props: `photos: GalleryPhoto[]`
  - Mobile: horizontal scroll `overflow-x-auto scrollbar-hide`, foto `w-48 h-36 flex-shrink-0`
  - Desktop (sm+): `grid grid-cols-3 sm:grid-cols-4 gap-3`
  - Setiap foto: `<Image>` dengan `loading="lazy"` (kecuali 3 pertama `priority`)
  - Caption di bawah foto jika ada
  - Klik foto → buka `GalleryLightbox` dengan index yang sesuai
  - _Requirements: 7.3–7.6, 8.1_

- [ ] 7. Integrasi ke halaman pengaturan toko
  - Update `src/app/(dashboard)/store/[id]/settings/page.tsx`:
    - Import `GalleryManager` dan `getGalleryByStore`
    - Tambah `getGalleryByStore(id)` ke `Promise.all`
    - Tambah section "Galeri Foto" dengan `<GalleryManager>` setelah section "Tampilan Publik"
  - _Requirements: 1.1_

- [ ] 8. Integrasi ke halaman publik
  - Update `src/app/[slug]/page.tsx`:
    - Import `PublicGallery` dan `getGalleryByStore`
    - Tambah `getGalleryByStore(store.id)` ke `Promise.all` (hanya jika `gallery_enabled = true`)
    - Pass `galleryPhotos` dan `galleryEnabled` ke `PublicMenuContent`
  - Update `src/components/public-menu-content.tsx`:
    - Tambah prop `gallerySection?: ReactNode`
    - Render `gallerySection` antara hero dan menu section dalam container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8`
  - _Requirements: 7.1–7.6_

- [ ] 9. Update skeleton loading
  - Update `src/app/[slug]/loading.tsx`:
    - Tambah skeleton untuk section galeri (horizontal scroll bar placeholder) antara hero dan menu section
  - _Requirements: 7.1_

- [ ] 10. Build dan verifikasi
  - Jalankan `npm run build` dan pastikan tidak ada error TypeScript atau build error
  - Verifikasi halaman publik tidak menampilkan galeri jika `gallery_enabled = false`
  - Verifikasi lightbox bisa dibuka, dinavigasi, dan ditutup

## Notes

- Gunakan `ImageCropModal` yang sudah ada di `src/components/image-crop-modal.tsx` untuk crop sebelum upload
- Gunakan `useFocusTrap` hook yang sudah ada di `src/hooks/use-focus-trap.ts` untuk lightbox
- Gunakan `useToast` yang sudah ada untuk feedback upload/hapus
- Pola Server Action konsisten dengan `src/lib/actions/store.ts` — kembalikan `{ error: string | null }`
- Foto di halaman publik di-lazy load untuk tidak menghambat LCP (Largest Contentful Paint)
- Jika `gallery_enabled = false`, tidak perlu fetch data galeri dari database (short-circuit)
