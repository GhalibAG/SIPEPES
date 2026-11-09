/**
 * Domain Constants SIPEPES sesuai docs/ERD_SCHEMA.md & docs/DESIGN_SYSTEM.md
 */

const POLLUTION_TYPES = [
  'limbah_industri',
  'sampah_domestik',
  'minyak_oli',
  'lainnya'
];

const SEVERITY_LEVELS = [
  'ringan',
  'sedang',
  'berat'
];

const REPORT_STATUS = [
  'menunggu',
  'valid',
  'ditolak'
];

const PALEMBANG_DISTRICTS = [
  'Ilir Barat I',
  'Ilir Barat II',
  'Ilir Timur I',
  'Ilir Timur II',
  'Ilir Timur III',
  'Seberang Ulu I',
  'Seberang Ulu II',
  'Bukit Kecil',
  'Gandus',
  'Kertapati',
  'Plaju',
  'Sako',
  'Sukarami',
  'Alang-Alang Lebar',
  'Kalidoni',
  'Sematang Borang',
  'Kemuning',
  'Jakabaring'
];

module.exports = {
  POLLUTION_TYPES,
  SEVERITY_LEVELS,
  REPORT_STATUS,
  PALEMBANG_DISTRICTS
};
