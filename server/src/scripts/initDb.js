const { pool, query } = require('../config/database');
require('dotenv').config();

const ddlSql = `
-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabel Users (Admin)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Master Segmen Sungai Musi
CREATE TABLE IF NOT EXISTS river_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    default_lat DECIMAL(10, 7) NOT NULL,
    default_lng DECIMAL(10, 7) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Laporan Pencemaran Sungai (Reports)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(30) UNIQUE NOT NULL,
    reporter_name VARCHAR(100) DEFAULT 'Warga Peduli',
    reporter_phone VARCHAR(20),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    address_landmark VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    pollution_type VARCHAR(50) NOT NULL CHECK (pollution_type IN ('limbah_industri', 'sampah_domestik', 'minyak_oli', 'lainnya')),
    estimated_severity VARCHAR(20) NOT NULL DEFAULT 'sedang' CHECK (estimated_severity IN ('ringan', 'sedang', 'berat')),
    status VARCHAR(20) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'valid', 'ditolak')),
    rejection_reason TEXT,
    river_segment_id UUID REFERENCES river_segments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Log Riwayat Audit Verifikasi Admin
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    previous_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trigger Pembaruan updated_at Otomatis
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

-- 7. Seed Data Segmen Sungai Musi
INSERT INTO river_segments (name, district, default_lat, default_lng, description) VALUES
('Kawasan Benteng Kuto Besak - 16 Ilir', 'Bukit Kecil', -2.9912000, 104.7615000, 'Titik kumpul aktivitas wisata dan dermaga jukung'),
('Kawasan Seberang Ulu - Jembatan Ampera', 'Seberang Ulu I', -2.9935000, 104.7640000, 'Kawasan pemukiman padat bantaran sungai'),
('Kawasan Gandus - Aliran Hulu', 'Gandus', -3.0125000, 104.7150000, 'Titik aliran perbatasan industri dan alam'),
('Kawasan Tangga Buntung - 36 Ilir', 'Ilir Barat II', -2.9950000, 104.7380000, 'Daerah aliran tepian pemukiman warga')
ON CONFLICT DO NOTHING;
`;

const initDb = async () => {
  if (!pool) {
    console.error('❌ Tidak dapat menjalankan migrasi: DATABASE_URL belum diatur.');
    process.exit(1);
  }

  try {
    console.log('🔄 Memulai migrasi DDL skema basis data SIPEPES...');
    await query(ddlSql);
    console.log('✅ Skema tabel basis data SIPEPES berhasil diinisialisasi!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menginisialisasi basis data:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  initDb();
}

module.exports = initDb;
