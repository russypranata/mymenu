# Design Document

## Feature: Annual Subscription

---

## Overview

Fitur ini menambahkan opsi paket langganan tahunan (`annual`) ke platform MyMenu sebagai alternatif dari paket bulanan (`monthly`) yang sudah ada. Paket tahunan menawarkan diskon setara 2 bulan gratis — Rp200.000/tahun vs Rp240.000 jika bayar bulanan (hemat ~17%).

Karena MyMenu menggunakan pembayaran manual (transfer bank/QRIS), tidak ada integrasi payment gateway. Admin tetap mengaktifkan langganan secara manual melalui admin panel setelah konfirmasi pembayaran diterima.

Perubahan utama yang diperlukan:
1. **Database**: Tambah kolom `plan_type` ke tabel `subscriptions`
2. **Landing Page**: Tampilkan dua kartu harga di seksi `#harga`
3. **Dashboard User**: Tampilkan informasi jenis paket aktif
4. **Admin Panel**: Dukungan aktivasi dan perpanjangan paket tahunan
5. **TypeScript Types**: Perbarui `database.types.ts`

---

## Architecture

Fitur ini mengikuti arsitektur yang sudah ada di codebase:

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│                                                             │
│  Landing Page (/)          Dashboard (/dashboard)           │
│  ┌─────────────────┐       ┌──────────────────────────┐    │
│  │  PricingSection  │       │  SubscriptionBanner      │    │
│  │  (new component) │       │  (updated component)     │    │
│  └─────────────────┘       └──────────────────────────┘    │
│                                                             │
│  Admin Panel (/admin/subscriptions)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SubActions (updated)  │  SubFilters (unchanged)     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐      ┌──────────────────────────────────┐
│  Server Actions  │      │         Supabase DB              │
│  admin.ts        │      │  subscriptions                   │
│  (updated)       │      │  + plan_type TEXT DEFAULT        │
└─────────────────┘      │    'monthly' CHECK IN            │
                          │    ('monthly','annual')          │
                          └──────────────────────────────────┘
```

**Prinsip desain:**
- Perubahan bersifat additive — tidak ada breaking change pada logika yang sudah ada
- `plan_type` hanya mempengaruhi durasi perpanjangan dan tampilan UI; logika validasi subscription (`requireSubscription`) tidak berubah
- Default `'monthly'` memastikan backward compatibility untuk semua data lama

---

## Components and Interfaces

### 1. Database Migration (`026b_add_plan_type_to_subscriptions.sql`)

Migration baru yang menambahkan kolom `plan_type` ke tabel `subscriptions`.

### 2. `PricingSection` Component (baru)

Komponen React untuk menampilkan dua kartu harga di landing page. Diekstrak sebagai komponen terpisah agar mudah diuji dan dikelola.

```tsx
// src/components/pricing-section.tsx
interface PricingPlan {
  id: 'monthly' | 'annual'
  name: string
  price: number          // harga total (Rp)
  pricePerMonth: number  // harga per bulan ekuivalen
  duration: string       // "per bulan" | "per tahun"
  savings?: string       // "Hemat Rp40.000 (2 bulan gratis)"
  badge?: string         // "Paling Hemat"
  ctaHref: string
}
```

### 3. `SubscriptionBanner` Component (diperbarui)

Banner di dashboard yang sudah ada diperbarui untuk menampilkan `plan_type`. Saat ini logika banner tersebar di `dashboard/page.tsx` — akan diekstrak ke komponen terpisah.

```tsx
// src/components/subscription-banner.tsx
interface SubscriptionBannerProps {
  status: 'trial' | 'active' | 'expired'
  planType: 'monthly' | 'annual'
  expiresAt: string | null
  daysUntilExpiry: number | null
}
```

### 4. `SubActions` Component (diperbarui)

Modal edit subscription di admin panel diperbarui dengan:
- Dropdown `plan_type` (Bulanan / Tahunan)
- Tombol shortcut "Perpanjang 30 Hari" dan "Perpanjang 365 Hari"

### 5. Server Actions (`src/lib/actions/admin.ts`)

Fungsi yang diperbarui:

```typescript
// updateSubscription — tambah support plan_type
export async function updateSubscription(
  subscriptionId: string,
  data: { status?: string; expires_at?: string; plan_type?: 'monthly' | 'annual' }
): Promise<{ error: string | null }>

