# Plan Redesain UI/UX SIPEPES

Dokumen ini adalah instruksi kerja untuk mendesain ulang antarmuka SIPEPES (Sistem Informasi Pelaporan Pencemaran Sungai). Ditulis agar bisa dieksekusi tanpa konteks percakapan sebelumnya.

**SIPEPES adalah website responsif, bukan aplikasi mobile.** Satu situs yang dibuka lewat browser di laptop maupun HP. Jangan meniru pola aplikasi native: tanpa tab bar bawah, tanpa status bar palsu, tanpa layar splash, tanpa gestur geser khusus. Setiap halaman punya URL, header situs, dan footer.

- Repo: `GhalibAG/SIPEPES` (monorepo: `client/` Vite + React 18 + Tailwind, `server/` Express + Supabase)
- Situs: https://sipepes.vercel.app/ (saat ini hanya `client/` yang ter-deploy)
- Tim: Tim 3 MuSilaban, mata kuliah Proyek Sistem Informasi, Fasilkom Unsri
- Mitra pengguna: Green Generation Palembang (program GG River Care)

---

## 1. Tujuan dan batas pekerjaan

**Tujuan:** website yang lebih sederhana, konsisten, nyaman dibuka di laptop maupun browser HP, dan sesuai Project Scope Statement serta hasil wawancara pengguna.

**Termasuk dalam plan ini:**
- Desain ulang semua layar warga dan admin di `client/`.
- Merapikan struktur kode frontend (routing, komponen bersama, lapisan data).
- Menyiapkan lapisan data agar mudah disambungkan ke API `server/`.

**Tidak termasuk (kerjakan terpisah, jangan dicampur):**
- Deploy backend dan pengisian database.
- Perubahan skema database, kecuali yang ditandai di Bagian 13.

**Sumber kebenaran, urut prioritas:**
1. Project Scope Statement (FR-1 s.d. FR-8, NFR-1 s.d. NFR-5, batasan, pengecualian), ringkasannya di Bagian 2.
2. Hasil wawancara dengan perwakilan GGP, ringkasannya di Bagian 3.
3. Bagian 9 dokumen ini untuk warna, tipografi, bentuk, dan gerak. Bagian itu menggantikan palet dan font di `docs/DESIGN_SYSTEM.md`.
   Tampilannya diwujudkan di `sipepes-design-reference.html` (lihat Bagian 1a).
4. `docs/API_CONTRACT.md` untuk bentuk data.

Jika kode saat ini bertentangan dengan butir 1 atau 2, yang diikuti adalah dokumen, bukan kode.

**Arah visual dari PM (wajib):** palet warna yang fun, nuansa smooth, dan font Montserrat.

---

## 1a. Referensi visual (HTML)

File `sipepes-design-reference.html` adalah wujud visual plan ini. Salin ke repo di `docs/design/sipepes-design-reference.html` pada Tahap 0, lalu buka langsung di browser (tidak perlu build).

Isinya:
- **Token:** palet, tingkat dugaan, status, skala tipografi, bentuk, bayangan.
- **Komponen:** semua varian tombol, chip, input (normal, fokus, salah), stepper, toast, timeline, StatCard, ReportCard, skeleton, empty state.
- **Gerak:** demo yang bisa diputar ulang untuk setiap baris tabel Bagian 9.4, plus sakelar simulasi reduced motion. Nilai keyframe dan kurva di file ini boleh disalin langsung.
- **Pratinjau responsif:** pilih halaman lalu ganti lebar jendela (375, 768, 1024, 1280 px) untuk melihat tata letak menyesuaikan.
- **Halaman:** setiap halaman dirender dari markup yang sama di jendela laptop 1024 px dan browser HP 375 px. Perilaku responsifnya memakai container query, jadi CSS di file ini bisa dijadikan acuan langsung untuk breakpoint Tailwind (`md` = 768, `lg` = 1024).

| Kode | Halaman | Rute | Tampil di |
|---|---|---|---|
| W1 | Beranda dan peta | `/` | laptop + HP |
| W2 | Lapor 1: Foto (kosong) | `/lapor` | laptop + HP |
| W3 | Lapor 2: Lokasi | `/lapor` | laptop + HP |
| W4 | Lapor 3: Detail dan kondisi lokasi | `/lapor` | laptop + HP |
| W5 | Lapor 4: Tinjau | `/lapor` | laptop + HP |
| W6 | Laporan terkirim | `/lapor/berhasil/:kode` | laptop + HP |
| W7 | Lacak: masukkan kode | `/lacak` | laptop + HP |
| W8 | Status menunggu | `/lacak/:kode` | laptop + HP |
| W9, W10 | Status valid, ditolak | `/lacak/:kode` | HP |
| W11 | Kode tidak ditemukan | `/lacak/:kode` | HP |
| W12 | Menu hamburger terbuka | semua halaman warga | HP |
| W13 | Panduan | `/panduan` | laptop + HP |
| A1 | Masuk admin | `/admin/login` | laptop + HP |
| A2 | Antrean verifikasi | `/admin` | laptop + HP |
| A3 | Detail dan verifikasi | `/admin/laporan/:id` | laptop + HP (dua kolom di 1280) |
| A4 | Dialog tolak | `/admin/laporan/:id` | laptop + HP |
| A5 | Peta sebaran | `/admin/peta` | laptop + HP |
| A6 | Rekap dan ekspor | `/admin/rekap` | laptop + HP |
| A7 | Riwayat verifikasi | `/admin/riwayat` | laptop + HP |
| A8 | Data master | `/admin/data-master` | laptop + HP |
| A9 | Laci menu admin | semua halaman admin | HP / tablet |

**Aturan memakai referensi:**
- Ikuti referensi untuk tata letak, hierarki, warna, dan teks di layar. Teks UI di referensi adalah teks final kecuali jelas data contoh.
- Bila referensi dan plan berbeda soal aturan atau angka (validasi, durasi, kontras), plan yang berlaku.
- Peta di referensi adalah ilustrasi SVG. Implementasi tetap Leaflet + OpenStreetMap dengan marker pin tetesan sesuai Bagian 9.5.
- Foto adalah placeholder gradasi. Data, nama, dan kode tiket fiktif.
- Jangan menyalin HTML referensi apa adanya ke aplikasi. Bangun ulang dengan komponen React dan kelas Tailwind dari token Bagian 9.

---

## 2. Ringkasan kebutuhan dari Scope Statement

**Aktor hanya dua:**
- Warga/Volunteer: melapor tanpa akun, unggah foto, lacak status, lihat peta.
- Admin Komunitas (GG River Care): login, verifikasi laporan, ekspor rekap.

