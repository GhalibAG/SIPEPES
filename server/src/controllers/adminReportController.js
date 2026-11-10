const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/response');
const { generateExcel, generatePDF } = require('../services/exportService');

/**
 * 1. GET /api/v1/admin/reports
 * Mengambil daftar seluruh laporan dengan filter status, kecamatan, dan paginasi
 */
const getAdminReports = async (req, res, next) => {
  try {
    const { status, district, severity, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    // 1. Coba via PostgreSQL Pool
    if (pool) {
      try {
        let baseWhere = 'WHERE 1=1';
        const params = [];
        let idx = 1;

        if (status) {
          // Normalisasi jika frontend/client mengirim 'diverifikasi' -> 'valid'
          const normStatus = status === 'diverifikasi' ? 'valid' : status;
          baseWhere += ` AND r.status = $${idx++}`;
          params.push(normStatus);
        }
        if (district) {
          baseWhere += ` AND r.district = $${idx++}`;
          params.push(district);
        }
        if (severity) {
          baseWhere += ` AND r.estimated_severity = $${idx++}`;
          params.push(severity);
        }

        const countQuery = `SELECT COUNT(*) as total FROM reports r ${baseWhere};`;
        const countRes = await query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.total || 0, 10);

        const dataQuery = `
          SELECT r.*, rs.name as river_segment_name
          FROM reports r
          LEFT JOIN river_segments rs ON r.river_segment_id = rs.id
          ${baseWhere}
          ORDER BY r.created_at DESC
          LIMIT $${idx++} OFFSET $${idx++};
        `;
        const dataRes = await query(dataQuery, [...params, limitNum, offset]);

        return successResponse(res, 'Daftar laporan admin berhasil dimuat', {
          reports: dataRes.rows,
          pagination: {
            total_data: total,
            current_page: pageNum,
            total_page: Math.ceil(total / limitNum) || 1,
            limit: limitNum,
          },
        });
      } catch (err) {
        console.warn('⚠️ [PG_ADMIN_REPORTS_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    // 2. Fallback via Supabase Client
    let sbQuery = supabase.from('reports').select('*, river_segments(name)', { count: 'exact' });
    if (status) {
      const normStatus = status === 'diverifikasi' ? 'valid' : status;
      sbQuery = sbQuery.eq('status', normStatus);
    }
    if (district) sbQuery = sbQuery.eq('district', district);
    if (severity) sbQuery = sbQuery.eq('estimated_severity', severity);

    const { data: reports, count, error } = await sbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    return successResponse(res, 'Daftar laporan admin berhasil dimuat', {
      reports: reports || [],
      pagination: {
        total_data: count || 0,
        current_page: pageNum,
        total_page: Math.ceil((count || 0) / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. GET /api/v1/admin/reports/:id
 * Mengambil detail lengkap laporan beserta riwayat audit log verifikasinya
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let report = null;
    let logs = [];

    if (pool) {
      try {
        const reportRes = await query(
          `SELECT r.*, rs.name as river_segment_name
           FROM reports r
           LEFT JOIN river_segments rs ON r.river_segment_id = rs.id
           WHERE r.id = $1 LIMIT 1;`,
          [id]
        );

        if (reportRes.rows.length > 0) {
          report = reportRes.rows[0];
          const logsRes = await query(
            `SELECT vl.*, u.full_name as admin_name, u.email as admin_email
             FROM verification_logs vl
             LEFT JOIN users u ON vl.admin_id = u.id
             WHERE vl.report_id = $1
             ORDER BY vl.created_at DESC;`,
            [id]
          );
          logs = logsRes.rows;
        }
      } catch (err) {
        console.warn('⚠️ [PG_REPORT_DETAIL_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    if (!report && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      const { data, error } = await supabase
        .from('reports')
        .select('*, river_segments(name), verification_logs(*)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        report = data;
        logs = data.verification_logs || [];
      }
    }

    if (!report) {
      return errorResponse(res, `Laporan dengan ID "${id}" tidak ditemukan.`, null, 404);
    }

    return successResponse(res, 'Detail laporan berhasil dimuat', {
      ...report,
      verification_logs: logs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. PATCH /api/v1/admin/reports/:id/verify
 * Memverifikasi laporan menjadi 'valid' atau 'ditolak' dan mencatat log audit
 */
const verifyReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason, notes } = req.body;

    // Normalisasi: dukung 'diverifikasi' -> 'valid'
    const targetStatus = status === 'diverifikasi' ? 'valid' : status;

    if (!['valid', 'ditolak'].includes(targetStatus)) {
      return errorResponse(
        res,
        "Status verifikasi harus bernilai 'valid' atau 'ditolak'.",
        [{ field: 'status', message: "Hanya menerima 'valid' atau 'ditolak'" }],
        400
      );
    }

    if (targetStatus === 'ditolak' && (!rejection_reason && !notes)) {
      return errorResponse(
        res,
        'Alasan penolakan (rejection_reason) wajib diisi jika laporan ditolak.',
        [{ field: 'rejection_reason', message: 'Alasan penolakan wajib disertakan' }],
        400
      );
    }

    let previousStatus = 'menunggu';
    let updatedReport = null;

    // A. Ambil status laporan saat ini
    if (pool) {
      try {
        const cur = await query('SELECT status FROM reports WHERE id = $1 LIMIT 1;', [id]);
        if (cur.rows.length === 0) {
          return errorResponse(res, `Laporan dengan ID "${id}" tidak ditemukan.`, null, 404);
        }
        previousStatus = cur.rows[0].status;

        // B. Update status laporan
        const updateText = `
          UPDATE reports
          SET status = $1, rejection_reason = $2, updated_at = NOW()
          WHERE id = $3
          RETURNING *;
        `;
        const updateRes = await query(updateText, [
          targetStatus,
          targetStatus === 'ditolak' ? (rejection_reason || notes) : null,
          id,
        ]);
        updatedReport = updateRes.rows[0];

        // C. Catat Log Audit ke verification_logs
        // Cari admin ID (jika req.admin.id tidak valid UUID, gunakan admin pertama dari DB)
        let adminId = req.admin?.id;
        if (!adminId || adminId.startsWith('admin-default')) {
          const adm = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1;");
          if (adm.rows.length > 0) adminId = adm.rows[0].id;
        }

        if (adminId) {
          const logText = `
            INSERT INTO verification_logs (report_id, admin_id, previous_status, new_status, notes)
            VALUES ($1, $2, $3, $4, $5);
          `;
          await query(logText, [
            id,
            adminId,
            previousStatus,
            targetStatus,
            notes || (targetStatus === 'ditolak' ? rejection_reason : 'Laporan diverifikasi valid oleh admin'),
          ]);
        }

        return successResponse(
          res,
          `Status laporan berhasil diperbarui menjadi ${targetStatus}`,
          updatedReport
        );
      } catch (err) {
        console.warn('⚠️ [PG_VERIFY_FAIL] Mencoba via Supabase Client:', err.message);
      }
    }

    // Fallback via Supabase Client
    const { data: curReport } = await supabase.from('reports').select('status').eq('id', id).maybeSingle();
    previousStatus = curReport?.status || 'menunggu';

    const { data: updated, error: upErr } = await supabase
      .from('reports')
      .update({
        status: targetStatus,
        rejection_reason: targetStatus === 'ditolak' ? (rejection_reason || notes) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (upErr) throw upErr;

    // Log ke verification_logs jika ada admin_id
    if (req.admin?.id && !req.admin.id.startsWith('admin-default')) {
      await supabase.from('verification_logs').insert({
        report_id: id,
        admin_id: req.admin.id,
        previous_status: previousStatus,
        new_status: targetStatus,
        notes: notes || rejection_reason || null,
      });
    }

    return successResponse(
      res,
      `Status laporan berhasil diperbarui menjadi ${targetStatus}`,
      updated
    );
  } catch (err) {
    next(err);
  }
};

/**
 * 4. GET /api/v1/admin/reports/export
 * Ekspor data rekapitulasi laporan ke format Excel (.xlsx) atau PDF (.pdf)
 */
const exportReports = async (req, res, next) => {
  try {
    const { format = 'excel', status, district } = req.query;

    let reports = [];

    if (pool) {
      try {
        let text = 'SELECT * FROM reports WHERE 1=1';
        const params = [];
        let idx = 1;

        if (status) {
          const normStatus = status === 'diverifikasi' ? 'valid' : status;
          text += ` AND status = $${idx++}`;
          params.push(normStatus);
        }
        if (district) {
          text += ` AND district = $${idx++}`;
          params.push(district);
        }

        text += ' ORDER BY created_at DESC;';
        const result = await query(text, params);
        reports = result.rows;
      } catch (err) {
        console.warn('⚠️ [PG_EXPORT_FAIL] Mengalihkan ke Supabase client:', err.message);
      }
    }

    if (reports.length === 0 && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      let sbQuery = supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (status) {
        const normStatus = status === 'diverifikasi' ? 'valid' : status;
        sbQuery = sbQuery.eq('status', normStatus);
      }
      if (district) sbQuery = sbQuery.eq('district', district);

      const { data, error } = await sbQuery;
      if (!error && data) reports = data;
    }

    const isPdf = (format || '').toLowerCase() === 'pdf';

    if (isPdf) {
      const pdfBuffer = await generatePDF(reports);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Rekap_Advokasi_SIPEPES.pdf"');
      return res.send(pdfBuffer);
    } else {
      const excelBuffer = await generateExcel(reports);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename="Rekap_Advokasi_SIPEPES.xlsx"');
      return res.send(excelBuffer);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminReports,
  getReportById,
  verifyReport,
  exportReports,
};