// createTrialSubscription — tambah plan_type: 'monthly'
export async function createTrialSubscription(
  userId: string
): Promise<{ error: string | null }>

// extendSubscription — tidak berubah secara signature, tapi WA notification
// akan menyertakan plan_type
export async function extendSubscription(
  subscriptionId: string,
  days: number
): Promise<{ error: string | null }>
```

### 6. WhatsApp Message Template (diperbarui)

```typescript
// src/lib/whatsapp.ts
export function msgSubscriptionActivated(
  name: string,
  expiresAt: string,
  planType: 'monthly' | 'annual' = 'monthly'
): string
```

### 7. Queries (`src/lib/queries/dashboard.ts`)

`getSubscription` sudah menggunakan `select('*')` sehingga otomatis mengembalikan `plan_type` setelah kolom ditambahkan. Tidak ada perubahan kode yang diperlukan.

---

## Data Models

### Perubahan Tabel `subscriptions`

```sql
ALTER TABLE public.subscriptions
  ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'monthly'
  CONSTRAINT subscriptions_plan_type_check
    CHECK (plan_type IN ('monthly', 'annual'));

-- Backfill data lama
UPDATE public.subscriptions
  SET plan_type = 'monthly'
  WHERE plan_type IS NULL;
```

### Tipe TypeScript yang Diperbarui

```typescript
// src/types/database.types.ts — tabel subscriptions
subscriptions: {
  Row: {
    created_at: string
    expires_at: string | null
    id: string
    plan_type: string          // BARU
    started_at: string | null
    status: string
    user_id: string
  }
  Insert: {
    created_at?: string
    expires_at?: string | null
    id?: string
    plan_type?: string         // BARU, optional (default 'monthly')
    started_at?: string | null
    status?: string
    user_id: string
  }
  Update: {
    created_at?: string
    expires_at?: string | null
    id?: string
    plan_type?: string         // BARU
    started_at?: string | null
    status?: string
    user_id?: string
  }
}
```

### Konstanta Harga

```typescript
// src/lib/queries/admin.ts (atau constants baru)
export const SUBSCRIPTION_PRICE_MONTHLY = 20_000   // Rp20.000/bulan
export const SUBSCRIPTION_PRICE_ANNUAL  = 200_000  // Rp200.000/tahun
export const SUBSCRIPTION_DAYS_MONTHLY  = 30
export const SUBSCRIPTION_DAYS_ANNUAL   = 365
```

### Perbarui `handle_new_user` Function (SQL)

```sql
-- Tambah plan_type = 'monthly' pada INSERT trial
INSERT INTO public.subscriptions (user_id, status, started_at, expires_at, plan_type)
VALUES (
  NEW.id,
  'trial',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  'monthly'
);
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Fitur ini melibatkan logika bisnis murni yang cocok untuk property-based testing: kalkulasi tanggal perpanjangan, rendering label berdasarkan data, dan round-trip update data. Library yang digunakan: **fast-check** (TypeScript/JavaScript).

### Property 1: Label paket selalu sesuai plan_type

*For any* subscription dengan `plan_type` yang valid (`'monthly'` atau `'annual'`), fungsi yang menghasilkan label paket SHALL mengembalikan label yang tepat sesuai nilai `plan_type` — "Paket Bulanan" untuk `'monthly'` dan "Paket Tahunan" untuk `'annual'`.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 2: Informasi hari tersisa selalu ditampilkan terlepas dari plan_type

*For any* kombinasi `plan_type` yang valid dan `expires_at` yang valid (tanggal di masa depan), komponen `SubscriptionBanner` SHALL selalu menampilkan jumlah hari tersisa dan tanggal berakhir — tidak ada kombinasi yang menyebabkan informasi ini hilang.

**Validates: Requirements 3.4**

### Property 3: Perpanjangan N hari menghasilkan expires_at yang tepat N hari dari tanggal dasar

*For any* tanggal dasar yang valid dan jumlah hari N yang positif, fungsi kalkulasi perpanjangan SHALL menghasilkan `expires_at` yang tepat N hari setelah tanggal dasar — berlaku untuk N=30 (bulanan) maupun N=365 (tahunan), dan untuk tanggal dasar di masa lalu maupun masa depan.

**Validates: Requirements 4.3, 4.4, 5.2, 5.3**

### Property 4: Update plan_type tersimpan dengan benar (round-trip)

