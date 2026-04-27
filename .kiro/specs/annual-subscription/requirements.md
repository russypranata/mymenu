# Requirements Document

## Introduction

Fitur ini menambahkan opsi paket langganan tahunan (annual subscription) ke platform MyMenu sebagai alternatif dari paket bulanan yang sudah ada. Paket tahunan memberikan insentif diskon setara 2 bulan gratis (~17% lebih hemat: Rp200.000/tahun vs Rp240.000 jika bayar bulanan). Karena MyMenu menggunakan sistem pembayaran manual (transfer bank/QRIS), admin tetap mengaktifkan langganan secara manual melalui admin panel. Fitur ini mencakup: penambahan kolom `plan_type` di tabel `subscriptions`, tampilan pilihan paket di halaman harga (landing page), informasi paket aktif di dashboard user, dan dukungan admin panel untuk mengaktifkan/memperpanjang paket tahunan.

## Glossary

- **Subscription**: Rekaman langganan user di tabel `subscriptions`, berisi status, tanggal mulai, dan tanggal berakhir.
- **Plan_Type**: Jenis paket langganan — `monthly` (30 hari) atau `annual` (365 hari).
- **Admin**: Pengguna dengan `role = 'admin'` yang dapat mengelola langganan melalui admin panel.
- **User / Pemilik UMKM**: Pengguna dengan `role = 'user'` yang berlangganan layanan MyMenu.
- **Trial**: Status langganan awal selama 3 hari, diberikan otomatis saat registrasi.
- **Active**: Status langganan yang sedang berjalan dan belum kedaluwarsa.
- **Expired**: Status langganan yang sudah melewati tanggal `expires_at`.
- **Landing Page**: Halaman publik (`/`) yang menampilkan informasi produk dan harga.
- **Dashboard**: Halaman `/dashboard` yang diakses user setelah login.
- **Admin Panel**: Halaman `/admin/subscriptions` yang diakses admin untuk mengelola langganan.

---

## Requirements

### Requirement 1: Penambahan Kolom Plan Type di Database

**User Story:** Sebagai admin, saya ingin setiap langganan memiliki informasi jenis paket (bulanan atau tahunan), sehingga saya dapat membedakan dan mengelola kedua jenis paket dengan benar.

#### Acceptance Criteria

1. THE `subscriptions` Table SHALL memiliki kolom `plan_type` bertipe `text` dengan nilai default `'monthly'`.
2. THE `subscriptions` Table SHALL membatasi nilai kolom `plan_type` hanya pada `'monthly'` atau `'annual'` melalui constraint CHECK.
3. WHEN kolom `plan_type` tidak disertakan saat INSERT, THE `subscriptions` Table SHALL menggunakan nilai `'monthly'` sebagai default.
4. THE Migration Script SHALL memperbarui semua baris `subscriptions` yang sudah ada dengan nilai `plan_type = 'monthly'`.
5. THE `database.types.ts` SHALL diperbarui untuk mencerminkan kolom `plan_type` pada tipe `subscriptions`.

---

### Requirement 2: Tampilan Pilihan Paket di Landing Page

**User Story:** Sebagai pemilik UMKM yang belum berlangganan, saya ingin melihat perbandingan paket bulanan dan tahunan di halaman harga, sehingga saya dapat memilih paket yang paling sesuai dengan kebutuhan dan anggaran saya.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan dua kartu harga: satu untuk paket bulanan (Rp20.000/bulan) dan satu untuk paket tahunan (Rp200.000/tahun) di seksi `#harga`.
2. THE Landing_Page SHALL menampilkan label penghematan pada kartu paket tahunan, yaitu "Hemat Rp40.000 (2 bulan gratis)".
3. THE Landing_Page SHALL menampilkan badge "Paling Hemat" pada kartu paket tahunan untuk mendorong konversi.
4. THE Landing_Page SHALL menampilkan harga ekuivalen per bulan pada kartu paket tahunan, yaitu "~Rp16.700/bulan".
5. WHEN user mengklik tombol CTA pada kartu paket tahunan, THE Landing_Page SHALL mengarahkan user ke halaman registrasi (`/register`).
6. THE Landing_Page SHALL memperbarui teks perbandingan di tabel komparasi untuk mencantumkan opsi tahunan Menuly sebagai Rp200.000/tahun.

