# Requirements Document

## Introduction

Fitur **Galeri Foto Toko** memungkinkan pemilik toko (owner) di Menuly untuk menampilkan foto-foto suasana tempat, interior, eksterior, spot foto, dan area lainnya di halaman menu publik. Tujuannya adalah memberikan gambaran lengkap kepada calon pelanggan tentang toko tanpa harus keluar dari halaman menu.

Fitur ini memerlukan tabel baru `store_gallery`, kolom baru `gallery_enabled` di `store_settings`, bucket Supabase Storage baru `store-gallery`, dan komponen baru di dashboard serta halaman publik.

---

## Glossary

- **Owner**: Pengguna terdaftar yang memiliki dan mengelola satu atau lebih toko di Menuly.
- **Gallery**: Kumpulan foto suasana toko yang ditampilkan di halaman menu publik.
- **GalleryPhoto**: Satu item foto dalam Gallery, terdiri dari `image_url`, `caption` opsional, dan `sort_order`.
- **GalleryManager**: Komponen dashboard untuk mengelola Gallery (upload, reorder, hapus, toggle).
- **PublicGallery**: Komponen halaman publik yang menampilkan Gallery kepada pelanggan.
- **GalleryLightbox**: Modal overlay yang menampilkan foto dalam ukuran penuh dengan navigasi.
- **Gallery_Storage**: Bucket Supabase Storage bernama `store-gallery` untuk menyimpan file foto.
- **Gallery_Action**: Server Action Next.js yang menangani mutasi data Gallery.

---

## Requirements

### Requirement 1: Kelola Foto Galeri di Dashboard

**User Story:** Sebagai Owner, saya ingin mengelola foto-foto galeri toko saya dari dashboard, agar saya bisa menampilkan suasana toko kepada calon pelanggan.

#### Acceptance Criteria

1. WHEN Owner membuka halaman pengaturan toko (`/store/[id]/settings`), THE GalleryManager SHALL ditampilkan sebagai section tersendiri dengan label "Galeri Foto".
2. THE GalleryManager SHALL menampilkan semua GalleryPhoto yang sudah diupload dalam grid 3 kolom, diurutkan berdasarkan `sort_order`.
3. THE GalleryManager SHALL menampilkan indikator jumlah foto saat ini dari batas maksimum (contoh: "4/12 foto").
4. IF jumlah GalleryPhoto sudah mencapai 12, THEN THE GalleryManager SHALL menonaktifkan tombol "Tambah Foto" dan menampilkan pesan bahwa batas maksimum telah tercapai.

---

### Requirement 2: Upload Foto Galeri

**User Story:** Sebagai Owner, saya ingin mengupload foto-foto toko saya, agar pelanggan bisa melihat suasana tempat sebelum datang.

#### Acceptance Criteria

1. WHEN Owner mengklik tombol "Tambah Foto" dan memilih file gambar, THE Gallery_Action SHALL menampilkan ImageCropModal sebelum upload.
2. WHEN Owner menyelesaikan crop dan mengkonfirmasi, THE Gallery_Action SHALL mengupload file ke Gallery_Storage pada path `{store_id}/{uuid}.jpg`.
3. THE Gallery_Action SHALL memvalidasi bahwa file yang diupload bertipe MIME `image/jpeg`, `image/png`, atau `image/webp`.
4. THE Gallery_Action SHALL memvalidasi bahwa ukuran file tidak melebihi 5 MB.
5. IF file tidak valid (tipe atau ukuran), THEN THE Gallery_Action SHALL mengembalikan pesan error yang menjelaskan batasan.
6. WHEN upload berhasil, THE Gallery_Action SHALL menyimpan row baru di tabel `store_gallery` dengan `image_url`, `store_id`, dan `sort_order` = (jumlah foto saat ini).
7. WHEN upload berhasil, THE Gallery_Action SHALL melakukan revalidasi path halaman pengaturan toko.

---

### Requirement 3: Tambah Caption pada Foto

**User Story:** Sebagai Owner, saya ingin menambahkan caption pada setiap foto galeri, agar pelanggan tahu konteks foto tersebut (misal: "Area outdoor", "Spot foto instagramable").

#### Acceptance Criteria

1. THE GalleryManager SHALL menampilkan input teks di bawah setiap GalleryPhoto untuk caption opsional.
2. THE Gallery_Action SHALL memvalidasi bahwa caption tidak melebihi 80 karakter.
3. WHEN Owner mengisi caption dan menyimpan, THE Gallery_Action SHALL memperbarui kolom `caption` pada row GalleryPhoto yang bersangkutan.
4. IF caption melebihi 80 karakter, THEN THE Gallery_Action SHALL mengembalikan error tanpa menyimpan.