*For any* nilai `plan_type` yang valid (`'monthly'` atau `'annual'`), memanggil `updateSubscription` dengan nilai tersebut dan kemudian membaca kembali subscription dari database SHALL menghasilkan nilai `plan_type` yang sama dengan yang dikirimkan.

**Validates: Requirements 4.5**

### Property 5: Pesan WA aktivasi selalu menyertakan informasi plan_type

*For any* nama user yang valid dan tanggal berakhir yang valid, fungsi `msgSubscriptionActivated` dengan `planType = 'annual'` SHALL menghasilkan string yang mengandung teks "Paket Tahunan", dan dengan `planType = 'monthly'` SHALL menghasilkan string yang mengandung teks "Paket Bulanan".

**Validates: Requirements 4.6**

---

## Error Handling

### Validasi Input di Server Actions

```typescript
// updateSubscription — validasi plan_type
if (data.plan_type && !['monthly', 'annual'].includes(data.plan_type)) {
  return { error: 'Jenis paket tidak valid.' }
}

// extendSubscription — validasi days
if (days <= 0 || !Number.isInteger(days)) {
  return { error: 'Jumlah hari harus bilangan bulat positif.' }
}
```

### Database Constraint

Kolom `plan_type` memiliki CHECK constraint di level database sebagai lapisan pertahanan terakhir. Jika nilai invalid lolos dari validasi aplikasi, database akan menolak INSERT/UPDATE dengan error yang jelas.

### Backward Compatibility

- Semua subscription lama yang tidak memiliki `plan_type` akan mendapat nilai `'monthly'` melalui DEFAULT constraint dan backfill migration
- `requireSubscription` di `src/lib/subscription.ts` tidak perlu diubah — logika validasi akses tidak bergantung pada `plan_type`
- `getSubscription` menggunakan `select('*')` sehingga otomatis mengembalikan `plan_type` tanpa perubahan kode

### Graceful Degradation di UI

Jika `plan_type` bernilai `null` atau nilai tak terduga (data lama sebelum migration), UI akan menampilkan label "Paket Bulanan" sebagai fallback default.

---

## Testing Strategy

### Unit Tests (Example-Based)

Fokus pada kasus spesifik dan edge case:

- Render `PricingSection` — verifikasi kedua kartu harga, badge "Paling Hemat", teks "Hemat Rp40.000", harga "~Rp16.700/bulan"
- Render `SubscriptionBanner` dengan `plan_type='annual'` — verifikasi label "Paket Tahunan"
- Render `SubscriptionBanner` dengan `plan_type='monthly'` — verifikasi label "Paket Bulanan"
- Render `SubActions` modal — verifikasi dropdown plan_type ada, tombol shortcut "Perpanjang 30 Hari" dan "Perpanjang 365 Hari" ada
- `createTrialSubscription` — verifikasi subscription dibuat dengan `plan_type='monthly'`
- Database constraint — verifikasi INSERT dengan `plan_type='invalid'` ditolak

### Property-Based Tests (fast-check)

Minimum 100 iterasi per property. Setiap test diberi tag referensi ke property di dokumen ini.

```typescript
// Tag format: Feature: annual-subscription, Property {N}: {deskripsi singkat}

// Property 1: Label paket selalu sesuai plan_type
// Feature: annual-subscription, Property 1: label paket sesuai plan_type

// Property 2: Informasi hari tersisa selalu ditampilkan
// Feature: annual-subscription, Property 2: hari tersisa selalu ditampilkan

// Property 3: Perpanjangan N hari menghasilkan expires_at tepat N hari dari dasar
// Feature: annual-subscription, Property 3: kalkulasi perpanjangan akurat

// Property 4: Round-trip update plan_type
// Feature: annual-subscription, Property 4: round-trip update plan_type

// Property 5: Pesan WA menyertakan informasi plan_type
// Feature: annual-subscription, Property 5: pesan WA menyertakan plan_type
```

### Integration Tests

- Jalankan migration `026b` di Supabase lokal, verifikasi kolom `plan_type` ada dengan default dan constraint yang benar
- Verifikasi `handle_new_user` trigger menyertakan `plan_type='monthly'` pada subscription trial baru
- End-to-end: admin mengaktifkan langganan tahunan → user melihat "Paket Tahunan" di dashboard

### Smoke Tests

- Verifikasi kolom `plan_type` ada di tabel `subscriptions` setelah migration
- Verifikasi tidak ada baris dengan `plan_type IS NULL` setelah backfill
- Verifikasi TypeScript compilation berhasil setelah update `database.types.ts`
