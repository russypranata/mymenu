# Requirements Document

## Introduction

Fitur **Owner Profile** memungkinkan pemilik toko (owner/UMKM) pada aplikasi MyMenu SaaS untuk mengelola data akun mereka sendiri. Fitur ini mencakup pembaruan nama tampilan, upload/ganti foto profil (avatar), ganti email, ganti password, dan penghapusan akun secara opsional. Semua operasi mutasi diimplementasikan menggunakan Next.js Server Actions dan Supabase Auth/Storage.

Tabel `profiles` saat ini memiliki kolom: `id`, `email`, `role`, `status`, `created_at`. Fitur ini memerlukan penambahan kolom `display_name` dan `avatar_url` pada tabel tersebut.

---

## Glossary

- **Owner**: Pengguna terdaftar dengan role `user` atau `admin` yang memiliki akun di MyMenu dan mengelola satu atau lebih toko.
- **Profile**: Data akun Owner yang tersimpan di tabel `profiles` dan terhubung ke `auth.users` Supabase.
- **Profile_Page**: Halaman dashboard di `/profile` tempat Owner mengelola data akun.
- **Profile_Action**: Server Action Next.js yang menangani mutasi data profil.
- **Avatar**: Foto profil Owner berupa file gambar yang disimpan di Supabase Storage.
- **Avatar_Storage**: Bucket Supabase Storage bernama `avatars` yang menyimpan file Avatar.
- **Display_Name**: Nama tampilan Owner yang ditampilkan di sidebar dan header dashboard.
- **Auth_Service**: Supabase Auth yang mengelola autentikasi, email, dan password Owner.
- **Supabase_Client**: Instance Supabase server-side yang digunakan dalam Server Actions.

---

## Requirements

### Requirement 1: Tampilkan Data Profil

**User Story:** Sebagai Owner, saya ingin melihat data profil saya saat ini, agar saya tahu informasi apa yang tersimpan di akun saya.

#### Acceptance Criteria

1. WHEN Owner membuka halaman `/profile`, THE Profile_Page SHALL menampilkan Display_Name saat ini, email saat ini, dan Avatar saat ini milik Owner.
2. IF Owner belum memiliki Display_Name, THEN THE Profile_Page SHALL menampilkan bagian username dari email Owner sebagai nilai default.
3. IF Owner belum memiliki Avatar, THEN THE Profile_Page SHALL menampilkan inisial huruf pertama Display_Name sebagai placeholder Avatar.

---

### Requirement 2: Edit Nama Tampilan (Display Name)

**User Story:** Sebagai Owner, saya ingin mengubah nama tampilan saya, agar nama yang muncul di dashboard sesuai dengan identitas bisnis saya.

#### Acceptance Criteria

1. WHEN Owner mengisi form Display_Name dengan nilai baru dan mengirimkan form, THE Profile_Action SHALL memperbarui kolom `display_name` pada tabel `profiles` untuk Owner yang sedang login.
2. THE Profile_Action SHALL memvalidasi bahwa Display_Name tidak kosong dan memiliki panjang antara 2 hingga 50 karakter.
3. IF Display_Name yang dikirimkan kurang dari 2 karakter atau lebih dari 50 karakter, THEN THE Profile_Action SHALL mengembalikan pesan error yang menjelaskan batasan panjang karakter.
4. WHEN pembaruan Display_Name berhasil, THE Profile_Action SHALL melakukan revalidasi path `/profile` dan `/dashboard` sehingga sidebar dan header menampilkan nama terbaru.

---

### Requirement 3: Upload dan Ganti Foto Profil (Avatar)

**User Story:** Sebagai Owner, saya ingin mengupload atau mengganti foto profil saya, agar tampilan akun saya lebih personal dan mudah dikenali.

#### Acceptance Criteria

1. WHEN Owner memilih file gambar dan mengirimkan form Avatar, THE Profile_Action SHALL mengupload file ke Avatar_Storage pada path `{user_id}/avatar.{ext}`.
2. THE Profile_Action SHALL memvalidasi bahwa file yang diupload bertipe MIME `image/jpeg`, `image/png`, atau `image/webp`.
3. THE Profile_Action SHALL memvalidasi bahwa ukuran file Avatar tidak melebihi 2 MB.
4. IF file yang diupload bukan tipe gambar yang diizinkan atau melebihi 2 MB, THEN THE Profile_Action SHALL mengembalikan pesan error yang menjelaskan batasan tipe dan ukuran file.
5. WHEN upload Avatar berhasil, THE Profile_Action SHALL memperbarui kolom `avatar_url` pada tabel `profiles` dengan URL publik Avatar yang baru.
6. WHEN Avatar baru berhasil disimpan, THE Profile_Action SHALL menghapus file Avatar lama dari Avatar_Storage jika file lama ada.
7. WHEN pembaruan Avatar berhasil, THE Profile_Action SHALL melakukan revalidasi path `/profile` dan `/dashboard` sehingga tampilan Avatar terbaru langsung terlihat.