| Kode | Kebutuhan |
|---|---|
| FR-1 | Login admin dengan email dan kata sandi. |
| FR-2 | Warga mengisi judul, deskripsi, jenis limbah, tingkat dugaan (Ringan, Sedang, Berat), dan koordinat (geolocation atau pin peta), tanpa registrasi. |
| FR-3 | Unggah foto JPG, PNG, atau WebP, dikompresi di sisi client, maksimal 2 MB. |
| FR-4 | Kode tiket unik (contoh `SPP-202611-0012`) untuk memeriksa status. |
| FR-5 | Admin meninjau detail dan foto, menetapkan Valid atau Ditolak (alasan wajib), perubahan tercatat di riwayat. |
| FR-6 | Hanya laporan valid tampil di peta, marker berwarna sesuai tingkat, popup berisi foto dan tanggal. |
| FR-7 | Filter berdasarkan rentang tanggal, tingkat dugaan, dan kecamatan. |
| FR-8 | Ekspor laporan valid ke PDF (laporan eksekutif) dan Excel/CSV (data mentah). |

- NFR-4: form dan peta nyaman di layar selebar 360 px.
- NFR-5: setiap perubahan status tercatat (admin, status sebelum dan sesudah, catatan, waktu).
- Kriteria penerimaan: laporan yang diverifikasi muncul di peta tanpa memuat ulang halaman.

**Batasan yang memengaruhi desain:**
- Tindak lanjut dan penanganan di lapangan berada di luar sistem.
- Tidak ada peran, akun, atau integrasi instansi pemerintah. Sistem berdiri sendiri.
- Tingkat pencemaran adalah dugaan visual, bukan hasil laboratorium atau sensor.
- Wilayah percontohan: Kota Palembang, khususnya Sungai Musi. Data adalah data uji.
- Di luar lingkup: sensor/IoT, prediksi AI, chat atau forum, pembayaran atau donasi, aplikasi mobile native.

---

## 3. Ringkasan wawancara pengguna (GGP)

| Temuan | Dampak ke desain |
|---|---|
| Titik tercemar selama ini ditemukan lewat survei, Google Maps, dan saran anggota. | Peta dan lokasi adalah inti aplikasi. |
| Informasi yang paling dibutuhkan untuk bertindak: luas area, kondisi sungai terhadap rumah sekitar, kedalaman air. | Tambahkan isian "Kondisi lokasi" di form dan tampilkan di detail admin. |
| Pelapor adalah masyarakat (diwakili anggota GGP). Pemeriksa adalah Divisi Pengelola Kerusakan Lingkungan (PKL). | Sebutan admin di UI: "Admin GG River Care" atau "Divisi PKL". |
| Titik dipilih berdasarkan lokasi strategis untuk titik kumpul dan sungai yang paling jarang dirawat. | Rekap admin perlu daftar titik yang bisa diurutkan. |
| Data titik paling mudah dipakai lewat Google Maps atau foto patokan. | Tombol "Buka di Google Maps" di setiap laporan. Foto ditampilkan besar. |
| Pelapor umumnya memakai HP, terbiasa dengan WhatsApp dan Instagram. | Mobile-first. Tombol bagikan kode tiket ke WhatsApp. |

---

## 4. Masalah UI/UX saat ini yang harus dibereskan

**Melanggar ruang lingkup (hapus seluruhnya):**
- Semua penyebutan DLH atau dinas: "Diserahkan ke DLH", "Dalam Antrean Pembersihan", tombol WhatsApp DLH, "Eskalasi ke TRC DLH via Webhook", "Admin DLH", "Terakreditasi DLH", unit kerja "DLH × GG River Care".
- Data berkesan sensor atau lab: skor IKA, kecepatan arus, pasang surut, buffer GIS, metadata EXIF kamera, "Audit Kriptografis SHA-256".
- Fitur di luar FR: tombol dukung (upvote), menu Pengaturan Sistem, kolom "Nama akun/unit kerja" di login.
- Angka dashboard yang ditulis tetap (128 laporan, 104 valid, dan seterusnya). Semua angka harus dihitung dari data.

**Masalah kegunaan:**
- Halaman Lacak sudah terisi kode contoh dan menampilkan laporan pertama bila kode tidak ditemukan.
- Form laporan satu halaman panjang, tanpa judul, tanpa pin peta, dan GPS gagal diam-diam diganti koordinat acak.
- Peta menampilkan laporan yang belum diverifikasi dan yang ditolak.
- Alasan penolakan tidak diminta dari admin dan tidak ditampilkan ke warga.
- Tombol ekspor hanya menampilkan pesan sukses.
- Label tingkat tidak konsisten ("Parah / Kritis" di form, "Berat" di dokumen).
- Tombol "Admin" mencolok di navigasi warga.
- Teks terlalu kecil (banyak `text-[10px]` dan `text-[11px]`), warna ditulis langsung di komponen (banyak `#0088cc` dan `slate-900`), dan tampilan terasa kaku seperti dashboard instansi.
- Navigasi memakai state, bukan URL, sehingga halaman tidak bisa dibagikan atau di-refresh. `react-router-dom` sudah terpasang tetapi tidak dipakai.

---

## 5. Prinsip desain

1. **Satu tugas per layar.** Warga datang untuk melapor atau mengecek. Admin datang untuk memverifikasi atau merekap.
2. **Website responsif, CSS mobile-first.** Tulis gaya dasar untuk 360 px lalu tambahkan `md:` dan `lg:` untuk layar lebih lebar. Hasilnya tetap halaman web biasa di semua ukuran, bukan aplikasi.
3. **Jujur soal data.** Tidak ada angka, status, atau label yang tidak berasal dari data nyata.
4. **Bahasa warga.** Kalimat pendek, tanpa istilah teknis seperti GIS, sempadan, EPSG, atau FR-5.
5. **Fun tapi tetap jelas.** Warna cerah dan bentuk membulat membuat melapor terasa ringan, bukan seperti mengisi formulir kantor. Warna tingkat pencemaran tetap punya arti tetap dan tidak dipakai sebagai hiasan.
6. **Smooth.** Setiap perpindahan dan perubahan state bergerak halus dan singkat. Tidak ada elemen yang muncul atau hilang mendadak.
7. **Selalu ada jalan keluar.** Setiap state kosong, gagal, atau memuat punya pesan dan tombol tindak lanjut.

---

## 6. Peta halaman (rute)

Gunakan `react-router-dom`. `vercel.json` sudah me-rewrite semua rute ke `index.html`.

**Warga (publik):**

| Rute | Halaman | Isi singkat |
|---|---|---|
| `/` | Beranda dan Peta | Peta sebaran laporan valid, filter, daftar laporan terbaru |
| `/lapor` | Buat Laporan | Form 4 langkah |
| `/lapor/berhasil/:kode` | Laporan Terkirim | Kode tiket, salin, bagikan |
| `/lacak` | Lacak Laporan | Input kode tiket |
| `/lacak/:kode` | Status Laporan | Status, linimasa, alasan bila ditolak |
| `/panduan` | Panduan | Cara melapor, tips foto, arti tingkat dugaan |

**Admin (wajib login):**

| Rute | Halaman | Isi singkat |
|---|---|---|
| `/admin/login` | Masuk | Email dan kata sandi |
| `/admin` | Antrean Verifikasi | Daftar laporan dengan tab status, halaman utama admin |
| `/admin/laporan/:id` | Detail dan Verifikasi | Foto, lokasi, isian, tombol Valid dan Tolak, riwayat |
| `/admin/peta` | Peta Sebaran | Peta laporan valid dengan filter |
| `/admin/rekap` | Rekap dan Ekspor | Ringkasan angka, filter, unduh PDF dan Excel |
| `/admin/riwayat` | Riwayat Verifikasi | Log perubahan status |
| `/admin/data-master` | Data Master | Kecamatan dan jenis limbah |

