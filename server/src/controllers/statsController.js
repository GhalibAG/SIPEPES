const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');
const { successResponse } = require('../utils/response');

/**
 * 1. GET /api/v1/stats/summary
 * Metrik Utama & Ringkasan Statistik Laporan
 */
const getDashboardStats = async (req, res, next) => {
  try {
    let total = 0;
    let pending = 0;
    let valid = 0;
    let rejected = 0;
    let urgent = 0;

    if (pool) {
      try {
        const statsQuery = `
          SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'menunggu') as pending,
            COUNT(*) FILTER (WHERE status = 'valid') as valid,
            COUNT(*) FILTER (WHERE status = 'ditolak') as rejected,
            COUNT(*) FILTER (WHERE status = 'menunggu' AND estimated_severity = 'berat') as urgent
          FROM reports;
        `;
        const result = await query(statsQuery);
        const row = result.rows[0];
        total = parseInt(row.total || 0, 10);
        pending = parseInt(row.pending || 0, 10);
        valid = parseInt(row.valid || 0, 10);
        rejected = parseInt(row.rejected || 0, 10);
        urgent = parseInt(row.urgent || 0, 10);
      } catch (err) {
        console.warn('⚠️ [PG_STATS_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    if (total === 0 && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      const [tRes, pRes, vRes, rRes, uRes] = await Promise.all([
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'menunggu'),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'valid'),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'ditolak'),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'menunggu').eq('estimated_severity', 'berat'),
      ]);

      total = tRes.count || 0;
      pending = pRes.count || 0;
      valid = vRes.count || 0;
      rejected = rRes.count || 0;
      urgent = uRes.count || 0;
    }

    const validPercent = total > 0 ? Math.round((valid / total) * 100) : 0;
    const rejectedPercent = total > 0 ? Math.round((rejected / total) * 100) : 0;

    return successResponse(res, 'Statistik ringkasan laporan berhasil dimuat', {
      total_reports: total,
      pending_reports: pending,
      verified_reports: valid,
      rejected_reports: rejected,
      urgent_reports: urgent,
      // Kompatibilitas dengan Dashboard Frontend Radyf & Crespo
      totalMasuk: total,
      persenKenaikan: '+12%',
      subMasuk: 'Dari bulan sebelumnya',
      antreanVerifikasi: pending,
      terverifikasiValid: valid,
      subValid: `${validPercent}% valid`,
      laporanDitolak: rejected,
      subDitolak: `${rejectedPercent}% tingkat penolakan`,
      rataRataIka: '54.2',
      statusIka: 'Waspada (Tercemar Sedang)',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. GET /api/v1/stats/trends
 * Komposisi Kategori Limbah & Grafik Tren Mingguan
 */
const getDashboardTrends = async (req, res, next) => {
  try {
    const tujuhHariLalu = new Date();
    tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);

    let reports = [];

    if (pool) {
      try {
        const text = `
          SELECT created_at, pollution_type, estimated_severity
          FROM reports
          WHERE created_at >= $1
          ORDER BY created_at ASC;
        `;
        const result = await query(text, [tujuhHariLalu.toISOString()]);
        reports = result.rows;
      } catch (err) {
        console.warn('⚠️ [PG_TRENDS_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    if (reports.length === 0 && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      const { data, error } = await supabase
        .from('reports')
        .select('created_at, pollution_type, estimated_severity')
        .gte('created_at', tujuhHariLalu.toISOString());

      if (!error && data) reports = data;
    }

    // 1. Komposisi Kategori Limbah
    let countPlastik = 0;
    let countB3 = 0;
    let countOrganik = 0;
    const totalCount = reports.length || 1;

    reports.forEach((r) => {
      const type = (r.pollution_type || '').toLowerCase();
      if (type.includes('sampah') || type.includes('domestik') || type.includes('plastik')) {
        countPlastik++;
      } else if (type.includes('industri') || type.includes('minyak') || type.includes('oli')) {
        countB3++;
      } else {
        countOrganik++;
      }
    });

    const wasteComposition = [
      {
        label: 'Plastik / Domestik',
        count: countPlastik,
        percent: Math.round((countPlastik / totalCount) * 100),
        color: 'bg-slate-800',
      },
      {
        label: 'Limbah Cair / B3 / Oli',
        count: countB3,
        percent: Math.round((countB3 / totalCount) * 100),
        color: 'bg-rose-500',
      },
      {
        label: 'Organik / Lainnya',
        count: countOrganik,
        percent: Math.round((countOrganik / totalCount) * 100),
        color: 'bg-emerald-600',
      },
    ];

    // 2. Data Tren Mingguan per Hari
    const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weeklyTrendData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const laporanHariIni = reports.filter((r) => {
        const tglLaporan = new Date(r.created_at);
        return tglLaporan.getDate() === d.getDate() && tglLaporan.getMonth() === d.getMonth();
      });

      let plastikHarian = 0;
      let b3Harian = 0;
      let organikHarian = 0;

      laporanHariIni.forEach((r) => {
        const type = (r.pollution_type || '').toLowerCase();
        if (type.includes('sampah') || type.includes('domestik') || type.includes('plastik')) {
          plastikHarian++;
        } else if (type.includes('industri') || type.includes('minyak') || type.includes('oli')) {
          b3Harian++;
        } else {
          organikHarian++;
        }
      });

      weeklyTrendData.push({
        day: namaHari[d.getDay()],
        date: d.toISOString().split('T')[0],
        plastik: plastikHarian,
        b3: b3Harian,
        organik: organikHarian,
        total: laporanHariIni.length,
      });
    }

    return successResponse(res, 'Data tren dan komposisi berhasil dimuat', {
      wasteComposition,
      weeklyTrendData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. GET /api/v1/admin/urgent-reports
 * Daftar laporan menunggu dengan tingkat keparahan 'berat'
 */
const getUrgentReports = async (req, res, next) => {
  try {
    let urgentReports = [];

    if (pool) {
      try {
        const text = `
          SELECT id, tracking_code, title, address_landmark, district, photo_url,
                 estimated_severity, status, created_at
          FROM reports
          WHERE status = 'menunggu' AND estimated_severity = 'berat'
          ORDER BY created_at DESC
          LIMIT 5;
        `;
        const result = await query(text);
        urgentReports = result.rows;
      } catch (err) {
        console.warn('⚠️ [PG_URGENT_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    if (urgentReports.length === 0 && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      const { data, error } = await supabase
        .from('reports')
        .select('id, tracking_code, title, address_landmark, district, photo_url, estimated_severity, status, created_at')
        .eq('status', 'menunggu')
        .eq('estimated_severity', 'berat')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) urgentReports = data;
    }

    return successResponse(res, 'Data antrean mendesak berhasil dimuat', urgentReports);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getDashboardTrends,
  getUrgentReports,
};
