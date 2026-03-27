# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## My Menu – SaaS Menu Digital UMKM (Production Ready)

---

## 1. Overview
My Menu adalah platform SaaS yang memungkinkan UMKM membuat halaman menu digital berbasis link (path/slug) yang dapat dibagikan melalui QR code, WhatsApp, dan media sosial.

Produk ini menggunakan konsep multi-tenant berbasis path:
- mymenu.pages.dev/kopi-andi

---

## 2. Tujuan Produk
- Mempermudah UMKM membuat menu digital dalam < 5 menit
- Meningkatkan konversi penjualan melalui WhatsApp
- Menyediakan solusi murah (Rp20.000/bulan)

---

## 3. Target User
### Primary
- Pemilik warung, kafe, restoran kecil

### Secondary
- Cloud kitchen
- Penjual rumahan

---

## 4. Value Proposition
- Setup super cepat
- Link langsung jadi
- Bisa langsung order via WhatsApp
- Tampilan modern & cepat

---

## 5. Business Model
- Subscription: Rp20.000 / bulan
- Free trial: 7 hari (opsional)
- Upsell (future): tema premium, custom domain

---

## 6. System Architecture

### Stack
- Frontend: Next.js
- Backend: Supabase (Auth + DB)
- Hosting: Cloudflare Pages
- Storage: Supabase Storage

### Flow
User → Next.js → Supabase → Render halaman /slug

---

## 7. Role System

### 1. User (Owner)
- Kelola toko & menu

### 2. Admin (Super Admin)
- Kelola seluruh user & sistem

---

## 8. Core Features (User)

### 8.1 Authentication
- Register (email/password)
- Login
- Logout

---

### 8.2 Dashboard User
- Overview toko
- Status subscription

---

### 8.3 Store Management
Field:
- Nama toko
- Slug (unique, lowercase, dash)
- Deskripsi
- Nomor WhatsApp
- Alamat (opsional)

Validasi:
- slug unik
- slug tanpa spasi

---

### 8.4 Menu Management (CRUD)
Field:
- Nama menu
- Harga
- Deskripsi
- Gambar
- Kategori
- Status (aktif/nonaktif)

---

### 8.5 Public Menu Page (/[slug])
Fitur:
- List menu
- Kategori
- Mobile-first UI
- Tombol "Order via WhatsApp"

### WhatsApp Auto Message
Contoh:
"Halo, saya mau pesan: [menu]"

---

## 9. Optional / Premium Features

### 9.1 Custom Branding
- Upload logo
- Banner/header image
- Pilihan warna utama

### 9.2 Theme System
- Preset theme (3+)
- Dark/light mode

### 9.3 QR Code Generator
- Generate otomatis per toko

### 9.4 Analytics
- Jumlah visitor
- Klik WhatsApp

### 9.5 Custom Domain (Future)
- tokokamu.com

---

## 10. Admin Panel Features

### 10.1 Dashboard Admin
- Total user
- User aktif
- User berbayar
- Total toko

---

### 10.2 User Management
- List semua user
- Detail user
- Aktif / nonaktifkan user
- Hapus user

---

### 10.3 Subscription Management
- Status: trial / aktif / expired
- Set manual status
- Lihat masa aktif

---

### 10.4 Store Monitoring
- List semua toko
- Lihat slug
- Lihat menu

---

### 10.5 Moderation & Control
- Suspend user
- Blokir akses

---

## 11. Database Schema (Simplified)

### Users
- id
- email
- role (user/admin)
- status (active/inactive)

### Stores
- id
- user_id
- name
- slug (unique)
- whatsapp

### Menus
- id
- store_id
- name
- price
- description

### Subscriptions
- id
- user_id
- status
- expired_at

---

## 12. Security Requirements
- Row Level Security (RLS)
- User hanya bisa akses datanya
- Admin punya akses global

---

## 13. Performance Requirements
- Load halaman < 2 detik
- Query berdasarkan slug (indexed)

---

## 14. Constraints
- Slug harus unik
- Tidak boleh duplicate store

---

## 15. Success Metrics
- 10 user pertama
- 5 user bayar
- Retention > 50%

---

## 16. Roadmap

### Phase 1 (MVP)
- Auth
- Store
- Menu
- Slug page

### Phase 2
- Theme
- Analytics

### Phase 3
- Payment gateway
- Custom domain

---

## 17. Risks
- UMKM tidak mau bayar
- Kompetitor banyak

Mitigasi:
- Fokus kemudahan
- Fokus WhatsApp integration

---

## 18. Conclusion
Produk ini feasible secara teknis, scalable, dan memiliki peluang pasar jika fokus pada kemudahan, kecepatan, dan integrasi WhatsApp sebagai nilai utama.

