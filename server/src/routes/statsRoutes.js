const express = require('express');
const router = express.Router();
const { successResponse } = require('../utils/response');

/**
 * Route Statistik & Ringkasan Metrik Dashboard
 * Bagian Backend: Crespo Silaban
 */

// GET /api/v1/stats/summary
router.get('/summary', async (req, res) => {
  return successResponse(res, 'Statistik ringkasan laporan berhasil dimuat', {
    total_reports: 24,
    pending_reports: 4,
    verified_reports: 18,
    rejected_reports: 2,
    by_severity: {
      berat: 5,
      sedang: 12,
      ringan: 7,
    },
    by_pollution_type: {
      sampah_domestik: 14,
      limbah_industri: 6,
      minyak_oli: 3,
      lainnya: 1,
    },
  });
});

module.exports = router;
