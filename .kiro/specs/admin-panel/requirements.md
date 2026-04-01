# Requirements Document

## Introduction

Admin Panel MyMenu adalah dashboard khusus yang hanya dapat diakses oleh pengguna dengan `role = 'admin'` di tabel `profiles`. Panel ini memungkinkan pemilik platform untuk memantau dan mengelola seluruh ekosistem MyMenu, mencakup statistik platform, manajemen user, manajemen subscription, dan penelusuran toko. Admin Panel berjalan di route terpisah (`/admin`) dengan layout dan autentikasi tersendiri, memanfaatkan RLS policy admin yang sudah ada di Supabase.

## Glossary

- **Admin_Panel**: Aplikasi dashboard khusus yang hanya dapat diakses oleh pengguna dengan role `admin`.
- **Admin**: Pengguna dengan nilai `role = 'admin'` pada tabel `profiles` di Supabase.
- **Platform_User**: Pengguna biasa dengan nilai `role = 'user'` pada tabel `profiles`.
- **Subscription**: Record pada tabel `subscriptions` yang merepresentasikan status langganan seorang Platform_User, dengan status: `trial`, `active`, `expired`, atau `cancelled`.
- **Store**: Record pada tabel `stores` yang dimiliki oleh seorang Platform_User.
- **Overview_Stats**: Ringkasan statistik platform yang ditampilkan di halaman utama Admin_Panel.
- **Auth_Guard**: Mekanisme proteksi route yang memverifikasi role pengguna sebelum mengizinkan akses ke Admin_Panel.

---

## Requirements

### Requirement 1: Proteksi Akses Admin

**User Story:** Sebagai pemilik platform, saya ingin Admin Panel hanya bisa diakses oleh akun admin, sehingga data platform terlindungi dari akses tidak sah.

#### Acceptance Criteria

1. WHEN pengguna mengakses route `/admin` tanpa sesi autentikasi aktif, THE Auth_Guard SHALL mengarahkan pengguna ke halaman `/login`.
2. WHEN pengguna terautentikasi dengan `role = 'user'` mengakses route `/admin`, THE Auth_Guard SHALL mengarahkan pengguna ke halaman `/dashboard`.
3. WHEN pengguna terautentikasi dengan `role = 'admin'` mengakses route `/admin`, THE Auth_Guard SHALL mengizinkan akses dan menampilkan Admin_Panel.
4. THE Auth_Guard SHALL memverifikasi role pengguna dari tabel `profiles` menggunakan Supabase server client pada setiap request ke route `/admin`.

---

### Requirement 2: Overview Statistik Platform

**User Story:** Sebagai Admin, saya ingin melihat ringkasan statistik platform di satu halaman, sehingga saya dapat memantau kondisi platform secara keseluruhan.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan total jumlah Platform_User yang terdaftar di tabel `profiles` dengan `role = 'user'`.
2. THE Admin_Panel SHALL menampilkan total jumlah Store yang ada di tabel `stores`.
3. THE Admin_Panel SHALL menampilkan total jumlah Subscription dengan status `active`.
4. THE Admin_Panel SHALL menampilkan total jumlah Subscription dengan status `trial`.
5. THE Admin_Panel SHALL menampilkan estimasi revenue bulanan yang dihitung dari jumlah Subscription berstatus `active` dikalikan harga langganan yang dikonfigurasi.
6. WHEN data Overview_Stats dimuat, THE Admin_Panel SHALL menampilkan semua metrik dalam waktu kurang dari 3 detik.
7. THE Admin_Panel SHALL menampilkan jumlah Platform_User dengan status `suspended`.

---

### Requirement 3: Manajemen User

**User Story:** Sebagai Admin, saya ingin melihat dan mengelola semua Platform_User, sehingga saya dapat mengontrol akses dan status akun pengguna di platform.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan daftar semua Platform_User dari tabel `profiles` dengan kolom: email, display_name, status, role, dan tanggal registrasi.
2. WHEN Admin memilih filter status, THE Admin_Panel SHALL menampilkan hanya Platform_User dengan status yang dipilih (`active`, `inactive`, atau `suspended`).
3. WHEN Admin memilih filter role, THE Admin_Panel SHALL menampilkan hanya pengguna dengan role yang dipilih (`user` atau `admin`).
4. WHEN Admin mengklik detail seorang Platform_User, THE Admin_Panel SHALL menampilkan informasi lengkap termasuk daftar Store milik pengguna tersebut dan status Subscription aktif.
5. WHEN Admin mengklik aksi "Suspend" pada Platform_User dengan status `active` atau `inactive`, THE Admin_Panel SHALL mengubah nilai `status` pengguna tersebut menjadi `suspended` di tabel `profiles`.
6. WHEN Admin mengklik aksi "Aktifkan" pada Platform_User dengan status `suspended`, THE Admin_Panel SHALL mengubah nilai `status` pengguna tersebut menjadi `active` di tabel `profiles`.
7. IF operasi perubahan status Platform_User gagal, THEN THE Admin_Panel SHALL menampilkan pesan error yang menjelaskan kegagalan tersebut.
8. WHEN Admin melakukan pencarian berdasarkan email atau nama, THE Admin_Panel SHALL menampilkan Platform_User yang emailnya atau display_name-nya mengandung kata kunci pencarian tersebut.

