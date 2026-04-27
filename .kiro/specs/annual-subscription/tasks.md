# Implementation Plan: Annual Subscription

## Overview

Menambahkan opsi paket langganan tahunan ke platform MyMenu. Implementasi bersifat additive — dimulai dari database migration, lalu TypeScript types, kemudian server actions, komponen UI, dan diakhiri dengan wiring semua bagian bersama.

## Tasks

- [x] 1. Database migration dan TypeScript types
  - Buat file `supabase/migrations/026_add_plan_type_to_subscriptions.sql`
  - Tambahkan kolom `plan_type TEXT NOT NULL DEFAULT 'monthly'` dengan CHECK constraint `IN ('monthly', 'annual')` ke tabel `subscriptions`
  - Tambahkan backfill `UPDATE subscriptions SET plan_type = 'monthly' WHERE plan_type IS NULL`
  - Perbarui `handle_new_user` function agar INSERT trial menyertakan `plan_type = 'monthly'`
  - Perbarui `src/types/database.types.ts`: tambahkan `plan_type: string` ke Row, `plan_type?: string` ke Insert dan Update pada tabel `subscriptions`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.3_

- [x] 2. Perbarui server actions dan WhatsApp template
  - [x] 2.1 Perbarui `src/lib/actions/admin.ts`
    - Tambahkan `plan_type?: 'monthly' | 'annual'` ke parameter `data` pada `updateSubscription`
    - Tambahkan validasi: jika `data.plan_type` ada dan bukan `'monthly'` atau `'annual'`, return `{ error: 'Jenis paket tidak valid.' }`
    - Tambahkan `plan_type: 'monthly'` ke INSERT di `createTrialSubscription`
    - Perbarui `extendSubscription` agar membaca `plan_type` dari subscription yang ada dan meneruskannya ke notifikasi WA
    - _Requirements: 4.3, 4.4, 4.5, 5.2, 5.3, 6.2_

  - [ ]* 2.2 Write unit tests untuk validasi `updateSubscription`
    - Test: `plan_type = 'invalid'` → return error
    - Test: `plan_type = 'annual'` → lolos validasi
    - Test: `plan_type = 'monthly'` → lolos validasi
    - _Requirements: 4.5_

  - [x] 2.3 Perbarui `src/lib/whatsapp.ts`
    - Tambahkan parameter `planType: 'monthly' | 'annual' = 'monthly'` ke `msgSubscriptionActivated`
    - Sertakan teks "Paket Tahunan" atau "Paket Bulanan" dalam body pesan sesuai `planType`
    - Perbarui semua pemanggil `msgSubscriptionActivated` di `admin.ts` agar meneruskan `planType`
    - _Requirements: 4.6_

  - [ ]* 2.4 Write property test untuk `msgSubscriptionActivated`
    - **Property 5: Pesan WA aktivasi selalu menyertakan informasi plan_type**
    - **Validates: Requirements 4.6**
    - Gunakan `fc.constantFrom('monthly', 'annual')` untuk generate `planType`
    - Assert: `planType = 'annual'` → string mengandung "Paket Tahunan"; `planType = 'monthly'` → mengandung "Paket Bulanan"
    - _Requirements: 4.6_

- [x] 3. Checkpoint — Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Komponen `SubscriptionBanner` dan update dashboard
  - [x] 4.1 Buat `src/components/subscription-banner.tsx`
    - Ekstrak logika banner subscription dari `src/app/(dashboard)/dashboard/page.tsx` ke komponen terpisah
    - Props: `status: 'trial' | 'active' | 'expired'`, `planType: 'monthly' | 'annual'`, `expiresAt: string | null`, `daysUntilExpiry: number | null`
    - Tampilkan label "Paket Tahunan" (badge hijau tua) jika `planType = 'annual'`, "Paket Bulanan" jika `planType = 'monthly'`
    - Tetap tampilkan jumlah hari tersisa dan tanggal berakhir untuk semua `planType`
    - Fallback: jika `planType` null/undefined, tampilkan "Paket Bulanan"
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 4.2 Write property test untuk `SubscriptionBanner`
    - **Property 1: Label paket selalu sesuai plan_type**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - Gunakan `fc.constantFrom('monthly', 'annual')` untuk generate `planType`
    - Assert: render dengan `planType = 'annual'` → DOM mengandung "Paket Tahunan"; `planType = 'monthly'` → mengandung "Paket Bulanan"
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 4.3 Write property test untuk hari tersisa di `SubscriptionBanner`
    - **Property 2: Informasi hari tersisa selalu ditampilkan terlepas dari plan_type**
    - **Validates: Requirements 3.4**
    - Gunakan `fc.constantFrom('monthly', 'annual')` × `fc.date({ min: new Date() })` untuk generate kombinasi
    - Assert: render selalu menampilkan elemen hari tersisa dan tanggal berakhir
    - _Requirements: 3.4_

  - [x] 4.4 Integrasikan `SubscriptionBanner` ke `src/app/(dashboard)/dashboard/page.tsx`
    - Ganti inline banner logic dengan komponen `SubscriptionBanner`
    - Teruskan `subscription.plan_type` (dengan fallback `'monthly'`) ke prop `planType`
    - _Requirements: 3.1, 3.4, 3.5_