Menu admin cukup lima: Antrean, Peta, Rekap, Riwayat, Data Master. Hapus Ringkasan Eksekutif, Titik Sempadan, dan Pengaturan Sistem sebagai menu tersendiri. Ringkasan angka pindah ke bagian atas Antrean dan Rekap.

---

## 7. Storyboard alur utama

### Alur A: warga melapor (target selesai di bawah 2 menit)

1. **Beranda.** Warga membuka situs dari tautan Instagram GGP. Terlihat peta Sungai Musi dan tombol besar "Laporkan Pencemaran".
2. **Langkah 1, Foto.** Dua pilihan: "Ambil Foto" dan "Pilih dari Galeri". Setelah dipilih, foto tampil sebagai pratinjau dengan keterangan ukuran setelah dikompresi.
3. **Langkah 2, Lokasi.** Peta mini dengan pin di tengah. Tombol "Gunakan Lokasi Saya". Pin bisa digeser. Bila izin lokasi ditolak, muncul pesan dan warga diminta menggeser pin secara manual. Kecamatan terisi otomatis dari pilihan dropdown.
4. **Langkah 3, Detail.** Judul singkat, jenis limbah, tingkat dugaan, deskripsi, lalu bagian "Kondisi lokasi" (opsional).
5. **Langkah 4, Tinjau.** Ringkasan semua isian dengan tautan "Ubah" per bagian. Tombol "Kirim Laporan".
6. **Terkirim.** Kode tiket besar, tombol "Salin Kode", "Bagikan ke WhatsApp", dan "Lacak Laporan Ini". Pesan: "Simpan kode ini untuk mengecek status laporan."

### Alur B: warga melacak

1. **Lacak.** Kolom input kosong dengan contoh format sebagai placeholder.
2. **Status.** Lencana status besar, linimasa dua tahap (Laporan diterima, Diperiksa admin), ringkasan laporan, dan foto.
3. **Bila ditolak.** Kotak "Alasan penolakan" berisi teks dari admin dan tombol "Buat Laporan Baru".
4. **Bila kode salah.** Pesan "Kode tidak ditemukan. Periksa kembali kode tiketmu." Tidak menampilkan laporan lain.

### Alur C: admin memverifikasi

1. **Masuk.** Email dan kata sandi.
2. **Antrean.** Tab Menunggu (dengan jumlah), Valid, Ditolak. Kartu laporan berisi foto kecil, judul, kecamatan, tingkat dugaan dari warga, dan waktu.
3. **Detail.** Kiri: foto besar yang bisa diperbesar. Kanan: isian warga, kondisi lokasi, peta mini, tombol "Buka di Google Maps".
4. **Keputusan.** Admin memilih tingkat dugaan final, lalu "Tandai Valid" atau "Tolak". Tolak membuka kolom alasan yang wajib diisi.
5. **Selesai.** Notifikasi singkat, laporan pindah tab, dan sistem membuka laporan berikutnya di antrean. Riwayat perubahan terlihat di bagian bawah detail.

### Alur D: admin merekap untuk advokasi

1. **Rekap.** Empat angka: total masuk, menunggu, valid, ditolak. Semua dihitung dari data.
2. **Filter.** Rentang tanggal, tingkat, kecamatan. Tabel di bawahnya ikut berubah.
3. **Unduh.** Tombol "Unduh PDF" dan "Unduh Excel". Keterangan kecil: "Berisi laporan valid sesuai filter."

---

## 8. Spesifikasi tiap layar

### 8.1 Kerangka warga (`WargaLayout`)

- **Header situs (`SiteHeader`)**, menempel di atas saat digulir (`sticky`), latar krem semi transparan.
  - **≥ 768 px:** logo + nama, logo Green Generation (40 px, dipisah garis tipis; di ≥ 1024 px disertai teks "bersama Green Generation"), tautan Beranda, Lacak, Panduan (tautan aktif berbentuk pil Biru Musi), tombol "Laporkan Pencemaran" di kanan.
  - **< 768 px:** logo, tombol kecil "Lapor", dan tombol menu hamburger. Menu membuka panel yang turun dari bawah header (W12) berisi Beranda, Laporkan pencemaran, Lacak laporan, Panduan, dan "Masuk admin". Tutup dengan ×, Esc, atau ketuk latar.
  - Di halaman `/lapor`, header tidak menampilkan tombol lapor (sudah di dalam alurnya).
- **Footer situs (`SiteFooter`)** di semua halaman warga: logo SIPEPES, blok "Dikelola bersama Green Generation Palembang · Program GG River Care" dengan logo Green Generation 64 px, catatan bahwa tingkat adalah dugaan visual dan data demo adalah data uji, tautan Beranda, Lapor, Lacak, Panduan, Masuk admin.
- Konten maksimal 1120 px di tengah, padding samping 32 px (desktop) dan 16 px (HP).

### 8.2 Beranda dan Peta (`/`)

- **Hero:** pita berwarna (gradasi Biru Musi ke Toska), pil kecil berisi logo Green Generation 30 px dan teks "Program GG River Care · Green Generation Palembang", judul "Sungai kotor? Laporkan saja.", dua tombol: "Laporkan Pencemaran" dan "Lacak laporan". Di ≥ 768 px, sisi kanan hero menampilkan tiga langkah melapor.
- **≥ 1024 px:** bagian peta dua kolom. Kiri kartu filter dan daftar laporan (360 px), kanan peta setinggi minimal 620 px dengan popup di marker terpilih.
- **768–1023 px:** satu kolom: filter, peta (400 px), daftar.
- **< 768 px:** chip filter yang bisa digulir mendatar (chip pertama "Filter" membuka panel filter lengkap), peta 300 px, lalu daftar. Popup peta diganti sorotan kartu di daftar.
- **Filter (FR-7):** rentang tanggal, tingkat (chip Ringan, Sedang, Berat), kecamatan (dropdown). Tombol "Hapus filter".
- **Marker (FR-6):** warna sesuai tingkat. Hanya laporan berstatus valid.
- **Popup:** foto kecil, judul, lencana tingkat, kecamatan, tanggal, tautan "Buka di Google Maps".
- **Legenda** tiga warna di sudut peta.
- **Kosong:** "Belum ada laporan valid untuk filter ini."
- Laporan baru yang divalidasi muncul tanpa reload (lihat Bagian 12).

### 8.3 Buat Laporan (`/lapor`)

Indikator langkah di atas (1 dari 4). Tombol "Kembali" dan "Lanjut" ada di bawah kartu; di < 768 px bilah tombol itu menempel di bawah layar (`position: sticky`). Di ≥ 1024 px ada kolom samping 320 px berisi tips foto dan "Setelah dikirim". Langkah 1 di desktop berupa area seret-dan-lepas foto; di HP berupa tombol "Ambil foto" (kamera) dan "Pilih dari galeri". Isian tersimpan sementara bila halaman tertutup.

