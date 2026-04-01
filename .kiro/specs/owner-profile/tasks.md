# Implementation Plan: Owner Profile

## Overview

Implementasi fitur Owner Profile secara bertahap: mulai dari migrasi database dan update types, lalu Server Actions dengan validasi, kemudian komponen UI, dan terakhir integrasi ke dashboard layout.

## Tasks

- [x] 1. Database migration dan update TypeScript types
  - Buat file `supabase/migrations/008_profile_columns.sql` dengan ALTER TABLE untuk menambah kolom `display_name VARCHAR(50)` dan `avatar_url TEXT` ke tabel `profiles`
  - Update `src/types/database.types.ts` — tambah `display_name: string | null` dan `avatar_url: string | null` ke Row, Insert, dan Update type untuk tabel `profiles`
  - _Requirements: 2.1, 3.5_

- [x] 2. Implementasi helper functions dan Server Actions profil
  - [x] 2.1 Buat helper functions di `src/lib/actions/profile.ts`
    - Buat fungsi `getDisplayName(profile)` yang mengembalikan `display_name` jika ada, fallback ke username sebelum `@` dari email
    - Buat fungsi `getAvatarInitial(displayName)` yang mengembalikan `charAt(0).toUpperCase()` dari display name
    - _Requirements: 1.2, 1.3_

  - [ ]* 2.2 Tulis property test untuk helper functions
    - **Property 1: Display name fallback ke username email**
    - **Validates: Requirements 1.2**
    - **Property 2: Avatar placeholder menggunakan inisial**
    - **Validates: Requirements 1.3**

  - [x] 2.3 Implementasi `updateProfile` action di `src/lib/actions/profile.ts`
    - Validasi `displayName`: tidak kosong, panjang 2–50 karakter, kembalikan error jika tidak valid
    - Update kolom `display_name` di tabel `profiles` untuk user yang sedang login
    - `revalidatePath('/profile')` dan `revalidatePath('/dashboard')`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.4 Tulis property test untuk `updateProfile`
    - **Property 3: Validasi panjang display name**
    - **Validates: Requirements 2.2, 2.3**
    - **Property 4: Penyimpanan display name**
    - **Validates: Requirements 2.1**

  - [x] 2.5 Implementasi `updateAvatar` action di `src/lib/actions/profile.ts`
    - Terima `FormData`, ekstrak file dari field `avatar`
    - Validasi MIME type (`image/jpeg`, `image/png`, `image/webp`) dan ukuran maks 2 MB
    - Upload ke Supabase Storage bucket `avatars` pada path `{user_id}/avatar.{ext}`
    - Hapus file lama jika ada sebelum upload (gunakan `storage.remove()`)
    - Update kolom `avatar_url` di tabel `profiles` dengan URL publik hasil `getPublicUrl()`
    - `revalidatePath('/profile')` dan `revalidatePath('/dashboard')`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 2.6 Tulis property test untuk `updateAvatar`
    - **Property 5: Validasi file avatar (tipe dan ukuran)**
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - **Property 6: Path storage avatar mengikuti konvensi**
    - **Validates: Requirements 3.1**
    - **Property 7: Avatar URL tersimpan setelah upload berhasil**
    - **Validates: Requirements 3.5**
    - **Property 8: Satu avatar per user di storage**
    - **Validates: Requirements 3.6**

  - [x] 2.7 Implementasi `updateEmail` action di `src/lib/actions/profile.ts`
    - Validasi format email dengan regex sebelum memanggil Supabase Auth
    - Panggil `supabase.auth.updateUser({ email: newEmail })` jika valid
    - Kembalikan error dari Auth Service jika gagal
    - _Requirements: 4.1, 4.2, 4.3, 4.6_

  - [ ]* 2.8 Tulis property test untuk `updateEmail`
    - **Property 9: Validasi format email**
    - **Validates: Requirements 4.2, 4.3**
    - **Property 10: Error propagation dari Auth Service**
    - **Validates: Requirements 4.6**

  - [x] 2.9 Implementasi `updatePassword` action di `src/lib/actions/profile.ts`
    - Validasi `newPassword` minimal 8 karakter
    - Validasi `newPassword === confirmPassword`
    - Panggil `supabase.auth.updateUser({ password: newPassword })` jika valid
    - Kembalikan status sukses tanpa memanggil `signOut`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 2.10 Tulis property test untuk `updatePassword`
    - **Property 11: Validasi password (kecocokan dan panjang)**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - **Property 12: Ganti password tidak logout sesi aktif**
    - **Validates: Requirements 5.7**

  - [x] 2.11 Implementasi `deleteAccount` action di `src/lib/actions/profile.ts`
    - Ambil email user yang sedang login, bandingkan dengan `confirmEmail` input
    - Kembalikan error jika tidak cocok tanpa melakukan operasi apapun
    - Hapus row dari tabel `profiles` terlebih dahulu
    - Panggil `supabase.auth.admin.deleteUser(user.id)` untuk hapus dari `auth.users`
    - Panggil `supabase.auth.signOut()` lalu `redirect('/login')`
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [ ]* 2.12 Tulis property test untuk `deleteAccount`
    - **Property 13: Konfirmasi email untuk hapus akun**
    - **Validates: Requirements 6.5**
    - **Property 14: Urutan operasi hapus akun**
    - **Validates: Requirements 6.3, 6.4**

