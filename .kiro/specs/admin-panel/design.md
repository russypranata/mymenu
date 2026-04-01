# Design Document: Admin Panel MyMenu

## Overview

Admin Panel adalah route group terpisah (`/admin`) dengan layout, auth guard, dan navigasi sendiri. Memanfaatkan RLS policy admin yang sudah ada di Supabase (`is_admin()` function dan policy per tabel). Dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, dan Supabase server client — konsisten dengan pola yang sudah ada di codebase.

## Architecture

```
src/app/(admin)/
  layout.tsx              ← Auth guard + sidebar layout admin
  admin/
    page.tsx              ← Overview stats
  admin/users/
    page.tsx              ← Daftar users
  admin/subscriptions/
    page.tsx              ← Daftar subscriptions
  admin/stores/
    page.tsx              ← Daftar stores

src/lib/queries/
  admin.ts                ← Query functions untuk admin panel

src/lib/actions/
  admin.ts                ← Server actions untuk mutasi admin

src/components/
  admin-nav-link.tsx      ← Nav link component untuk sidebar admin
```

## Component Design

### Auth Guard (layout.tsx)

```typescript
// Pseudocode
async function AdminLayout({ children }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile(user.id)
  if (profile.role !== 'admin') redirect('/dashboard')

  return <AdminShell profile={profile}>{children}</AdminShell>
}
```

### Query Functions (src/lib/queries/admin.ts)

```typescript
// Overview stats
async function getAdminStats(): Promise<{
  totalUsers: number
  totalStores: number
  activeSubscriptions: number
  trialSubscriptions: number
  suspendedUsers: number
  monthlyRevenue: number  // activeSubscriptions * SUBSCRIPTION_PRICE
}>

// Users list with optional filters
async function getAdminUsers(filters?: {
  status?: 'active' | 'inactive' | 'suspended'
  role?: 'user' | 'admin'
  search?: string
}): Promise<Profile[]>

// User detail with stores and subscription
async function getAdminUserDetail(userId: string): Promise<{
  profile: Profile
  stores: Store[]
  subscription: Subscription | null
}>

// Subscriptions list with user info
async function getAdminSubscriptions(filters?: {
  status?: 'trial' | 'active' | 'expired' | 'cancelled'
}): Promise<(Subscription & { profile: Profile })[]>

// Stores list with owner info
async function getAdminStores(search?: string): Promise<(Store & { profile: Profile })[]>

// Store detail with menu count
async function getAdminStoreDetail(storeId: string): Promise<Store & {
  profile: Profile
  menuCount: number
}>
```

### Server Actions (src/lib/actions/admin.ts)

```typescript
// Update user status
async function updateUserStatus(
  userId: string,
  status: 'active' | 'inactive' | 'suspended'
): Promise<{ error: string | null }>

// Create trial subscription
async function createTrialSubscription(
  userId: string
): Promise<{ error: string | null }>

// Update subscription
async function updateSubscription(
  subscriptionId: string,
  data: { status?: string; expires_at?: string }
): Promise<{ error: string | null }>

// Extend subscription
async function extendSubscription(
  subscriptionId: string,
  days: number
): Promise<{ error: string | null }>
```

## Data Flow

1. Layout melakukan auth check via Supabase server client
2. Pages memanggil query functions (server components)
3. Mutasi dilakukan via server actions dengan revalidatePath
4. Error ditampilkan via toast atau inline error state

## Correctness Properties

### Property 1: Admin-only access
Untuk setiap request ke route `/admin`, jika user tidak terautentikasi atau role bukan `admin`, maka user HARUS diredirect (tidak pernah melihat konten admin).

### Property 2: Status transition validity
Operasi suspend hanya valid pada user dengan status `active` atau `inactive`. Operasi aktifkan hanya valid pada user dengan status `suspended`.

### Property 3: Subscription extension monotonicity
Setelah operasi perpanjang dengan N hari, nilai `expires_at` baru HARUS lebih besar dari nilai `expires_at` sebelumnya (atau lebih besar dari hari ini jika sudah expired).

### Property 4: Trial subscription uniqueness
Setelah `createTrialSubscription`, user tersebut memiliki tepat satu subscription record baru dengan status `trial`.

### Property 5: Stats consistency
`totalUsers` yang ditampilkan HARUS sama dengan jumlah record di `profiles` dengan `role = 'user'` pada saat query dijalankan.