| Langkah | Isian | Aturan |
|---|---|---|
| 1. Foto | Satu foto bukti | Wajib. JPG, PNG, WebP. Dikompresi di browser hingga di bawah 2 MB (canvas, sisi terpanjang 1600 px, kualitas diturunkan bertahap). Tolak tipe lain dengan pesan jelas. |
| 2. Lokasi | Koordinat, kecamatan, patokan | Koordinat wajib dari geolocation atau pin yang digeser. Kecamatan wajib (dropdown). Patokan opsional, contoh "dekat Dermaga 7 Ulu". Tidak boleh ada koordinat acak. |
| 3. Detail | Judul, jenis limbah, tingkat dugaan, deskripsi | Judul wajib, maksimal 80 karakter. Jenis limbah wajib. Tingkat wajib dengan label Ringan, Sedang, Berat. Deskripsi wajib, maksimal 500 karakter dengan penghitung. |
| 3. Kondisi lokasi (opsional) | Perkiraan luas, dekat permukiman, kedalaman air | Pilihan cepat. Luas: kurang dari 10 m², 10 sampai 50 m², lebih dari 50 m². Permukiman: ya atau tidak. Kedalaman: dangkal, sedang, dalam, tidak tahu. |
| 4. Tinjau | Ringkasan | Tautan "Ubah" per bagian. Tombol "Kirim Laporan". |

- Tidak ada isian nama atau nomor kontak pelapor. FR-2 tidak memintanya dan warga melapor tanpa akun.
- Validasi muncul di bawah isian yang salah, bukan `alert()`.
- Saat mengirim: tombol nonaktif dan menampilkan "Mengirim...". Bila gagal: pesan dan tombol "Coba Lagi" tanpa kehilangan isian.

### 8.4 Laporan Terkirim (`/lapor/berhasil/:kode`)

- Ikon centang, judul "Laporan terkirim".
- Kode tiket berukuran besar di kartu `ceria-100` (Montserrat, `tabular-nums`).
- Tombol: Salin Kode, Bagikan ke WhatsApp (`https://wa.me/?text=...` berisi kode dan tautan lacak), Lacak Laporan Ini.
- Keterangan: "Laporan akan diperiksa oleh admin GG River Care."

### 8.5 Lacak (`/lacak` dan `/lacak/:kode`)

- Input kosong, placeholder `SPP-202611-0012`, tombol "Cek Status".
- Hasil: lencana status (Menunggu Verifikasi, Valid, Ditolak), linimasa dua tahap dengan waktu, ringkasan laporan, foto.
- Valid: keterangan "Laporanmu sudah tampil di peta" dan tombol "Lihat di Peta".
- Ditolak: kotak alasan penolakan.
- Tidak ada tahap "diserahkan" atau "dibersihkan". Tindak lanjut lapangan di luar sistem.

### 8.6 Panduan (`/panduan`)

Tiga bagian pendek: cara melapor (4 langkah bergambar ikon), tips foto, arti tingkat dugaan. Tambahkan satu kalimat bahwa tingkat adalah dugaan visual, bukan hasil uji laboratorium.

### 8.7 Masuk Admin (`/admin/login`)

- Hanya dua isian: Email dan Kata Sandi (dengan tombol lihat/sembunyikan).
- Pesan salah: "Email atau kata sandi salah."
- Hapus isian NIP, nama unit kerja, dan "Remember me".
- Panel ungu (≥ 1024 px) memuat kartu putih "Dikelola bersama Green Generation Palembang" dengan logo 64 px. Di HP logo 40 px di samping logo SIPEPES.

### 8.8 Kerangka admin (`AdminLayout`)

- **Desktop:** sidebar kiri lima menu, bilah atas berisi nama admin dan tombol Keluar.
- Sidebar memuat logo Green Generation 36 px dengan teks "Bersama Green Generation Palembang" tepat di atas kartu pengguna.
- **< 1024 px:** sidebar disembunyikan; bilah atas berisi tombol menu, judul halaman, dan avatar. Tombol menu membuka laci dari kiri (A9) berisi menu yang sama.
- Identitas: "Admin GG River Care". Tidak ada penyebutan instansi lain.

### 8.9 Antrean Verifikasi (`/admin`)

- Baris ringkasan: empat kartu angka (Masuk, Menunggu, Valid, Ditolak) dari data.
- Tab: Menunggu, Valid, Ditolak, Semua. Jumlah tampil di tab.
- Filter: kode tiket, rentang tanggal, tingkat, kecamatan. Semua filter harus benar-benar menyaring.
- Daftar: tabel di desktop, kartu di HP. Kolom: foto, kode, judul, kecamatan, tingkat, waktu, status.
- Urutan bawaan tab Menunggu: paling lama di atas.
- Kosong: "Tidak ada laporan yang menunggu. Semua sudah diperiksa."

### 8.10 Detail dan Verifikasi (`/admin/laporan/:id`)

- **Kiri:** foto besar, bisa diklik untuk tampilan penuh.
- **Kanan atas:** kode, status, waktu lapor, judul, jenis limbah, tingkat dugaan warga, deskripsi.
- **Kondisi lokasi:** luas, dekat permukiman, kedalaman (tampilkan "Tidak diisi" bila kosong).
- **Lokasi:** peta mini dengan pin, koordinat, kecamatan, patokan, tombol "Buka di Google Maps" (`https://www.google.com/maps?q=lat,lng`).
- **Tata letak:** dua kolom bila area konten ≥ 760 px. Lebih sempit jadi satu kolom dengan urutan foto, isian warga, keputusan, kondisi lokasi, lokasi, riwayat.
- **Panel keputusan:**
  - Pilihan tingkat dugaan final (bawaan mengikuti pilihan warga).
  - Catatan admin (opsional).
  - Tombol "Tandai Valid" dan "Tolak".
  - "Tolak" membuka dialog dengan kolom alasan wajib, minimal 10 karakter.
- **Riwayat verifikasi:** daftar perubahan (admin, dari status, ke status, catatan, waktu).
- Hapus tombol Eskalasi, panel EXIF, panel GIS, dan panduan berbentuk `alert()`.

### 8.11 Peta Sebaran (`/admin/peta`)

Sama dengan peta warga, hanya laporan valid, dengan filter yang sama. Klik marker membuka ringkasan dan tautan ke detail laporan. Hapus lingkaran buffer dan label "Realtime" yang hanya hiasan.

### 8.12 Rekap dan Ekspor (`/admin/rekap`)

- Ringkasan: jumlah per status, per tingkat, dan per kecamatan. Satu diagram batang sederhana per kecamatan sudah cukup.
- Daftar titik valid yang bisa diurutkan menurut kecamatan, tingkat, atau tanggal.
- Filter: rentang tanggal (pemilih tanggal asli, bukan teks), tingkat, kecamatan.
- Tombol "Unduh PDF" dan "Unduh Excel". Selama mengunduh tampilkan status memuat. Bila gagal tampilkan pesan.
- Hapus arsip advokasi contoh dan semua teks tentang penyerahan ke instansi.

