const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

/**
 * Route Statistik & Ringkasan Metrik Dashboard
 */

// GET /api/v1/stats/summary (Metrik Utama & Ringkasan)
router.get('/summary', statsController.getDashboardStats);

// GET /api/v1/stats/trends (Komposisi Kategori & Grafik Tren Mingguan)
router.get('/trends', statsController.getDashboardTrends);

module.exports = router;
