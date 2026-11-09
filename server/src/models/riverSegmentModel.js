const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');

const DEFAULT_SEGMENTS = [
  {
    id: 'seg-1',
    name: 'Kawasan Benteng Kuto Besak - 16 Ilir',
    district: 'Bukit Kecil',
    default_lat: -2.9912000,
    default_lng: 104.7615000,
    description: 'Titik kumpul aktivitas wisata dan dermaga jukung',
  },
  {
    id: 'seg-2',
    name: 'Kawasan Seberang Ulu - Jembatan Ampera',
    district: 'Seberang Ulu I',
    default_lat: -2.9935000,
    default_lng: 104.7640000,
    description: 'Kawasan pemukiman padat bantaran sungai',
  },
  {
    id: 'seg-3',
    name: 'Kawasan Gandus - Aliran Hulu',
    district: 'Gandus',
    default_lat: -3.0125000,
    default_lng: 104.7150000,
    description: 'Titik aliran perbatasan industri dan alam',
  },
  {
    id: 'seg-4',
    name: 'Kawasan Tangga Buntung - 36 Ilir',
    district: 'Ilir Barat II',
    default_lat: -2.9950000,
    default_lng: 104.7380000,
    description: 'Daerah aliran tepian pemukiman warga',
  },
];

class RiverSegmentModel {
  static async findAll() {
    if (pool) {
      try {
        const text = 'SELECT * FROM river_segments ORDER BY name ASC;';
        const result = await query(text);
        if (result.rows.length > 0) return result.rows;
      } catch (err) {
        console.warn('⚠️ [PG_FIND_SEGMENTS_FAIL] Mengalihkan ke default segments:', err.message);
      }
    }

    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      try {
        const { data, error } = await supabase.from('river_segments').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('⚠️ [SUPABASE_FIND_SEGMENTS_FAIL] Mengalihkan ke default segments:', err.message);
      }
    }

    return DEFAULT_SEGMENTS;
  }
}

module.exports = RiverSegmentModel;