### 8.13 Riwayat Verifikasi (`/admin/riwayat`)

Tabel: waktu, admin, kode laporan, status sebelum, status sesudah, catatan. Filter rentang tanggal dan pencarian kode. Hapus tombol unduh "audit kriptografis".

### 8.14 Data Master (`/admin/data-master`)

Dua daftar sederhana: Kecamatan dan Jenis Limbah, masing-masing dengan tambah, ubah, dan nonaktifkan. Dipakai sebagai sumber dropdown di form warga dan filter.

---

## 9. Sistem desain: fun, smooth, Montserrat

Kesan yang dituju: cerah, ramah, dan ringan seperti aplikasi komunitas anak muda, bukan dashboard instansi. Tetap rapi dan mudah dibaca.

Jangan menulis kode warna langsung di komponen. Semua warna lewat token Tailwind di bawah.

### 9.1 Palet warna

Ganti blok `colors` di `client/tailwind.config.js` dengan token berikut. Token lama `river`, `eco`, dan `pollution` dihapus.

**Warna merek:**

| Nama | Token | Hex | Teks di atasnya | Pemakaian |
|---|---|---|---|---|
| Biru Musi | `musi-600` | `#1D6FF2` | putih | Warna utama: tombol utama, tautan, tab aktif |
| Biru Musi gelap | `musi-700` | `#1558D6` | putih | Hover dan tekan tombol utama |
| Biru Musi tua | `musi-800` | `#1447B0` | putih | Teks di atas `musi-100` |
| Biru Musi muda | `musi-100` | `#E3EEFF` | `musi-800` | Latar lencana, sorotan lembut |
| Koral | `koral-500` | `#FF6B57` | `ink` | Tombol "Laporkan Pencemaran" dan ajakan utama warga |
| Koral muda | `koral-100` | `#FFE3E3` | `ink` | Latar sorotan ajakan |
| Kuning Ceria | `ceria-400` | `#FFC93C` | `ink` | Aksen, sorotan, ilustrasi, langkah aktif |
| Kuning muda | `ceria-100` | `#FFF1C9` | `ceria-800` | Latar lencana |
| Kuning tua | `ceria-800` | `#8A5300` | putih | Teks di atas `ceria-100` |
| Toska | `toska-400` | `#19D3BD` | `ink` | Aksen kedua, state berhasil, ilustrasi air |
| Toska muda | `toska-100` | `#D5F7F1` | `toska-800` | Latar lencana berhasil |
| Toska tua | `toska-800` | `#0B6B5E` | putih | Teks di atas `toska-100` |
| Ungu | `ungu-600` | `#6B4BF0` | putih | Aksen portal admin (menu aktif, sorotan) |
| Ungu muda | `ungu-100` | `#EEE9FF` | `ungu-800` | Latar menu aktif admin |
| Ungu tua | `ungu-800` | `#5A3FD6` | putih | Teks di atas `ungu-100` |

**Warna netral:**

| Nama | Token | Hex | Pemakaian |
|---|---|---|---|
| Tinta | `ink` | `#12213F` | Judul dan teks utama (navy, bukan hitam) |
| Tinta lembut | `ink-soft` | `#4A5878` | Teks isi |
| Tinta redup | `ink-muted` | `#5B6885` | Keterangan, placeholder |
| Krem | `krem` | `#FFF9EF` | Latar halaman warga |
| Putih | `white` | `#FFFFFF` | Kartu, input |
| Garis | `garis` | `#ECE6D9` | Garis tepi kartu dan pemisah |
| Abu muda | `abu-100` | `#ECEFF5` | Latar halaman admin, lencana netral |

**Tingkat dugaan (arti tetap, jangan dipakai untuk hal lain):**

| Tingkat | Marker | Lencana latar | Lencana teks |
|---|---|---|---|
| Berat | `#D93A40` | `#FFE3E3` | `#B4232A` |
| Sedang | `#FFA63D` | `#FFF1C9` | `#8A5300` |
| Ringan | `#22B573` | `#D5F7F1` | `#0B6B5E` |

Daftarkan sebagai `tingkat-berat`, `tingkat-sedang`, `tingkat-ringan`.

**Status laporan:**

| Status | Lencana latar | Lencana teks |
|---|---|---|
| Menunggu Verifikasi | `ceria-100` | `ceria-800` |
| Valid | `musi-100` | `musi-800` |
| Ditolak | `abu-100` | `ink-soft` |

**Aturan pemakaian:**
- Satu layar punya satu warna dominan (Biru Musi) dan paling banyak dua aksen. Jangan memakai kelima warna merek sekaligus.
- Teks putih hanya di atas `musi-600`, `musi-700`, `ungu-600`, dan marker Berat. Di atas Koral, Kuning, dan Toska gunakan `ink`. Pasangan di tabel sudah dicek kontrasnya minimal 4,5:1.
- Tingkat dan status selalu disertai teks, tidak hanya warna.
- Gradasi boleh, tetapi lembut dan hanya di area hero atau ilustrasi: `musi-600` ke `toska-400`, atau `koral-500` ke `ceria-400`. Jangan pada tombol, kartu data, atau teks.
- Portal warga berlatar `krem`. Portal admin berlatar `abu-100` dengan aksen Ungu supaya langsung terasa beda ruang.
- Tombol hitam (`bg-slate-900`) dan `#0088cc` yang sekarang ada di kode diganti seluruhnya.

### 9.2 Tipografi: Montserrat

- Ganti font di `client/index.html` menjadi Montserrat dari Google Fonts dengan bobot 400, 500, 600, 700, 800. Sertakan `display=swap`.
- Ubah `fontFamily.sans` di `tailwind.config.js` menjadi `['Montserrat', 'system-ui', 'sans-serif']`.
- Kode tiket dan koordinat memakai Montserrat dengan `tabular-nums` dan jarak huruf sedikit renggang. Tidak perlu font monospace tambahan.

| Gaya | Ukuran/tinggi baris | Bobot | Pemakaian |
|---|---|---|---|
| Display | 36/42 (HP 30/36) | 800 | Judul hero beranda |
| H1 | 28/34 | 700 | Judul halaman |
| H2 | 22/28 | 700 | Judul bagian |
| H3 | 18/24 | 600 | Judul kartu |
| Isi | 16/26 | 400 | Paragraf, isian form |
| Isi kecil | 14/22 | 500 | Tabel, keterangan kartu |
| Keterangan | 12/18 | 600 | Waktu, lencana |
| Tombol | 15/20 | 600 | Label tombol |

- Montserrat lebih lebar daripada Inter. Jaga panjang baris paragraf 45 sampai 70 karakter dan beri ruang lebih di kolom tabel.
- Judul memakai `tracking-tight`. Teks isi memakai jarak huruf normal.
- Ukuran terkecil 12 px. Hapus semua `text-[10px]` dan `text-[11px]`. `font-black` tidak dipakai, bobot tertinggi 800 dan hanya untuk Display.
- Input memakai 16 px agar HP tidak memperbesar halaman otomatis.

### 9.3 Bentuk dan jarak

