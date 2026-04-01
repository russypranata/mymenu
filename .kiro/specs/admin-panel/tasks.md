# Implementation Plan: Admin Panel MyMenu

## Overview

Implementasi Admin Panel sebagai route group terpisah (`/admin`) dengan auth guard berbasis role, layout sidebar, query functions, server actions, dan halaman-halaman manajemen platform.

## Tasks

- [x] 1. Buat route group `/admin` dengan auth guard dan layout sidebar
  - Buat direktori `src/app/(admin)/admin/` dan file `src/app/(admin)/layout.tsx`
  - Di layout, gunakan Supabase server client untuk verifikasi sesi dan cek `profile.role === 'admin'`
  - Redirect ke `/login` jika tidak ada sesi, redirect ke `/dashboard` jika role bukan `admin`
  - Tampilkan sidebar dengan navigasi: Overview, Users, Subscriptions, Stores
  - Tampilkan identitas admin (email/display_name) di sidebar atau header
  - Sertakan tombol "Keluar" yang memanggil server action `logout`
  - Buat komponen `src/components/admin-nav-link.tsx` untuk nav item sidebar admin
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4_

- [x] 2. Buat query functions untuk admin di `src/lib/queries/admin.ts`
  - [x] 2.1 Implementasi `getAdminStats()` — query total users (role='user'), total stores, active subscriptions, trial subscriptions, suspended users, dan estimasi revenue (active * harga)
    - Gunakan `SUBSCRIPTION_PRICE` sebagai konstanta (misal 49000)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [x] 2.2 Implementasi `getAdminUsers(filters?)` — query semua profiles dengan filter opsional status, role, dan search (email/display_name)
    - _Requirements: 3.1, 3.2, 3.3, 3.8_

  - [x] 2.3 Implementasi `getAdminUserDetail(userId)` — query profile + stores milik user + subscription aktif
    - _Requirements: 3.4_

  - [x] 2.4 Implementasi `getAdminSubscriptions(filters?)` — query semua subscriptions join profiles (email, display_name), dengan filter opsional status
    - Format `expires_at` sebagai DD/MM/YYYY di layer query atau komponen
    - _Requirements: 4.1, 4.2, 4.8_

  - [x] 2.5 Implementasi `getAdminStores(search?)` — query semua stores join profiles (nama pemilik), dengan filter opsional search (nama/slug)
    - _Requirements: 5.1, 5.4_

  - [x] 2.6 Implementasi `getAdminStoreDetail(storeId)` — query store + profile pemilik + jumlah menu
    - _Requirements: 5.2_

- [x] 3. Buat server actions admin di `src/lib/actions/admin.ts`
  - [x] 3.1 Implementasi `updateUserStatus(userId, status)` — update kolom `status` di tabel `profiles`
    - Validasi bahwa caller adalah admin sebelum update
    - Return `{ error: string | null }`
    - _Requirements: 3.5, 3.6, 3.7_

  - [x] 3.2 Implementasi `createTrialSubscription(userId)` — insert record subscription baru dengan status `trial`, `started_at` = hari ini, `expires_at` = 7 hari dari sekarang
    - Return `{ error: string | null }`
    - _Requirements: 4.3, 4.7_

  - [x] 3.3 Implementasi `updateSubscription(subscriptionId, data)` — update `status` dan/atau `expires_at` pada record subscription
    - Return `{ error: string | null }`
    - _Requirements: 4.4, 4.5, 4.7_

  - [x] 3.4 Implementasi `extendSubscription(subscriptionId, days)` — hitung `expires_at` baru (max dari `expires_at` saat ini dan hari ini, tambah N hari), lalu update
    - Return `{ error: string | null }`
    - _Requirements: 4.6, 4.7_

- [x] 4. Checkpoint — Pastikan semua query dan actions tidak ada error TypeScript
  - Pastikan semua tests pass, tanya user jika ada pertanyaan.