---

### Requirement 3: Informasi Paket Aktif di Dashboard User

**User Story:** Sebagai pemilik UMKM yang sudah berlangganan, saya ingin melihat jenis paket langganan saya di dashboard, sehingga saya tahu apakah saya berlangganan bulanan atau tahunan dan kapan masa berlakunya habis.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan jenis paket aktif (`Bulanan` atau `Tahunan`) pada banner status langganan.
2. WHEN `subscription.plan_type = 'annual'`, THE Dashboard SHALL menampilkan badge atau label "Paket Tahunan" yang membedakannya secara visual dari paket bulanan.
3. WHEN `subscription.plan_type = 'monthly'`, THE Dashboard SHALL menampilkan label "Paket Bulanan" pada banner status langganan.
4. THE Dashboard SHALL tetap menampilkan jumlah hari tersisa dan tanggal berakhir, terlepas dari jenis paket.
5. THE `getSubscription` Query SHALL mengembalikan kolom `plan_type` bersama kolom `status` dan `expires_at` yang sudah ada.

---

### Requirement 4: Dukungan Admin Panel untuk Paket Tahunan

**User Story:** Sebagai admin, saya ingin dapat mengaktifkan dan memperpanjang langganan tahunan melalui admin panel, sehingga saya dapat melayani user yang memilih paket tahunan setelah konfirmasi pembayaran.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan kolom `Plan` pada tabel daftar langganan yang menunjukkan nilai `plan_type` setiap subscription.
2. WHEN admin membuka modal edit subscription, THE Admin_Panel SHALL menampilkan dropdown untuk memilih `plan_type` (`Bulanan` atau `Tahunan`).
3. WHEN admin mengaktifkan langganan dengan `plan_type = 'annual'`, THE `extendSubscription` Action SHALL menambahkan 365 hari dari tanggal dasar.
4. WHEN admin mengaktifkan langganan dengan `plan_type = 'monthly'`, THE `extendSubscription` Action SHALL menambahkan 30 hari dari tanggal dasar.
5. THE `updateSubscription` Action SHALL menerima dan menyimpan perubahan `plan_type` ke database.
6. WHEN admin mengaktifkan langganan tahunan, THE WhatsApp_Notification SHALL menyertakan informasi jenis paket ("Paket Tahunan") dalam pesan notifikasi ke user.

---

### Requirement 5: Tombol Perpanjang Cepat Paket Tahunan di Admin Panel

**User Story:** Sebagai admin, saya ingin dapat memperpanjang langganan tahunan dengan satu klik (tanpa harus mengetik 365 hari secara manual), sehingga proses aktivasi lebih cepat dan tidak rentan kesalahan input.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menampilkan tombol shortcut "Perpanjang 30 Hari" dan "Perpanjang 365 Hari" di bagian perpanjangan pada modal edit subscription.
2. WHEN admin mengklik "Perpanjang 365 Hari", THE `extendSubscription` Action SHALL dipanggil dengan nilai `days = 365`.
3. WHEN admin mengklik "Perpanjang 30 Hari", THE `extendSubscription` Action SHALL dipanggil dengan nilai `days = 30`.
4. THE Admin_Panel SHALL tetap mempertahankan input manual jumlah hari sebagai opsi fleksibel.

---

### Requirement 6: Konsistensi Data Plan Type pada Trial

**User Story:** Sebagai sistem, saya ingin setiap langganan trial baru memiliki `plan_type` yang terdefinisi, sehingga tidak ada data langganan yang memiliki nilai `plan_type` kosong atau tidak valid.

#### Acceptance Criteria

1. WHEN user baru mendaftar dan langganan trial dibuat otomatis, THE `handle_new_user` Function SHALL menyertakan `plan_type = 'monthly'` pada INSERT ke tabel `subscriptions`.
2. WHEN admin membuat langganan trial manual melalui `createTrialSubscription` Action, THE Action SHALL menyertakan `plan_type = 'monthly'` sebagai default.
3. IF `plan_type` tidak disertakan pada INSERT, THEN THE Database Constraint SHALL memastikan nilai default `'monthly'` digunakan secara otomatis.