- Serba membulat: tombol dan chip berbentuk pil (`rounded-full`), input `rounded-2xl`, kartu `rounded-3xl`, dialog `rounded-3xl` (di HP dialog menempel di bawah layar dengan `rounded-t-3xl`).
- Jarak kelipatan 4 px. Padding kartu 20 px di HP, 28 px di desktop. Beri ruang kosong yang lega antarbagian.
- Target sentuh minimal 44 × 44 px. Tombol utama setinggi 52 px di HP.
- Bayangan lembut dan berwarna, bukan abu pekat. Daftarkan dua token:
  - `shadow-lembut`: `0 8px 24px -8px rgba(18, 33, 63, 0.12)` untuk kartu.
  - `shadow-angkat`: `0 16px 40px -12px rgba(29, 111, 242, 0.28)` untuk tombol utama saat hover dan elemen melayang.
- Garis tepi kartu tipis (`garis`), atau tanpa garis bila sudah memakai bayangan. Jangan keduanya tebal.
- Hiasan: bentuk gelombang atau gumpalan lembut (SVG) di hero beranda, halaman terkirim, dan state kosong. Maksimal satu hiasan per layar, tidak di belakang teks isi atau data.

### 9.4 Gerak (smooth)

Semua gerak singkat, halus, dan punya tujuan: memberi tahu apa yang berubah.

| Kejadian | Gerak | Durasi |
|---|---|---|
| Hover dan tekan tombol | Naik 1 px dan bayangan membesar saat hover, skala 0,97 saat ditekan | 150 ms |
| Kartu saat hover (desktop) | Naik 2 px, bayangan `shadow-angkat` | 200 ms |
| Pindah langkah form | Geser mendatar 16 px sambil memudar, arah mengikuti maju atau mundur | 250 ms |
| Pindah halaman | Memudar dan naik 8 px | 200 ms |
| Dialog | Latar memudar, isi membesar dari 0,96 | 200 ms |
| Menu hamburger (HP) | Panel turun 12 px sambil memudar, latar memudar | 250 ms |
| Laci menu admin | Geser dari kiri | 300 ms |
| Toast | Geser dari atas, hilang sendiri setelah 4 detik | 250 ms |
| Daftar dan kartu saat pertama tampil | Muncul berurutan, jeda 40 ms per item, maksimal 8 item | 250 ms |
| Marker baru di peta | Jatuh dan memantul sekali | 400 ms |
| Laporan terkirim | Centang tergambar, percikan konfeti kecil sekali | 600 ms |
| Lencana status berubah | Warna bertransisi, bukan berganti mendadak | 200 ms |
| Memuat | Skeleton dengan kilau bergerak, bukan spinner di tengah halaman | berulang |
| Bilah langkah (stepper) | Garis kemajuan terisi halus | 300 ms |

**Aturan gerak:**
- Kurva bawaan `cubic-bezier(0.22, 1, 0.36, 1)` (melambat di akhir). Daftarkan di Tailwind sebagai `ease-halus`. Pantulan memakai `cubic-bezier(0.34, 1.56, 0.64, 1)` sebagai `ease-pantul`.
- Hanya menganimasikan `transform` dan `opacity` agar tetap lancar di HP kelas menengah.
- Durasi tidak lebih dari 400 ms, kecuali perayaan laporan terkirim.
- Hormati `prefers-reduced-motion`: bila aktif, semua gerak diganti memudar singkat dan konfeti dimatikan.
- Gulir halaman halus (`scroll-behavior: smooth`). Peta berpindah ke marker dengan `flyTo`, bukan melompat.
- Boleh memakai pustaka `framer-motion` untuk transisi langkah, dialog, dan daftar. Gerak sederhana cukup dengan kelas transisi Tailwind.
- Gerak tidak boleh menunda pekerjaan: tombol tetap bisa ditekan dan isian tetap bisa diketik selama animasi berjalan.

### 9.5 Komponen bersama

Buat di `client/src/components/`:

`Button`, `Input`, `Textarea`, `Select`, `ChipGroup`, `Badge` (varian status dan tingkat), `Card`, `Modal`, `Drawer`, `SiteHeader`, `SiteFooter`, `MobileMenu`, `Toast`, `Stepper`, `EmptyState`, `ErrorState`, `Skeleton`, `PhotoPicker`, `MapView`, `LocationPicker`, `ReportCard`, `FilterBar`, `DateRangePicker`, `StatCard`, `Timeline`, `PageTransition`.

**Varian `Button`:**

| Varian | Tampilan | Dipakai untuk |
|---|---|---|
| `utama` | `musi-600`, teks putih, pil | Aksi utama tiap layar |
| `ajakan` | `koral-500`, teks `ink`, pil, lebih besar | "Laporkan Pencemaran" |
| `lembut` | `musi-100`, teks `musi-800` | Aksi kedua |
| `garis` | Putih, garis `garis`, teks `ink` | Aksi netral, "Kembali" |
| `valid` | `toska-400`, teks `ink` | "Tandai Valid" |
| `tolak` | Putih, garis dan teks `#B4232A` | "Tolak" |

**Catatan komponen:**
- `ChipGroup` untuk jenis limbah, tingkat dugaan, dan kondisi lokasi: pil besar, yang terpilih berlatar `musi-600` teks putih dengan ikon centang.
- `StatCard` memakai latar warna muda yang berbeda per kartu (`musi-100`, `ceria-100`, `toska-100`, `abu-100`) dengan angka besar berbobot 700. Di portal admin (latar `abu-100`), kartu Ditolak memakai latar putih dengan `shadow-lembut` agar tidak tenggelam.
- `EmptyState` memakai ilustrasi SVG sederhana bernuansa sungai dengan warna palet, satu kalimat, dan satu tombol.
- `Stepper` berupa garis kemajuan dengan titik langkah, langkah aktif berwarna `ceria-400`.

**Ikon:** `lucide-react` (sudah terpasang) dengan ketebalan garis 2. Hapus emoji sebagai ikon.

**Marker peta:** pin tetesan air SVG 36 px, warna isi sesuai tingkat, garis tepi putih 3 px, bayangan lembut. Marker terpilih membesar ke 44 px.

**Peta:** tetap Leaflet dan OpenStreetMap. Sudut wadah peta `rounded-3xl`. Popup mengikuti gaya kartu (sudut membulat, Montserrat, foto di atas).

### 9.6 Logo mitra: Green Generation

Logo resmi komunitas (tulisan "Green Generation Sumatera Selatan") ada di `assets/logo-ggp.png` dalam paket ini. Salin ke `client/src/assets/logo-ggp.png` dan pakai lewat satu komponen `PartnerLogo` dengan prop `size`.

**Aturan:**
- Logo dipakai apa adanya. Jangan diwarnai ulang, diregangkan, dipotong, diberi bayangan, atau dijadikan ikon.
- Selalu di atas wadah putih bersudut 14 px dengan padding 3 px dan garis tipis `garis`, karena file aslinya berlatar putih. Di atas latar berwarna (hero, panel ungu) wadah putih ini wajib.
- Teks alternatif: "Logo Green Generation Sumatera Selatan".
- Nama yang ditulis di teks UI tetap "Green Generation Palembang" dan "GG River Care".
- Logo SIPEPES tetap logo utama di kiri; logo mitra selalu sesudahnya dan lebih kecil atau sama.