- [ ] 3. Checkpoint — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

- [x] 4. Implementasi Client Components
  - [x] 4.1 Buat `src/components/profile-form.tsx`
    - Client Component dengan form untuk edit `display_name`
    - Gunakan `useActionState` dengan `updateProfile` action
    - Tampilkan error message jika ada, tampilkan nilai saat ini sebagai default value
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.2 Buat `src/components/avatar-form.tsx`
    - Client Component dengan input file dan preview avatar
    - Tampilkan `<img>` dari `avatar_url` jika ada, fallback ke inisial (dari `getAvatarInitial`)
    - Submit form dengan `FormData` ke `updateAvatar` action
    - Tampilkan error message jika ada
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 1.3_

  - [x] 4.3 Buat `src/components/email-form.tsx`
    - Client Component dengan form untuk ganti email
    - Tampilkan email saat ini sebagai informasi (read-only)
    - Gunakan `useActionState` dengan `updateEmail` action
    - Tampilkan pesan sukses (instruksi cek email konfirmasi) atau error
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.4 Buat `src/components/password-form.tsx`
    - Client Component dengan dua field: password baru dan konfirmasi password
    - Gunakan `useActionState` dengan `updatePassword` action
    - Tampilkan error message jika ada, tampilkan pesan sukses jika berhasil
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.5 Buat `src/components/delete-account-section.tsx`
    - Client Component dengan tombol "Hapus Akun" di danger zone
    - Tampilkan `ConfirmDialog` (gunakan komponen existing `src/components/confirm-dialog.tsx`) yang meminta user mengetik email mereka
    - Validasi email di client sebelum submit, tampilkan error jika tidak cocok
    - Submit ke `deleteAccount` action
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 5. Buat halaman profil dan update dashboard layout
  - [x] 5.1 Buat `src/app/(dashboard)/profile/page.tsx`
    - Server Component: panggil `createClient()`, `getUser()`, dan query `profiles`
    - Hitung `displayName` menggunakan `getDisplayName(profile)` dan `initial` menggunakan `getAvatarInitial(displayName)`
    - Render semua Client Components: `AvatarForm`, `ProfileForm`, `EmailForm`, `PasswordForm`, `DeleteAccountSection`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 5.2 Update `src/app/(dashboard)/layout.tsx`
    - Gunakan `profile.display_name` sebagai prioritas untuk `displayName`, fallback ke username dari email
    - Tampilkan `<Image>` dari `profile.avatar_url` jika ada, fallback ke inisial di sidebar dan header
    - Tambahkan link "Profil" ke `navItems` dengan `href: '/profile'`
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 3.7_

- [x] 6. Final checkpoint — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property tests menggunakan library `fast-check` dengan minimum 100 iterasi
- Semua Server Actions mengembalikan `{ error: string | null }` konsisten dengan pola di `store.ts` dan `menu.ts`
- File test berada di `src/lib/actions/__tests__/profile.test.ts` dan `profile.property.ts`
