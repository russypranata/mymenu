# Design Document: Galeri Foto Toko

## Overview

Fitur Galeri Foto Toko menambahkan kemampuan bagi pemilik toko untuk menampilkan foto suasana tempat di halaman menu publik. Fitur ini terdiri dari:

- **Dashboard**: `GalleryManager` component di halaman pengaturan toko untuk upload, reorder, caption, hapus, dan toggle galeri
- **Halaman Publik**: `PublicGallery` component yang menampilkan foto dalam grid + `GalleryLightbox` untuk tampilan fullscreen

Semua mutasi menggunakan Next.js Server Actions, konsisten dengan pola yang ada di `store.ts`, `menu.ts`, dan `profile.ts`.

---

## Architecture

```
flowchart TD
    A[Dashboard /store/id/settings] --> B[GalleryManager - Client Component]
    B -->|uploadGalleryPhoto| C[Gallery_Action]
    B -->|updateGalleryCaption| C
    B -->|deleteGalleryPhoto| C
    B -->|reorderGalleryPhotos| C
    B -->|toggleGallery| C
    C --> D[Supabase DB - store_gallery]
    C --> E[Supabase Storage - store-gallery]
    C --> F[store_settings.gallery_enabled]

    G[Public /slug] --> H[PublicGallery - Client Component]
    H --> I[GalleryLightbox - Client Component]
    G -->|getGalleryByStore| D
```

---

## Data Models

### Migration: `supabase/migrations/031_store_gallery.sql`

```sql
-- Tabel galeri foto toko
CREATE TABLE store_gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  caption     text CHECK (char_length(caption) <= 80),
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_store_gallery_store_id_sort
  ON store_gallery(store_id, sort_order);

ALTER TABLE store_gallery ENABLE ROW LEVEL SECURITY;

-- Owner bisa CRUD foto miliknya
CREATE POLICY "owner_manage_gallery" ON store_gallery
  FOR ALL USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Public bisa SELECT
CREATE POLICY "public_read_gallery" ON store_gallery
  FOR SELECT USING (true);

-- Tambah kolom gallery_enabled ke store_settings
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS gallery_enabled boolean NOT NULL DEFAULT false;
```

### Storage: Bucket `store-gallery`

- **Bucket name**: `store-gallery`
- **Public**: true (read access untuk semua)
- **Path convention**: `{store_id}/{uuid}.jpg`
- **Max file size**: 5 MB
- **Allowed MIME**: `image/jpeg`, `image/png`, `image/webp`

### TypeScript Types

Update `src/types/database.types.ts`:

```typescript
store_gallery: {
  Row: {
    id: string
    store_id: string
    image_url: string
    caption: string | null
    sort_order: number
    created_at: string
  }
  Insert: {
    id?: string
    store_id: string
    image_url: string
    caption?: string | null
    sort_order?: number
    created_at?: string
  }
  Update: {
    image_url?: string
    caption?: string | null
    sort_order?: number
  }
}

// store_settings Row tambah:
gallery_enabled: boolean
```

---

## Components and Interfaces

### Server Actions: `src/lib/actions/gallery.ts`

```typescript
// Upload foto baru ke galeri
export async function uploadGalleryPhoto(
  formData: FormData,
  storeId: string
): Promise<{ error: string | null }>

// Update caption foto
export async function updateGalleryCaption(
  photoId: string,
  caption: string
): Promise<{ error: string | null }>

// Hapus foto dari galeri
export async function deleteGalleryPhoto(
  photoId: string,
  imageUrl: string,
  storeId: string
): Promise<{ error: string | null }>

// Reorder foto (batch update sort_order)
export async function reorderGalleryPhotos(
  photos: { id: string; sort_order: number }[]
): Promise<{ error: string | null }>

// Toggle gallery_enabled di store_settings
export async function toggleGallery(
  storeId: string,
  enabled: boolean
): Promise<{ error: string | null }>
```

### Query: `src/lib/queries/gallery.ts`

```typescript
export async function getGalleryByStore(storeId: string): Promise<GalleryPhoto[]>
// SELECT * FROM store_gallery WHERE store_id = storeId ORDER BY sort_order ASC
```

### Dashboard Component: `src/components/gallery-manager.tsx`

Client Component. Props:
```typescript
interface GalleryManagerProps {
  storeId: string
  initialPhotos: GalleryPhoto[]
  galleryEnabled: boolean
}
```