| Tempat | Ukuran | Catatan |
|---|---|---|
| Header situs | 40 px | Hanya ≥ 768 px, dipisah garis tipis dari logo SIPEPES |
| Pil hero beranda | 30 px | Di semua lebar |
| Footer situs | 64 px | Dengan teks "Dikelola bersama Green Generation Palembang · Program GG River Care" |
| Masuk admin | 64 px (panel ungu), 40 px (HP) | |
| Sidebar / laci admin | 36 px | Di atas kartu pengguna |

**Aset:** file yang ada berukuran 150 × 150 px, cukup sampai tampilan 64 px. Minta ke GGP versi PNG transparan minimal 512 px atau SVG, lalu ganti file di `client/src/assets/` tanpa mengubah kode.

### 9.7 Penerapan arah visual per layar

| Layar | Sentuhan visual |
|---|---|
| Beranda | Hero pendek bergradasi lembut `musi-600` ke `toska-400` dengan hiasan gelombang, judul Display, tombol `ajakan` Koral. Peta di kartu besar membulat. |
| Buat Laporan | Latar `krem`, satu kartu putih per langkah, stepper Kuning Ceria, kolom tips di desktop, bilah tombol menempel di bawah pada HP. |
| Laporan Terkirim | Centang beranimasi di lingkaran Toska, konfeti kecil, kode tiket di kartu `ceria-100`. |
| Lacak | Lencana status besar, linimasa dengan titik berwarna dan garis yang terisi halus. |
| Panduan | Kartu langkah berwarna muda bergantian (Biru, Kuning, Toska, Koral). |
| Masuk Admin | Layar terbagi: kiri panel Ungu dengan hiasan, kanan form putih. Di HP hanya form. |
| Portal admin | Latar `abu-100`, sidebar putih, menu aktif `ungu-100` teks `ungu-800`. Lebih tenang daripada portal warga karena dipakai bekerja lama: tanpa gradasi dan tanpa konfeti. |

---

## 10. Kosakata

Gunakan istilah berikut secara konsisten di seluruh layar.

| Pakai | Jangan pakai |
|---|---|
| Laporan | Tiket, aduan |
| Kode tiket | Nomor tracking, ID |
| Tingkat dugaan: Ringan, Sedang, Berat | Parah, Kritis, Aman |
| Menunggu Verifikasi, Valid, Ditolak | Tervalidasi, Diterbitkan, Dieskalasi |
| Admin GG River Care | Petugas, Admin DLH, Verifikator |
| Kecamatan | Sempadan, zona, segmen |
| Lokasi | Titik spasial, koordinat GIS |
| Alasan penolakan | Rejection reason |

Sapaan: **kamu** (bukan Anda), sesuai nuansa komunitas anak muda. Contoh: "Laporanmu sudah tampil di peta."

Nada: ramah, langsung, kalimat pendek. Contoh tombol: "Laporkan Pencemaran", "Lanjut", "Kirim Laporan", "Cek Status", "Tandai Valid", "Tolak".

---

## 11. State, responsif, dan aksesibilitas

**Setiap layar yang memuat data wajib punya empat state:** memuat (skeleton), kosong, gagal (pesan dan tombol "Coba Lagi"), dan berisi.

**Titik lebar layar (website responsif):**

| Lebar | Nama | Perilaku |
|---|---|---|
| < 768 px | HP | Satu kolom, header ringkas + hamburger, tabel jadi kartu, dialog menempel di bawah |
| 768–1023 px (`md`) | Tablet | Navigasi lengkap di header, hero dua kolom, peta di atas daftar, admin pakai laci |
| ≥ 1024 px (`lg`) | Laptop/desktop | Dua kolom, sidebar admin tetap, kolom tips di form |
| ≥ 1280 px (`xl`) | Desktop lebar | Konten tetap maksimal 1120 px di tengah; detail admin dua kolom |

Uji setiap halaman di 360, 768, 1024, dan 1280 px dengan memperkecil jendela browser, bukan hanya mode perangkat.

**Aksesibilitas:**
- Kontras teks minimal 4,5:1. Gunakan pasangan warna di Bagian 9.1.
- Semua input punya `<label>`. Pesan salah dihubungkan dengan `aria-describedby`.
- Semua tombol ikon punya `aria-label`.
- Fokus keyboard terlihat. Dialog menjebak fokus dan bisa ditutup dengan Esc.
- Foto punya teks alternatif dari judul laporan.
- Tidak ada `alert()`. Gunakan `Toast` atau pesan di tempat.

---

## 12. Struktur kode dan lapisan data

**Struktur `client/src/` yang dituju:**

```
components/      komponen bersama (Bagian 9)
features/
  reports/       form laporan, kartu, hook data laporan
  tracking/      halaman lacak
  map/           MapView, LocationPicker, marker
  admin/         antrean, detail, rekap, riwayat, data master
layouts/         WargaLayout, AdminLayout
pages/           satu file per rute, tipis
services/
  api.js         klien HTTP (axios), baca VITE_API_BASE_URL
  reports.js     fungsi data laporan
  auth.js        login, logout, token
  mockAdapter.js data contoh untuk pengembangan
lib/             kompresi foto, format tanggal, konstanta
```

**Aturan lapisan data:**
- Halaman dan komponen tidak mengakses `localStorage` atau data contoh secara langsung. Semua lewat `services/`.
- `services/` memilih sumber data dari variabel `VITE_USE_MOCK`. Bila `true`, pakai `mockAdapter`. Bila tidak, panggil API sesuai `docs/API_CONTRACT.md`.
- Endpoint yang tersedia di `server/`: `POST /reports`, `GET /reports`, `GET /reports/track/:code`, `POST /auth/login`, `GET /auth/me`, `GET /admin/reports`, `GET /admin/reports/:id`, `PATCH /admin/reports/:id/verify`, `GET /admin/reports/export`, `GET /river-segments`, `GET /stats/summary`, `GET /stats/trends`.
- `mockAdapter` harus meniru aturan API: peta hanya mengembalikan laporan valid, penolakan tanpa alasan gagal, kode yang tidak ada mengembalikan "tidak ditemukan".
- Data contoh dibersihkan: hapus IKA, EXIF, GIS, dan semua penyebutan instansi. Angka ringkasan dihitung dari daftar laporan.
- Login: hapus cabang yang menerima kombinasi apa pun. Dalam mode mock, hanya satu akun contoh yang diterima dan ditandai jelas sebagai mode demo.

**Pembaruan peta tanpa reload:**
- Bungkus dalam satu hook `useValidReports()`.
- Dalam mode API: berlangganan perubahan tabel `reports` lewat Supabase Realtime (`@supabase/supabase-js` sudah terpasang di client), dengan cadangan polling tiap 15 detik bila langganan gagal.
- Dalam mode mock: perubahan state langsung memperbarui peta.

**Kompresi foto (FR-3):** fungsi di `lib/compressImage.js` memakai canvas. Keluaran WebP atau JPEG di bawah 2 MB. Tampilkan ukuran hasil di pratinjau.

