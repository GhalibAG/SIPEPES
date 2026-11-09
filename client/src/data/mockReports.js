// Acuan Resmi: docs/API_CONTRACT.md & docs/ERD_SCHEMA.md
// Data Mock Laporan Pencemaran Sungai Musi (Palembang)

export const initialReports = [
  {
    id: "c1f7a26b-4e89-4bc7-a123-90d5f8e43210",
    tracking_code: "SPP-202611-0021",
    title: "Penumpukan Sampah Plastik di Bawah Jembatan Ampera",
    description: "Terlihat tumpukan sampah plastik tebal menyumbat aliran air dermaga jukung di bawah Jembatan Ampera. Bau menyengat dan menghambat perahu ketek warga yang melintas.",
    latitude: -2.9912000,
    longitude: 104.7615000,
    district: "Bukit Kecil",
    address_landmark: "Dekat Dermaga 7 Ulu / Bawah Jembatan Ampera",
    pollution_type: "sampah_domestik",
    estimated_severity: "berat",
    reporter_name: "Rian Saputra",
    reporter_phone: "081234567890",
    photo_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    status: "valid",
    rejection_reason: null,
    admin_notes: "Laporan telah diverifikasi oleh tim lapangan GG River Care. Titik valid dan siap diadvokasikan.",
    verified_by: "M. Ghalib Assiddiq Gusri",
    verified_at: "2026-11-01T16:00:00Z",
    created_at: "2026-11-01T15:30:00Z",
    river_segment_name: "Kawasan Benteng Kuto Besak - 16 Ilir"
  },
  {
    id: "b2e6a15c-3d78-4ab6-9012-89c4e7d32109",
    tracking_code: "SPP-202611-0022",
    title: "Tumpahan Cairan Oli Hitam dari Kapal Tongkang",
    description: "Ceceran oli dan minyak tebal mengambang di permukaan air tepian sungai sepanjang 30 meter. Permukaan air tampak berminyak pelangi dan berbau solar tajam.",
    latitude: -2.9935000,
    longitude: 104.7640000,
    district: "Seberang Ulu I",
    address_landmark: "Tepian Lorong Tangga Takat, Seberang Ulu",
    pollution_type: "minyak_oli",
    estimated_severity: "berat",
    reporter_name: "Warga Peduli (Anonim)",
    reporter_phone: "085273119922",
    photo_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    status: "menunggu",
    rejection_reason: null,
    admin_notes: null,
    verified_by: null,
    verified_at: null,
    created_at: "2026-11-03T09:15:00Z",
    river_segment_name: "Kawasan Seberang Ulu - Jembatan Ampera"
  },
  {
    id: "a3d5f04b-2c67-49a5-8901-78b3d6c21098",
    tracking_code: "SPP-202611-0023",
    title: "Pembuangan Air Keruh Berbusa Limbah Tahu Rumahan",
    description: "Pipa saluran pembuangan langsung mengalirkan air keruh putih berbusa ke bibir sungai. Menimbulkan bau asam di sekitar pemukiman warga.",
    latitude: -3.0125000,
    longitude: 104.7150000,
    district: "Gandus",
    address_landmark: "Aliran Kanal Dekat Sentra Usaha Gandus",
    pollution_type: "limbah_industri",
    estimated_severity: "sedang",
    reporter_name: "Siti Rahmawati",
    reporter_phone: "081399887766",
    photo_url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80",
    status: "valid",
    rejection_reason: null,
    admin_notes: "Kadar buangan organik cukup tinggi. Tim telah mengambil sampel foto untuk bahan laporan audiensi.",
    verified_by: "M. Ghalib Assiddiq Gusri",
    verified_at: "2026-11-04T11:20:00Z",
    created_at: "2026-11-04T10:00:00Z",
    river_segment_name: "Kawasan Gandus - Aliran Hulu"
  },
  {
    id: "f4c3e92a-1b56-4894-7890-67a2c5b10987",
    tracking_code: "SPP-202611-0024",
    title: "Sampah Enceng Gondok dan Kemasan Plastik Hanyut",
    description: "Timbunan eceng gondok bercampur sampah styrofoam dan botol mineral tersangkut di tiang dermaga kayu warga.",
    latitude: -2.9950000,
    longitude: 104.7380000,
    district: "Ilir Barat II",
    address_landmark: "Dermaga Kayu Tangga Buntung 36 Ilir",
    pollution_type: "sampah_domestik",
    estimated_severity: "ringan",
    reporter_name: "Hendra Wijaya",
    reporter_phone: "089655443322",
    photo_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    status: "valid",
    rejection_reason: null,
    admin_notes: "Dapat dibersihkan secara manual pada aksi GG River Care akhir pekan ini.",
    verified_by: "M. Ghalib Assiddiq Gusri",
    verified_at: "2026-11-05T14:10:00Z",
    created_at: "2026-11-05T13:40:00Z",
    river_segment_name: "Kawasan Tangga Buntung - 36 Ilir"
  },
  {
    id: "e5b2d81f-0a45-4783-6789-5691b4a09876",
    tracking_code: "SPP-202611-0025",
    title: "Laporan Sampah di Daratan Jauh dari Sungai",
    description: "Foto yang dilampirkan berada di pekarangan rumah jalan protokol dan tidak berdampak langsung pada daerah aliran Sungai Musi.",
    latitude: -2.9750000,
    longitude: 104.7500000,
    district: "Ilir Timur I",
    address_landmark: "Jalan Sudirman samping pertokoan",
    pollution_type: "lainnya",
    estimated_severity: "ringan",
    reporter_name: "Anonim",
    reporter_phone: null,
    photo_url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    status: "ditolak",
    rejection_reason: "Lokasi kejadian berada di daratan jalan raya perkotaan dan bukan merupakan kawasan perairan/bantaran Sungai Musi.",
    admin_notes: "Disarankan melapor ke Dinas Kebersihan Kota untuk penanganan sampah daratan.",
    verified_by: "M. Ghalib Assiddiq Gusri",
    verified_at: "2026-11-06T08:30:00Z",
    created_at: "2026-11-05T19:00:00Z",
    river_segment_name: "Kawasan Benteng Kuto Besak - 16 Ilir"
  },
  {
    id: "d6a1c70e-9f34-4672-5678-4580a39f8765",
    tracking_code: "SPP-202611-0026",
    title: "Bangkai Ikan Mengapung Disertai Air Menghitam",
    description: "Terlihat puluhan ikan mengapung mati di dekat saluran outlet pabrik. Air sungai berwarna gelap pekat dan menimbulkan bau menyengat.",
    latitude: -2.9880000,
    longitude: 104.7680000,
    district: "Kalidoni",
    address_landmark: "Dekat Muara Sungai Batang, Kalidoni",
    pollution_type: "limbah_industri",
    estimated_severity: "berat",
    reporter_name: "Bambang Irawan",
    reporter_phone: "082188776655",
    photo_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    status: "menunggu",
    rejection_reason: null,
    admin_notes: null,
    verified_by: null,
    verified_at: null,
    created_at: "2026-11-08T07:20:00Z",
    river_segment_name: "Kawasan Seberang Ulu - Jembatan Ampera"
  }
];

