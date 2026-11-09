const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');

// Import Controller Dashboard
const { getUrgentReports } = require('../controllers/dashboardController');

// Import Controller Manajemen Laporan Admin
const { getAdminReports, verifyReport, exportReports } = require('../controllers/adminReportController');

/**
 * Route Khusus Admin Komunitas (GG River Care)
 * Bagian Backend: Crespo Silaban
 * Seluruh endpoint diproteksi oleh verifyAdminToken
 */
router.use(verifyAdminToken);

// 1. GET /api/v1/admin/urgent-reports - Daftar laporan mendesak untuk Dashboard
router.get('/urgent-reports', getUrgentReports);

// 2. GET /api/v1/admin/reports/export - Unduh berkas rekap PDF / Excel
// PENTING: Diletakkan di atas '/reports/:id' agar tidak bentrok
router.get('/reports/export', exportReports);

// 3. GET /api/v1/admin/reports - Daftar seluruh laporan (filter status, pagination)
router.get('/reports', getAdminReports);

// 4. GET /api/v1/admin/reports/:id - Detail laporan & riwayat verifikasi
router.get('/reports/:id', getAdminReports);

// 5. PATCH /api/v1/admin/reports/:id/verify - Verifikasi (valid / ditolak) + insert audit log
router.patch('/reports/:id/verify', verifyReport);

module.exports = router;