---

### Requirement 4: Hapus Foto Galeri

**User Story:** Sebagai Owner, saya ingin menghapus foto yang tidak relevan dari galeri, agar galeri tetap rapi dan terkini.

#### Acceptance Criteria

1. THE GalleryManager SHALL menampilkan tombol hapus (ikon X atau trash) pada setiap GalleryPhoto.
2. WHEN Owner mengklik tombol hapus, THE GalleryManager SHALL menampilkan konfirmasi sebelum menghapus.
3. WHEN Owner mengkonfirmasi penghapusan, THE Gallery_Action SHALL menghapus file dari Gallery_Storage.
4. WHEN file berhasil dihapus dari storage, THE Gallery_Action SHALL menghapus row dari tabel `store_gallery`.
5. WHEN penghapusan berhasil, THE Gallery_Action SHALL melakukan revalidasi path halaman pengaturan toko.

---

### Requirement 5: Atur Urutan Foto

**User Story:** Sebagai Owner, saya ingin mengatur urutan tampilan foto galeri, agar foto yang paling menarik muncul di posisi pertama.

#### Acceptance Criteria

1. THE GalleryManager SHALL memungkinkan Owner mengubah urutan foto dengan tombol panah atas/bawah atau drag-and-drop.
2. WHEN Owner mengubah urutan foto, THE Gallery_Action SHALL memperbarui kolom `sort_order` pada semua GalleryPhoto yang terpengaruh secara batch.
3. WHEN reorder berhasil, THE Gallery_Action SHALL melakukan revalidasi path halaman pengaturan toko.

---

### Requirement 6: Aktifkan/Nonaktifkan Galeri

**User Story:** Sebagai Owner, saya ingin mengaktifkan atau menonaktifkan tampilan galeri di halaman publik, agar saya bisa menyembunyikan galeri sementara tanpa menghapus foto.

#### Acceptance Criteria

1. THE GalleryManager SHALL menampilkan toggle switch "Tampilkan Galeri di Halaman Publik".
2. WHEN Owner mengaktifkan toggle, THE Gallery_Action SHALL memperbarui kolom `gallery_enabled = true` di tabel `store_settings` untuk toko tersebut.
3. WHEN Owner menonaktifkan toggle, THE Gallery_Action SHALL memperbarui kolom `gallery_enabled = false` di tabel `store_settings`.
4. Perubahan toggle SHALL tersimpan secara otomatis (tanpa tombol simpan terpisah).

---

### Requirement 7: Tampilkan Galeri di Halaman Publik

**User Story:** Sebagai pelanggan, saya ingin melihat foto-foto suasana toko di halaman menu, agar saya bisa memutuskan apakah toko ini sesuai dengan yang saya cari.

#### Acceptance Criteria

1. IF `gallery_enabled = true` DAN terdapat minimal 1 GalleryPhoto, THEN THE PublicGallery SHALL ditampilkan di halaman publik antara section hero dan section menu.
2. IF `gallery_enabled = false` ATAU tidak ada GalleryPhoto, THEN section galeri SHALL tidak ditampilkan sama sekali (tidak ada empty state).
3. THE PublicGallery SHALL menampilkan foto dalam layout horizontal scroll di mobile dan grid 3-4 kolom di desktop.
4. THE PublicGallery SHALL menampilkan caption di bawah setiap foto jika caption diisi.
5. Foto-foto SHALL ditampilkan sesuai urutan `sort_order` ascending.
6. Foto-foto SHALL di-lazy load untuk tidak menghambat render menu utama.

---

### Requirement 8: Lightbox untuk Foto Galeri

**User Story:** Sebagai pelanggan, saya ingin membuka foto dalam ukuran penuh, agar saya bisa melihat detail suasana toko dengan lebih jelas.

#### Acceptance Criteria

1. WHEN pelanggan mengklik foto di PublicGallery, THE GalleryLightbox SHALL terbuka dan menampilkan foto dalam ukuran penuh.
2. THE GalleryLightbox SHALL menampilkan caption foto jika ada.
3. THE GalleryLightbox SHALL menampilkan tombol navigasi prev/next untuk berpindah antar foto.
4. WHEN pelanggan menekan tombol Escape atau mengklik backdrop, THE GalleryLightbox SHALL tertutup.
5. WHEN pelanggan swipe kiri/kanan di perangkat mobile, THE GalleryLightbox SHALL berpindah ke foto berikutnya/sebelumnya.
6. THE GalleryLightbox SHALL menampilkan indikator posisi foto saat ini (contoh: "2 / 8").
7. THE GalleryLightbox SHALL men-trap focus sesuai WCAG 2.1 SC 2.1.2 selama terbuka.