// Data Master Segmen Sungai Musi (Acuan: docs/ERD_SCHEMA.md)
export const riverSegments = [
  {
    id: "seg-01",
    name: "Kawasan Benteng Kuto Besak - 16 Ilir",
    district: "Bukit Kecil",
    default_lat: -2.9912000,
    default_lng: 104.7615000,
    description: "Titik kumpul aktivitas wisata dan dermaga jukung perahu ketek"
  },
  {
    id: "seg-02",
    name: "Kawasan Seberang Ulu - Jembatan Ampera",
    district: "Seberang Ulu I",
    default_lat: -2.9935000,
    default_lng: 104.7640000,
    description: "Kawasan pemukiman padat dan dermaga jukung bantaran sungai"
  },
  {
    id: "seg-03",
    name: "Kawasan Gandus - Aliran Hulu",
    district: "Gandus",
    default_lat: -3.0125000,
    default_lng: 104.7150000,
    description: "Titik aliran perbatasan kawasan industri dan alam hulu Sungai Musi"
  },
  {
    id: "seg-04",
    name: "Kawasan Tangga Buntung - 36 Ilir",
    district: "Ilir Barat II",
    default_lat: -2.9950000,
    default_lng: 104.7380000,
    description: "Daerah aliran tepian pemukiman warga dan kerajinan lokal"
  }
];

// Data Riwayat Verifikasi Terkini (Acuan: tabel verification_logs di ERD_SCHEMA.md)
export const recentActivities = [
  {
    id: "log-1",
    report_title: "Penumpukan Sampah Plastik di Bawah Jembatan Ampera",
    tracking_code: "SPP-202611-0021",
    admin_name: "M. Ghalib Assiddiq Gusri",
    action: "valid",
    severity: "berat",
    timestamp: "2026-11-01T16:00:00Z"
  },
  {
    id: "log-2",
    report_title: "Pembuangan Air Keruh Berbusa Limbah Tahu",
    tracking_code: "SPP-202611-0023",
    admin_name: "M. Ghalib Assiddiq Gusri",
    action: "valid",
    severity: "sedang",
    timestamp: "2026-11-04T11:20:00Z"
  },
  {
    id: "log-3",
    report_title: "Sampah Enceng Gondok dan Kemasan Plastik Hanyut",
    tracking_code: "SPP-202611-0024",
    admin_name: "M. Ghalib Assiddiq Gusri",
    action: "valid",
    severity: "ringan",
    timestamp: "2026-11-05T14:10:00Z"
  },
  {
    id: "log-4",
    report_title: "Laporan Sampah di Daratan Jauh dari Sungai",
    tracking_code: "SPP-202611-0025",
    admin_name: "M. Ghalib Assiddiq Gusri",
    action: "ditolak",
    severity: "ringan",
    timestamp: "2026-11-06T08:30:00Z"
  }
];

// Data Statistik Bulanan untuk Bar Chart (Acuan: Layar 2 Figma)
export const monthlyStats = [
  { month: "Jun", berat: 2, sedang: 4, ringan: 3 },
  { month: "Jul", berat: 3, sedang: 5, ringan: 6 },
  { month: "Agt", berat: 5, sedang: 7, ringan: 4 },
  { month: "Sep", berat: 4, sedang: 6, ringan: 8 },
  { month: "Okt", berat: 6, sedang: 8, ringan: 5 },
  { month: "Nov", berat: 3, sedang: 4, ringan: 2 }
];

// Akun Admin Bawaan untuk Slicing Login (Acuan: docs/API_CONTRACT.md)
export const mockAdminUser = {
  id: "admin-musilaban-01",
  email: "admin@sipepes.or.id",
  full_name: "M. Ghalib Assiddiq Gusri",
  role: "admin",
  organization: "Green Generation Palembang (GG River Care)"
};