---

### Requirement 4: Manajemen Subscription

**User Story:** Sebagai Admin, saya ingin mengelola subscription semua Platform_User, sehingga saya dapat mengaktifkan, memperpanjang, dan mengubah status langganan secara manual.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan daftar semua Subscription dari tabel `subscriptions` beserta informasi Platform_User pemiliknya (email, display_name).
2. WHEN Admin memilih filter status subscription, THE Admin_Panel SHALL menampilkan hanya Subscription dengan status yang dipilih (`trial`, `active`, `expired`, atau `cancelled`).
3. WHEN Admin mengklik aksi "Aktifkan Trial" pada Platform_User yang belum memiliki Subscription, THE Admin_Panel SHALL membuat record Subscription baru dengan status `trial`, `started_at` diisi tanggal hari ini, dan `expires_at` diisi 7 hari dari sekarang.
4. WHEN Admin mengubah status Subscription melalui form edit, THE Admin_Panel SHALL memperbarui nilai `status` pada record Subscription yang dipilih sesuai nilai baru yang dipilih Admin.
5. WHEN Admin mengatur tanggal expired melalui form edit, THE Admin_Panel SHALL memperbarui nilai `expires_at` pada record Subscription yang dipilih sesuai tanggal yang dimasukkan Admin.
6. WHEN Admin mengklik aksi "Perpanjang" dan memasukkan jumlah hari, THE Admin_Panel SHALL memperbarui `expires_at` dengan menambahkan jumlah hari tersebut dari nilai `expires_at` saat ini, atau dari tanggal hari ini jika `expires_at` sudah lewat.
7. IF operasi perubahan Subscription gagal, THEN THE Admin_Panel SHALL menampilkan pesan error yang menjelaskan kegagalan tersebut.
8. THE Admin_Panel SHALL menampilkan kolom `expires_at` dalam format tanggal yang dapat dibaca manusia (DD/MM/YYYY).

---

### Requirement 5: Penelusuran Toko

**User Story:** Sebagai Admin, saya ingin melihat semua toko yang ada di platform, sehingga saya dapat memantau konten dan aktivitas toko.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan daftar semua Store dari tabel `stores` dengan kolom: nama toko, slug, nama pemilik (dari `profiles`), dan tanggal dibuat.
2. WHEN Admin mengklik detail sebuah Store, THE Admin_Panel SHALL menampilkan informasi lengkap Store termasuk deskripsi, alamat, nomor WhatsApp, dan jumlah menu yang dimiliki.
3. WHEN Admin mengklik link "Lihat Menu Publik" pada detail Store, THE Admin_Panel SHALL membuka halaman publik toko (`/{slug}`) di tab baru.
4. WHEN Admin melakukan pencarian berdasarkan nama toko atau slug, THE Admin_Panel SHALL menampilkan Store yang namanya atau slug-nya mengandung kata kunci pencarian tersebut.

---

### Requirement 6: Layout dan Navigasi Admin Panel

**User Story:** Sebagai Admin, saya ingin Admin Panel memiliki layout dan navigasi yang terpisah dari dashboard user biasa, sehingga pengalaman pengelolaan platform lebih fokus dan jelas.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menggunakan route group terpisah (`/admin`) yang berbeda dari route group dashboard user (`/dashboard`).
2. THE Admin_Panel SHALL menampilkan sidebar navigasi dengan tautan ke: Overview, Users, Subscriptions, dan Stores.
3. THE Admin_Panel SHALL menampilkan identitas pengguna admin yang sedang login (email atau display_name) di area header atau sidebar.
4. WHEN Admin mengklik tombol "Keluar", THE Admin_Panel SHALL mengakhiri sesi Supabase dan mengarahkan Admin ke halaman `/login`.
