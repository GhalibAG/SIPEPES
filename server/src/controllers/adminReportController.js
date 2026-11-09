// server/src/controllers/adminReportController.js
const supabase = require('../config/supabase');
const { successResponse } = require('../utils/response');
const { generateExcel, generatePDF } = require('../services/exportService');

/**
 * 1. GET /api/v1/admin/reports
 * Mengambil daftar seluruh laporan dengan filter status, kecamatan (district), dan paginasi
 */
const getAdminReports = async (req, res, next) => {
  try {
    const { status, district, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Inisialisasi query ke tabel reports
    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' });

    // Filter berdasarkan status jika ada (misal: ?status=menunggu)
    if (status) {
      query = query.eq('status', status);
    }

    // Filter berdasarkan kecamatan/district jika ada (misal: ?district=Seberang+Ulu+I)
    if (district) {
      query = query.ilike('address_landmark', `%${district}%`);
    }

    // Urutkan dari laporan terbaru & terapkan paginasi (range)
    const { data: reports, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw new Error(`Gagal mengambil data laporan: ${error.message}`);

    return successResponse(res, 'Daftar laporan admin berhasil dimuat', {
      reports: reports || [],
      pagination: {
        total_data: count || 0,
        current_page: pageNum,
        total_page: Math.ceil((count || 0) / limitNum),
        limit: limitNum
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 2. PATCH /api/v1/admin/reports/:id/verify
 * Verifikasi laporan (Diverifikasi/Ditolak) & mencatat log audit ke verification_logs
 */
const verifyReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason, notes } = req.body;

    // Normalisasi input status: 'valid' disesuaikan menjadi 'diverifikasi'
    const targetStatus = status === 'valid' ? 'diverifikasi' : status;

    // Validasi pilihan status
    if (!['diverifikasi', 'ditolak'].includes(targetStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: "Status verifikasi harus bernilai 'diverifikasi', 'valid', atau 'ditolak'" 
      });
    }

    // Validasi alasan penolakan jika status ditolak
    if (targetStatus === 'ditolak' && !rejection_reason) {
      return res.status(400).json({ 
        success: false, 
        message: "Alasan penolakan (rejection_reason) wajib diisi jika laporan ditolak." 
      });
    }

    // A. Update status laporan di tabel reports
    const { data: updatedReport, error: updateError } = await supabase
      .from('reports')
      .update({
        status: targetStatus,
        rejection_reason: targetStatus === 'ditolak' ? rejection_reason : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw new Error(`Gagal memperbarui laporan: ${updateError.message}`);

    // B. Buat entri log verifikasi baru di tabel verification_logs
    const { error: logError } = await supabase
      .from('verification_logs')
      .insert({
        report_id: id,
        admin_id: req.admin?.id || null,
        admin_email: req.admin?.email || 'admin@sipepes.com',
        action: targetStatus,
        rejection_reason: targetStatus === 'ditolak' ? rejection_reason : null,
        notes: notes || null,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn("Peringatan: Gagal mencatat log verifikasi:", logError.message);
    }

    return successResponse(res, `Laporan #${id} berhasil di-${targetStatus}`, updatedReport);

  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET /api/v1/admin/reports/export
 * Mengekspor data laporan ke format Excel atau PDF berdasarkan query format
 */
const exportReports = async (req, res, next) => {
  try {
    const { format = 'excel', status, district } = req.query;

    // Ambil data dari database untuk diekspor
    let query = supabase.from('reports').select('*').order('created_at', { ascending: false });

    // Filter yang sama dengan halaman list agar file yang diunduh sesuai dengan tampilan admin
    if (status) query = query.eq('status', status);
    if (district) query = query.ilike('address_landmark', `%${district}%`);

    const { data: reports, error } = await query;
    if (error) throw new Error(`Gagal mengambil data untuk ekspor: ${error.message}`);

    // Proses pembuatan file sesuai format yang diminta
    if (format === 'pdf') {
      const pdfBuffer = await generatePDF(reports || []);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Rekap_SIPEPES.pdf"');
      return res.send(pdfBuffer);
    } else {
      const excelBuffer = await generateExcel(reports || []);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Rekap_SIPEPES.xlsx"');
      return res.send(excelBuffer);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminReports,
  verifyReport,
  exportReports
};