Layout internal:
- Toggle switch "Tampilkan Galeri di Halaman Publik" di atas
- Counter "X/12 foto"
- Grid 3 kolom: setiap cell berisi thumbnail, input caption, tombol hapus, handle reorder
- Tombol "Tambah Foto" (disabled jika sudah 12)
- Menggunakan `ImageCropModal` yang sudah ada untuk crop sebelum upload

### Public Component: `src/components/public-gallery.tsx`

Client Component. Props:
```typescript
interface PublicGalleryProps {
  photos: GalleryPhoto[]
}
```

Layout:
- Mobile: horizontal scroll dengan `overflow-x-auto scrollbar-hide`
- Desktop (sm+): grid `grid-cols-3 sm:grid-cols-4`
- Setiap foto: `<Image>` dengan `loading="lazy"`, caption di bawah
- Klik foto → buka `GalleryLightbox`

### Lightbox Component: `src/components/gallery-lightbox.tsx`

Client Component. Props:
```typescript
interface GalleryLightboxProps {
  photos: GalleryPhoto[]
  initialIndex: number
  onClose: () => void
}
```

Fitur:
- `useFocusTrap` hook yang sudah ada
- Keyboard: Escape (tutup), ArrowLeft/ArrowRight (navigasi)
- Touch: swipe gesture dengan `touchstart`/`touchend` delta
- Indikator posisi: "2 / 8"
- Backdrop click → tutup
- `document.body.style.overflow = 'hidden'` saat terbuka

---

## Integration Points

### Halaman Pengaturan Toko (`/store/[id]/settings`)

Tambah section baru di `src/app/(dashboard)/store/[id]/settings/page.tsx`:

```tsx
// Fetch gallery data
const [galleryPhotos] = await Promise.all([
  getGalleryByStore(id),
  // ... existing fetches
])

// Render section
<section className="space-y-4">
  <SectionLabel>Galeri Foto</SectionLabel>
  <GalleryManager
    storeId={store.id}
    initialPhotos={galleryPhotos}
    galleryEnabled={settings?.gallery_enabled ?? false}
  />
</section>
```

### Halaman Publik (`/[slug]/page.tsx`)

```tsx
// Fetch gallery
const [categories, menus, locations, galleryPhotos] = await Promise.all([
  getCategoriesByStore(store.id),
  getActiveMenusByStore(store.id),
  getStoreLocations(store.id),
  getGalleryByStore(store.id),
])

const galleryEnabled = settings?.gallery_enabled ?? false

// Render di PublicMenuContent antara hero dan menu section
{galleryEnabled && galleryPhotos.length > 0 && (
  <PublicGallery photos={galleryPhotos} />
)}
```

### `public-menu-content.tsx`

Tambah prop `gallerySection?: ReactNode` yang dirender antara hero dan menu section:

```tsx
{gallerySection && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
    {gallerySection}
  </div>
)}
```

---

## Validation Rules

| Field | Rule |
|---|---|
| File type | `image/jpeg`, `image/png`, `image/webp` |
| File size | Maks 5 MB |
| Caption | Opsional, maks 80 karakter |
| Jumlah foto | Maks 12 per toko |

---

## Error Handling

Semua Server Actions mengembalikan `{ error: string | null }` konsisten dengan pola yang ada.

| Skenario | Pesan |
|---|---|
| Tidak terautentikasi | `'Tidak terautentikasi.'` |
| Tipe file tidak valid | `'File harus berupa gambar JPEG, PNG, atau WebP.'` |
| Ukuran file terlalu besar | `'Ukuran file maksimal 5 MB.'` |
| Caption terlalu panjang | `'Caption maksimal 80 karakter.'` |
| Batas foto tercapai | `'Maksimal 12 foto per toko.'` |
| Error storage | `'Gagal mengupload foto. Silakan coba lagi.'` |
| Error database | Teruskan `error.message` dari Supabase |

---

## Performance Considerations

- Foto di halaman publik menggunakan `loading="lazy"` kecuali 3 foto pertama (`priority`)
- `sizes` prop pada `<Image>` disesuaikan dengan breakpoint grid
- Galeri tidak di-fetch jika `gallery_enabled = false` (short-circuit di server)
- Revalidasi ISR `revalidate = 60` sudah ada di `[slug]/page.tsx` — perubahan galeri akan terlihat dalam 60 detik