- [x] 5. Buat halaman Overview (`src/app/(admin)/admin/page.tsx`)
  - Panggil `getAdminStats()` dan tampilkan stat cards: Total Users, Total Stores, Active Subscriptions, Trial Subscriptions, Suspended Users, Estimasi Revenue
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 6. Buat halaman Users (`src/app/(admin)/admin/users/page.tsx`)
  - [x] 6.1 Tampilkan tabel users dengan kolom: email, display_name, status, role, tanggal registrasi
    - Baca filter dari URL search params (`?status=`, `?role=`, `?search=`)
    - Panggil `getAdminUsers(filters)` sesuai params
    - _Requirements: 3.1, 3.2, 3.3, 3.8_

  - [x] 6.2 Tambahkan UI filter status (active/inactive/suspended) dan filter role (user/admin) sebagai komponen client
    - Update URL search params saat filter berubah
    - _Requirements: 3.2, 3.3_

  - [x] 6.3 Tambahkan search input untuk filter email/display_name
    - _Requirements: 3.8_

  - [x] 6.4 Tambahkan tombol aksi "Suspend" / "Aktifkan" per baris yang memanggil `updateUserStatus`
    - Tampilkan pesan error jika aksi gagal
    - _Requirements: 3.5, 3.6, 3.7_

  - [x] 6.5 Buat modal atau halaman detail user yang menampilkan stores milik user dan status subscription
    - Panggil `getAdminUserDetail(userId)` saat user diklik
    - _Requirements: 3.4_

- [x] 7. Buat halaman Subscriptions (`src/app/(admin)/admin/subscriptions/page.tsx`)
  - [x] 7.1 Tampilkan tabel subscriptions dengan kolom: email user, display_name, status, started_at, expires_at (format DD/MM/YYYY)
    - Baca filter dari URL search params (`?status=`)
    - Panggil `getAdminSubscriptions(filters)`
    - _Requirements: 4.1, 4.2, 4.8_

  - [x] 7.2 Tambahkan UI filter status subscription (trial/active/expired/cancelled)
    - _Requirements: 4.2_

  - [x] 7.3 Tambahkan tombol "Aktifkan Trial" untuk user yang belum punya subscription, memanggil `createTrialSubscription`
    - _Requirements: 4.3_

  - [x] 7.4 Buat form edit subscription (modal atau inline) untuk mengubah status dan expires_at, memanggil `updateSubscription`
    - Tampilkan pesan error jika gagal
    - _Requirements: 4.4, 4.5, 4.7_

  - [x] 7.5 Tambahkan tombol "Perpanjang" dengan input jumlah hari, memanggil `extendSubscription`
    - _Requirements: 4.6_

- [x] 8. Buat halaman Stores (`src/app/(admin)/admin/stores/page.tsx`)
  - [x] 8.1 Tampilkan tabel stores dengan kolom: nama toko, slug, nama pemilik, tanggal dibuat
    - Baca search dari URL search params (`?search=`)
    - Panggil `getAdminStores(search)`
    - _Requirements: 5.1, 5.4_

  - [x] 8.2 Tambahkan search input untuk filter nama toko atau slug
    - _Requirements: 5.4_

  - [x] 8.3 Buat modal atau panel detail store yang menampilkan deskripsi, alamat, WhatsApp, jumlah menu, dan link "Lihat Menu Publik" (buka `/{slug}` di tab baru)
    - Panggil `getAdminStoreDetail(storeId)` saat store diklik
    - _Requirements: 5.2, 5.3_

- [x] 9. Checkpoint akhir — Pastikan semua halaman admin berfungsi dan tidak ada error TypeScript
  - Pastikan semua tests pass, tanya user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceability
- RLS policy admin sudah ada di Supabase (fungsi `is_admin()`, policy per tabel)
- Gunakan pola yang sama dengan dashboard yang sudah ada (server components, server actions, Tailwind)