---

## 13. Keputusan yang perlu dikonfirmasi PM

Kerjakan dengan pilihan bawaan di bawah ini kecuali ada arahan lain. Tandai di PR bila salah satunya dipakai.

| No | Pertanyaan | Pilihan bawaan |
|---|---|---|
| 1 | Isian "Kondisi lokasi" (luas, permukiman, kedalaman) butuh kolom baru di tabel `reports`. | Tambahkan sebagai isian opsional. Sampai kolom tersedia, gabungkan ke awal teks deskripsi saat mengirim. |
| 2 | Kode tiket saat ini acak 4 digit. | Biarkan formatnya, tampilan tidak bergantung pada urutan. |
| 3 | Apakah nama dan kontak pelapor tetap diminta? | Tidak diminta, sesuai FR-2. |
| 4 | Halaman Data Master butuh endpoint tambah dan ubah yang belum ada. | Bangun tampilannya dengan mock, tandai sebagai menunggu backend. |
| 5 | Apakah Ringkasan Eksekutif tetap jadi halaman sendiri? | Tidak. Digabung ke Antrean dan Rekap. |

---

## 14. Tahap pengerjaan

Kerjakan berurutan. Satu tahap satu PR. Setiap tahap harus bisa di-build (`npm run build` di `client/`) dan tidak merusak tahap sebelumnya.

| Tahap | Pekerjaan | Selesai bila |
|---|---|---|
| 0. Fondasi | Salin referensi HTML ke `docs/design/`. Routing dengan `react-router-dom`, struktur folder, `services/` dengan `mockAdapter`, pembersihan data contoh, token warna dan bayangan baru di `tailwind.config.js`, font Montserrat dimuat. | Semua rute di Bagian 6 terbuka lewat URL dan bisa di-refresh. Tidak ada kode warna langsung di komponen baru. |
| 1. Komponen bersama | Semua komponen di Bagian 9. | Setiap komponen dipakai minimal di satu halaman dan lolos pemeriksaan di lebar 360 px. |
| 2. Portal warga | Kerangka, Beranda dan Peta, form 4 langkah, Terkirim, Lacak, Panduan. | Alur A dan B di Bagian 7 berjalan penuh dalam mode mock. |
| 3. Portal admin | Login, kerangka, Antrean, Detail dan Verifikasi, Peta, Rekap, Riwayat, Data Master. | Alur C dan D berjalan penuh dalam mode mock. Penolakan tanpa alasan tidak bisa dikirim. |
| 4. Sambungan API | Ganti sumber data ke API, unduhan PDF dan Excel dari endpoint ekspor, pembaruan peta tanpa reload. | Dengan `VITE_USE_MOCK=false` dan backend aktif, laporan dari satu perangkat muncul di antrean admin di perangkat lain. |
| 5. Poles | State kosong, gagal, memuat. Gerak di Bagian 9.4. Aksesibilitas. Pembersihan kode lama. Perbarui `docs/DESIGN_SYSTEM.md` agar sama dengan Bagian 9. | Daftar periksa di Bagian 15 terpenuhi semua. |

File lama yang dihapus setelah penggantinya selesai: `pages/admin/AdminSettings.jsx`, `pages/admin/AdminSegments.jsx`, `pages/admin/AdminDashboard.jsx`, serta isi `context/AdminContext.jsx` yang digantikan `services/` dan hook.

---

## 15. Daftar periksa penerimaan

**Ruang lingkup:**
- [ ] Pencarian kata "DLH", "Dinas", "IKA", "EXIF", "Eskalasi", "Webhook", "NIP" di `client/src` tidak menghasilkan apa pun.
- [ ] Tidak ada tombol dukung, menu Pengaturan, atau isian nama dan kontak pelapor.
- [ ] Semua angka di layar dihitung dari data.

**Warga:**
- [ ] Laporan bisa dibuat tanpa akun dalam 4 langkah di layar 360 px tanpa gulir mendatar.
- [ ] Logo Green Generation tampil di header (≥ 768 px), hero, footer, masuk admin, dan sidebar admin sesuai Bagian 9.6, selalu di wadah putih dan tidak berubah bentuk.
- [ ] Tidak ada pola aplikasi native: tanpa tab bar bawah, status bar palsu, atau layar splash. Semua halaman punya header dan footer situs.
- [ ] Setiap halaman tampil benar di 360, 768, 1024, dan 1280 px.
- [ ] Foto selain JPG, PNG, WebP ditolak. Foto besar dikompresi hingga di bawah 2 MB.
- [ ] Lokasi bisa diisi dengan geolocation dan dengan menggeser pin. Tidak ada koordinat acak.
- [ ] Judul, deskripsi, jenis limbah, dan tingkat dugaan wajib diisi dengan label Ringan, Sedang, Berat.
- [ ] Setelah mengirim, kode tiket tampil, bisa disalin, dan bisa dibagikan ke WhatsApp.
- [ ] Halaman Lacak kosong saat dibuka. Kode salah menampilkan pesan "tidak ditemukan".
- [ ] Laporan yang ditolak menampilkan alasan penolakan.
- [ ] Peta hanya menampilkan laporan valid. Popup berisi foto dan tanggal.
- [ ] Filter rentang tanggal, tingkat, dan kecamatan menyaring peta dan daftar.

**Admin:**
- [ ] Login hanya dengan email dan kata sandi. Rute `/admin/*` tidak bisa dibuka tanpa login.
- [ ] Menolak laporan tanpa alasan tidak bisa dilakukan.
- [ ] Setiap perubahan status muncul di riwayat dengan admin, status sebelum dan sesudah, catatan, dan waktu.
- [ ] Laporan yang ditandai valid muncul di peta tanpa memuat ulang halaman.
- [ ] Setiap laporan punya tombol "Buka di Google Maps".
- [ ] Unduhan PDF dan Excel menghasilkan file berisi laporan valid sesuai filter.

**Arah visual:**
- [ ] Seluruh teks memakai Montserrat. Tidak ada sisa font Inter.
- [ ] Semua warna berasal dari token Bagian 9.1. Pencarian `#0088cc`, `slate-900`, `sky-`, `river-`, dan `eco-` di `client/src` tidak menghasilkan apa pun.
- [ ] Tombol dan chip berbentuk pil, kartu bersudut besar, bayangan lembut.
- [ ] Semua gerak di tabel Bagian 9.4 ada dan terasa halus di HP.
- [ ] Dengan `prefers-reduced-motion` aktif, gerak berkurang dan konfeti mati.
- [ ] Semua pasangan teks dan latar memenuhi kontras 4,5:1.

- [ ] Setiap halaman W1–W13 dan A1–A9 sesuai referensi HTML saat dibandingkan berdampingan di lebar yang sama.

**Kualitas:**
- [ ] Tidak ada `alert()`, emoji sebagai ikon, atau teks di bawah 12 px.
- [ ] Setiap layar data punya state memuat, kosong, dan gagal.
- [ ] Semua input berlabel dan bisa dioperasikan dengan keyboard.
- [ ] `npm run build` di `client/` berhasil tanpa peringatan baru.