---

### Requirement 4: Ganti Email

**User Story:** Sebagai Owner, saya ingin mengganti alamat email akun saya, agar akun saya menggunakan email yang aktif dan valid.

#### Acceptance Criteria

1. WHEN Owner mengisi form ganti email dengan alamat email baru yang valid dan mengirimkan form, THE Profile_Action SHALL memanggil `Auth_Service` untuk memperbarui email Owner.
2. THE Profile_Action SHALL memvalidasi bahwa email baru memiliki format yang valid sebelum memanggil Auth_Service.
3. IF email baru yang dikirimkan memiliki format tidak valid, THEN THE Profile_Action SHALL mengembalikan pesan error tanpa memanggil Auth_Service.
4. WHEN Auth_Service berhasil memproses permintaan ganti email, THE Auth_Service SHALL mengirimkan email konfirmasi ke alamat email baru Owner.
5. WHEN Owner mengkonfirmasi email baru melalui tautan konfirmasi, THE Auth_Service SHALL memperbarui email pada `auth.users` dan THE Profile_Action SHALL memperbarui kolom `email` pada tabel `profiles`.
6. IF Auth_Service mengembalikan error saat proses ganti email, THEN THE Profile_Action SHALL mengembalikan pesan error yang informatif kepada Owner.

---

### Requirement 5: Ganti Password

**User Story:** Sebagai Owner, saya ingin mengganti password akun saya, agar keamanan akun saya tetap terjaga.

#### Acceptance Criteria

1. WHEN Owner mengisi form ganti password dengan password baru dan konfirmasi password, lalu mengirimkan form, THE Profile_Action SHALL memvalidasi bahwa password baru dan konfirmasi password identik.
2. THE Profile_Action SHALL memvalidasi bahwa password baru memiliki panjang minimal 8 karakter.
3. IF password baru dan konfirmasi password tidak identik, THEN THE Profile_Action SHALL mengembalikan pesan error yang menyatakan kedua nilai harus sama.
4. IF password baru memiliki panjang kurang dari 8 karakter, THEN THE Profile_Action SHALL mengembalikan pesan error yang menyatakan batasan panjang minimal.
5. WHEN validasi password berhasil, THE Profile_Action SHALL memanggil Auth_Service untuk memperbarui password Owner.
6. IF Auth_Service mengembalikan error saat proses ganti password, THEN THE Profile_Action SHALL mengembalikan pesan error yang informatif kepada Owner.
7. WHEN ganti password berhasil, THE Profile_Action SHALL mengembalikan status sukses tanpa melakukan logout otomatis pada sesi Owner yang sedang aktif.

---

### Requirement 6: Hapus Akun (Opsional)

**User Story:** Sebagai Owner, saya ingin menghapus akun saya secara permanen, agar data saya dihapus dari sistem jika saya tidak lagi menggunakan layanan.

#### Acceptance Criteria

1. WHERE fitur hapus akun diaktifkan, THE Profile_Page SHALL menampilkan tombol "Hapus Akun" di bagian danger zone halaman profil.
2. WHEN Owner mengklik tombol "Hapus Akun", THE Profile_Page SHALL menampilkan dialog konfirmasi yang meminta Owner mengetikkan email mereka untuk mengkonfirmasi penghapusan.
3. WHEN Owner mengkonfirmasi penghapusan dengan mengetikkan email yang benar, THE Profile_Action SHALL menghapus data Owner dari tabel `profiles`.
4. WHEN data profil berhasil dihapus, THE Profile_Action SHALL memanggil Auth_Service untuk menghapus akun Owner dari `auth.users`.
5. IF email yang diketikkan Owner pada dialog konfirmasi tidak sesuai dengan email akun Owner, THEN THE Profile_Page SHALL menampilkan pesan error dan tidak melanjutkan proses penghapusan.
6. WHEN penghapusan akun berhasil, THE Profile_Action SHALL melakukan logout Owner dan mengarahkan Owner ke halaman `/login`.
