const ReportModel = require('../models/reportModel');
const { generateTrackingCode } = require('../utils/trackingCode');
const { processAndUploadPhoto } = require('../utils/uploader');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Handler POST /api/v1/reports
 * Mengirim laporan pencemaran baru warga + upload bukti foto
 */
const createReport = async (req, res, next) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      district,
      address_landmark,
      pollution_type,
      estimated_severity,
      reporter_name,
      reporter_phone,
      river_segment_id,
    } = req.body;

    // 1. Kompresi & Upload Foto Bukti
    const { photoUrl, thumbnailUrl } = await processAndUploadPhoto(
      req.file.buffer,
      req.file.originalname,
      'reports'
    );

    // 2. Buat Tracking Code Unik
    const trackingCode = generateTrackingCode();

    // 3. Simpan ke Database
    const reportData = {
      tracking_code: trackingCode,
      reporter_name: reporter_name && reporter_name.trim() !== '' ? reporter_name.trim() : 'Warga Peduli',
      reporter_phone: reporter_phone ? reporter_phone.trim() : null,
      title: title.trim(),
      description: description.trim(),
      photo_url: photoUrl,
      thumbnail_url: thumbnailUrl,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address_landmark: address_landmark ? address_landmark.trim() : null,
      district: district.trim(),
      pollution_type,
      estimated_severity,
      river_segment_id: river_segment_id || null,
    };

    const createdReport = await ReportModel.create(reportData);

    return successResponse(
      res,
      'Laporan berhasil dikirim dan sedang menunggu verifikasi admin.',
      {
        id: createdReport.id,
        tracking_code: createdReport.tracking_code,
        status: createdReport.status || 'menunggu',
        created_at: createdReport.created_at,
      },
      undefined,
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Handler GET /api/v1/reports
 * Mengambil daftar titik pencemaran tervalidasi untuk peta dan katalog publik
 */
const getPublicReports = async (req, res, next) => {
  try {
    const { severity, district, start_date, end_date } = req.query;

    const reports = await ReportModel.findPublic({
      severity,
      district,
      start_date,
      end_date,
    });

    return successResponse(
      res,
      'Berhasil memuat titik pencemaran',
      reports,
      { total: reports.length }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Handler GET /api/v1/reports/track/:code
 * Melacak status laporan berdasarkan Tracking Code
 */
const getReportByTrackingCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code || code.trim() === '') {
      return errorResponse(res, 'Kode tiket pelacakan wajib disertakan.', null, 400);
    }

    const report = await ReportModel.findByTrackingCode(code.trim().toUpperCase());

    if (!report) {
      return errorResponse(
        res,
        `Laporan dengan kode tiket "${code}" tidak ditemukan. Pastikan format penulisan benar (misal: SPP-202611-0001).`,
        null,
        404
      );
    }

    return successResponse(
      res,
      'Status laporan berhasil ditemukan',
      report
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReport,
  getPublicReports,
  getReportByTrackingCode,
};
