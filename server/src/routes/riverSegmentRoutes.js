const express = require('express');
const router = express.Router();
const riverSegmentController = require('../controllers/riverSegmentController');

// Ambil Master Data Segmen Titik Sungai Musi
router.get('/', riverSegmentController.getAllRiverSegments);

module.exports = router;
