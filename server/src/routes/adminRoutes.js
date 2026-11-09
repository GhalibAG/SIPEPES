const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const { successResponse } = require('../utils/response');

/**
 * Route Khusus Admin Komunitas (GG River Care)
 * Bagian Backend: Crespo Silaban
 * Seluruh endpoint diproteksi oleh verifyAdminToken
 */
router.use(verifyAdminToken);

// 1. GET /api/v1/admin/reports - Daftar seluruh laporan (filter status, search, pagination)
router.get('/reports', async (req, res) => {
  return successResponse(res, 'Daftar laporan admin (Sedang dikembangkan oleh Crespo)', []);
});

// 2. GET /api/v1/admin/reports/:id - Detail laporan & riwayat verifikasi
router.get('/reports/:id', async (req, res) => {
  return successResponse(res, `Detail laporan ${req.params.id} (Sedang dikembangkan oleh Crespo)`, { id: req.params.id });
});

// 3. PATCH /api/v1/admin/reports/:id/verify - Verifikasi (valid / ditolak) + insert audit log
router.patch('/reports/:id/verify', async (req, res) => {
  return successResponse(res, `Verifikasi laporan ${req.params.id} berhasil`, {
    id: req.params.id,
    status: req.body.status || 'valid',
    verified_by: req.admin?.email || 'admin',
    updated_at: new Date().toISOString(),
  });
});

// 4. GET /api/v1/admin/reports/export - Unduh berkas rekap PDF / Excel
router.get('/reports/export', async (req, res) => {
  return successResponse(res, 'Export laporan (Sedang dikembangkan oleh Crespo)', null);
});

module.exports = router;