- [x] 5. Perbarui admin panel — `SubActions` dan tabel subscriptions
  - [x] 5.1 Perbarui `src/app/(admin)/admin/subscriptions/sub-actions.tsx`
    - Tambahkan state `planType` (default dari prop `currentPlanType`)
    - Tambahkan dropdown "Jenis Paket" dengan opsi "Bulanan" (`monthly`) dan "Tahunan" (`annual`) di dalam modal edit
    - Tambahkan tombol shortcut "Perpanjang 30 Hari" dan "Perpanjang 365 Hari" di seksi perpanjangan
    - Sertakan `plan_type` dalam payload `handleUpdate` jika berubah
    - Teruskan `planType` ke `extendSubscription` melalui `handleExtend` (untuk notifikasi WA)
    - _Requirements: 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4_

  - [x] 5.2 Perbarui `src/app/(admin)/admin/subscriptions/page.tsx`
    - Tambahkan kolom "Plan" di tabel desktop (antara kolom "Status" dan "Mulai")
    - Tampilkan badge "Tahunan" atau "Bulanan" berdasarkan `sub.plan_type`
    - Tambahkan baris plan di mobile card view
    - Perbarui props `SubActions` untuk meneruskan `currentPlanType={sub.plan_type ?? 'monthly'}`
    - _Requirements: 4.1_

- [x] 6. Checkpoint — Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Komponen `PricingSection` dan update landing page
  - [x] 7.1 Buat `src/components/pricing-section.tsx`
    - Buat interface `PricingPlan` sesuai design: `id`, `name`, `price`, `pricePerMonth`, `duration`, `savings?`, `badge?`, `ctaHref`
    - Render dua kartu: Bulanan (Rp20.000/bulan) dan Tahunan (Rp200.000/tahun)
    - Kartu tahunan: tampilkan badge "Paling Hemat", teks "Hemat Rp40.000 (2 bulan gratis)", harga ekuivalen "~Rp16.700/bulan"
    - Kedua tombol CTA mengarah ke `/register`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 7.2 Write unit tests untuk `PricingSection`
    - Test: kedua kartu harga ter-render
    - Test: badge "Paling Hemat" ada di kartu tahunan
    - Test: teks "Hemat Rp40.000 (2 bulan gratis)" ada
    - Test: teks "~Rp16.700/bulan" ada
    - Test: kedua tombol CTA mengarah ke `/register`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 7.3 Integrasikan `PricingSection` ke `src/app/page.tsx`
    - Ganti atau perbarui seksi `#harga` di landing page dengan komponen `PricingSection`
    - Perbarui tabel komparasi untuk mencantumkan opsi tahunan Menuly sebagai Rp200.000/tahun
    - _Requirements: 2.1, 2.6_

- [x] 8. Tambahkan konstanta harga ke `src/lib/queries/admin.ts`
  - Tambahkan `SUBSCRIPTION_PRICE_MONTHLY = 20_000`, `SUBSCRIPTION_PRICE_ANNUAL = 200_000`
  - Tambahkan `SUBSCRIPTION_DAYS_MONTHLY = 30`, `SUBSCRIPTION_DAYS_ANNUAL = 365`
  - Gunakan konstanta ini di `extendSubscription` untuk tombol shortcut 30/365 hari
  - _Requirements: 4.3, 4.4, 5.2, 5.3_

- [ ] 9. Property tests untuk kalkulasi perpanjangan
  - [ ]* 9.1 Write property test untuk `extendSubscription` date calculation
    - **Property 3: Perpanjangan N hari menghasilkan expires_at tepat N hari dari tanggal dasar**
    - **Validates: Requirements 4.3, 4.4, 5.2, 5.3**
    - Ekstrak logika kalkulasi tanggal ke fungsi pure `calculateNewExpiry(baseDate: Date, days: number): Date`
    - Gunakan `fc.integer({ min: 1, max: 730 })` × `fc.date()` untuk generate input
    - Assert: `result.getTime() === baseDate.getTime() + days * 86400000`
    - _Requirements: 4.3, 4.4, 5.2, 5.3_

  - [ ]* 9.2 Write property test untuk round-trip `plan_type`
    - **Property 4: Update plan_type tersimpan dengan benar (round-trip)**
    - **Validates: Requirements 4.5**
    - Gunakan `fc.constantFrom('monthly', 'annual')` untuk generate `planType`
    - Mock Supabase client, assert bahwa nilai yang di-update sama dengan yang dikirimkan
    - _Requirements: 4.5_

- [x] 10. Final checkpoint — Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan bisa dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Design menggunakan TypeScript/Next.js — semua kode ditulis dalam TypeScript
- Library property-based testing: **fast-check** (`fc`)
- Perubahan bersifat additive — tidak ada breaking change pada logika subscription yang sudah ada
- `getSubscription` menggunakan `select('*')` sehingga otomatis mengembalikan `plan_type` setelah migration tanpa perubahan kode query
