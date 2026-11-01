# 🔌 Spesifikasi Kontrak RESTful API (API Contract)
## Sistem Informasi Pelaporan Pencemaran Sungai (SIPEPES)

Dokumen ini menjadi acuan integrasi antara **Frontend Developer (Radyf & Muhtarom)** dan **Backend Developer (Naufal & Crespo)** agar pengembangan antarmuka dan API dapat berjalan secara paralel (*contract-first development*).

---

## 🌐 1. Konvensi Umum API

* **Base URL:** `http://localhost:5000/api/v1` (Lokal) / `https://api.sipepes.or.id/api/v1` (Produksi)
* **Format Data:** JSON (`Content-Type: application/json`), kecuali untuk unggah foto berkas (`multipart/form-data`).
* **Format Waktu:** ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).
* **Autentikasi:** HTTP Header `Authorization: Bearer <JWT_TOKEN>` untuk rute khusus Admin.

### Struktur Standar Respon (Response Envelope)

#### ✅ Respon Sukses:
```json
{
  "success": true,
  "message": "Data laporan berhasil dimuat",
  "data": {},
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10
  }
}
```

#### ❌ Respon Gagal / Error:
```json
{
  "success": false,
  "message": "Validasi form pelaporan gagal",
  "errors": [
    {
      "field": "photo",
      "message": "Ukuran foto bukti tidak boleh melebihi 2MB"
    }
  ]
}
```

---

## 📑 2. Daftar Lengkap Endpoint

| Kategori | Method | Path Endpoint | Akses | Fungsi Utama |
| :--- | :---: | :--- | :---: | :--- |
| **Auth** | `POST` | `/auth/login` | Publik | Autentikasi Admin Komunitas |
| **Auth** | `GET` | `/auth/me` | Admin | Profil admin yang sedang login |
| **Laporan** | `POST` | `/reports` | Publik | Kirim laporan baru + foto bukti |
| **Laporan** | `GET` | `/reports` | Publik | Ambil laporan valid (untuk Peta & List) |
| **Laporan** | `GET` | `/reports/track/:code` | Publik | Cek status laporan via Kode Tiket |
| **Admin** | `GET` | `/admin/reports` | Admin | Daftar seluruh laporan (filter status) |
| **Admin** | `GET` | `/admin/reports/:id` | Admin | Detail laporan + riwayat verifikasi |
| **Admin** | `PATCH` | `/admin/reports/:id/verify` | Admin | Validasi atau Tolak laporan |
| **Ekspor** | `GET` | `/admin/reports/export` | Admin | Unduh rekapitulasi file PDF / Excel |
| **Statistik** | `GET` | `/stats/summary` | Publik | Data agregat untuk grafik dashboard |

---

## 🔍 3. Rincian Payload & Contoh Response

### 1. Kirim Laporan Baru (`POST /reports`)
* **Header:** `Content-Type: multipart/form-data`
* **Form Fields:**
  * `title` (string, wajib): "Penumpukan Sampah Plastik di Bawah Jembatan Ampera"
  * `description` (string, wajib): "Terlihat tumpukan sampah plastik tebal menyumbat aliran air dermaga"
  * `latitude` (float, wajib): `-2.9912000`
  * `longitude` (float, wajib): `104.7615000`
  * `district` (string, wajib): "Seberang Ulu I"
  * `address_landmark` (string, opsional): "Dekat Dermaga 7 Ulu"
  * `pollution_type` (string, wajib): `sampah_domestik` | `limbah_industri` | `minyak_oli` | `lainnya`
  * `estimated_severity` (string, wajib): `ringan` | `sedang` | `berat`
  * `reporter_name` (string, opsional): "Rian Saputra"
  * `reporter_phone` (string, opsional): "081234567890"
  * `photo` (binary image, wajib): File gambar maksimal 2MB.

#### Response Sukses (201 Created):
```json
{
  "success": true,
  "message": "Laporan berhasil dikirim dan sedang menunggu verifikasi admin.",
  "data": {
    "id": "c1f7a26b-4e89-4bc7-a123-90d5f8e43210",
    "tracking_code": "SPP-202611-0021",
    "status": "menunggu",
    "created_at": "2026-11-01T15:30:00Z"
  }
}
```

---

### 2. Ambil Titik Peta Publik (`GET /reports`)
* **Query Params:**
  * `severity` (opsional): `berat`
  * `district` (opsional): `Ilir Timur I`
  * `start_date` (opsional): `2026-10-01`
  * `end_date` (opsional): `2026-11-01`

#### Response Sukses (200 OK):
```json
{
  "success": true,
  "message": "Berhasil memuat titik pencemaran",
  "data": [
    {
      "id": "c1f7a26b-4e89-4bc7-a123-90d5f8e43210",
      "tracking_code": "SPP-202611-0021",
      "title": "Tumpahan Oli Kapal di Tepian Sungai",
      "latitude": -2.9912000,
      "longitude": 104.7615000,
      "pollution_type": "minyak_oli",
      "estimated_severity": "berat",
      "photo_url": "https://storage.sipepes.or.id/reports/oil_spill.webp",
      "created_at": "2026-11-01T15:30:00Z"
    }
  ]
}
```

---

### 3. Verifikasi Laporan oleh Admin (`PATCH /admin/reports/:id/verify`)
* **Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Request Body:**
```json
{
  "status": "valid",
  "notes": "Laporan telah diverifikasi oleh tim lapangan GG River Care. Titik valid dan siap diadvokasikan."
}
```

#### Response Sukses (200 OK):
```json
{
  "success": true,
  "message": "Status laporan berhasil diperbarui menjadi valid",
  "data": {
    "id": "c1f7a26b-4e89-4bc7-a123-90d5f8e43210",
    "status": "valid",
    "verified_by": "M. Ghalib Assiddiq Gusri",
    "updated_at": "2026-11-01T16:00:00Z"
  }
}
```

---

### 4. Ekspor Rekapitulasi Data (`GET /admin/reports/export`)
* **Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Query Params:**
  * `format`: `pdf` atau `xlsx`
  * `status`: `valid`
* **Response:** Stream berkas biner (`Content-Type: application/pdf` atau `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

---

© 2026 SIPEPES REST API Contract — Tim 3 MuSilaban.
