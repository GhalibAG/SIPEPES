const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const adminReportController = require('../controllers/adminReportController');
const { getUrgentReports } = require('../controllers/statsController');

/**
 * Route Khusus Admin Komunitas (GG River Care)
 * Seluruh endpoint diproteksi oleh verifyAdminToken
 */
router.use(verifyAdminToken);

// 1. GET /api/v1/admin/urgent-reports - Daftar laporan mendesak untuk Dashboard
router.get('/urgent-reports', getUrgentReports);

// 2. GET /api/v1/admin/reports/export - Unduh berkas rekap PDF / Excel
router.get('/reports/export', adminReportController.exportReports);

// 3. GET /api/v1/admin/reports - Daftar seluruh laporan (filter status, search, pagination)
router.get('/reports', adminReportController.getAdminReports);

// 4. GET /api/v1/admin/reports/:id - Detail lengkap laporan & riwayat verifikasi
router.get('/reports/:id', adminReportController.getReportById);

// 5. PATCH /api/v1/admin/reports/:id/verify - Verifikasi (valid / ditolak) + insert audit log
router.patch('/reports/:id/verify', adminReportController.verifyReport);

module.exports = router;
