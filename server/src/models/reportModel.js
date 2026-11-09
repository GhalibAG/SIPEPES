const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');

// Penyimpanan in-memory sementara jika database lokal/supabase belum aktif
const memoryReports = [];

class ReportModel {
  /**
   * Simpan laporan baru ke database
   */
  static async create(data) {
    const {
      tracking_code,
      reporter_name = 'Warga Peduli',
      reporter_phone = null,
      title,
      description,
      photo_url,
      thumbnail_url = null,
      latitude,
      longitude,
      address_landmark = null,
      district,
      pollution_type,
      estimated_severity,
      river_segment_id = null,
    } = data;

    // 1. Coba via PostgreSQL Pool
    if (pool) {
      try {
        const text = `
          INSERT INTO reports (
            tracking_code, reporter_name, reporter_phone, title, description,
            photo_url, thumbnail_url, latitude, longitude, address_landmark,
            district, pollution_type, estimated_severity, river_segment_id, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'menunggu')
          RETURNING *;
        `;
        const values = [
          tracking_code,
          reporter_name,
          reporter_phone,
          title,
          description,
          photo_url,
          thumbnail_url,
          latitude,
          longitude,
          address_landmark,
          district,
          pollution_type,
          estimated_severity,
          river_segment_id,
        ];
        const result = await query(text, values);
        return result.rows[0];
      } catch (err) {
        console.warn('⚠️ [PG_CREATE_REPORT_FAIL] Mengalihkan ke Supabase client / mock:', err.message);
      }
    }

    // 2. Coba via Supabase Client
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      try {
        const { data: inserted, error } = await supabase
          .from('reports')
          .insert([
            {
              tracking_code,
              reporter_name,
              reporter_phone,
              title,
              description,
              photo_url,
              thumbnail_url,
              latitude,
              longitude,
              address_landmark,
              district,
              pollution_type,
              estimated_severity,
              river_segment_id,
              status: 'menunggu',
            },
          ])
          .select()
          .single();

        if (error) throw error;
        return inserted;
      } catch (err) {
        console.warn('⚠️ [SUPABASE_CREATE_REPORT_FAIL] Mengalihkan ke memori lokal dev:', err.message);
      }
    }

    // 3. Fallback in-memory dev
    const newReport = {
      id: `dev-${Date.now()}`,
      tracking_code,
      reporter_name,
      reporter_phone,
      title,
      description,
      photo_url,
      thumbnail_url,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address_landmark,
      district,
      pollution_type,
      estimated_severity,
      status: 'menunggu',
      river_segment_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryReports.unshift(newReport);
    return newReport;
  }

  /**
   * Ambil laporan valid untuk peta dan list publik
   */
  static async findPublic(filters = {}) {
    const { severity, district, start_date, end_date } = filters;

    // 1. Coba via PostgreSQL Pool
    if (pool) {
      try {
        let text = `
          SELECT id, tracking_code, title, description, latitude, longitude,
                 district, address_landmark, pollution_type, estimated_severity,
                 photo_url, thumbnail_url, created_at
          FROM reports
          WHERE status = 'valid'
        `;
        const values = [];
        let idx = 1;

        if (severity) {
          text += ` AND estimated_severity = $${idx++}`;
          values.push(severity);
        }
        if (district) {
          text += ` AND district = $${idx++}`;
          values.push(district);
        }
        if (start_date) {
          text += ` AND created_at >= $${idx++}`;
          values.push(start_date);
        }
        if (end_date) {
          text += ` AND created_at <= $${idx++}`;
          values.push(end_date);
        }

        text += ' ORDER BY created_at DESC LIMIT 100;';
        const result = await query(text, values);
        return result.rows;
      } catch (err) {
        console.warn('⚠️ [PG_FIND_PUBLIC_FAIL] Mengalihkan ke Supabase client / mock:', err.message);
      }
    }

    // 2. Coba via Supabase Client
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      try {
        let queryBuilder = supabase
          .from('reports')
          .select('id, tracking_code, title, description, latitude, longitude, district, address_landmark, pollution_type, estimated_severity, photo_url, thumbnail_url, created_at')
          .eq('status', 'valid');

        if (severity) queryBuilder = queryBuilder.eq('estimated_severity', severity);
        if (district) queryBuilder = queryBuilder.eq('district', district);
        if (start_date) queryBuilder = queryBuilder.gte('created_at', start_date);
        if (end_date) queryBuilder = queryBuilder.lte('created_at', end_date);

        const { data, error } = await queryBuilder.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('⚠️ [SUPABASE_FIND_PUBLIC_FAIL] Mengalihkan ke memori lokal dev:', err.message);
      }
    }

    // 3. Fallback in-memory dev
    return memoryReports.filter((r) => {
      if (r.status !== 'valid' && r.status !== 'menunggu') return false;
      if (severity && r.estimated_severity !== severity) return false;
      if (district && r.district !== district) return false;
      return true;
    });
  }

  /**
   * Cari laporan berdasarkan Tracking Code unik
   */
  static async findByTrackingCode(trackingCode) {
    if (pool) {
      try {
        const text = `
          SELECT r.*, rs.name as river_segment_name
          FROM reports r
          LEFT JOIN river_segments rs ON r.river_segment_id = rs.id
          WHERE r.tracking_code = $1
          LIMIT 1;
        `;
        const result = await query(text, [trackingCode]);
        return result.rows[0] || null;
      } catch (err) {
        console.warn('⚠️ [PG_TRACKING_FAIL] Mengalihkan ke Supabase / mock:', err.message);
      }
    }

    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*, river_segments(name)')
          .eq('tracking_code', trackingCode)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('⚠️ [SUPABASE_TRACKING_FAIL] Mengalihkan ke mock:', err.message);
      }
    }

    return memoryReports.find((r) => r.tracking_code === trackingCode) || null;
  }
}

module.exports = ReportModel;
