const express = require('express');
const router = express.Router();

const reportRoutes = require('./reportRoutes');
const riverSegmentRoutes = require('./riverSegmentRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const statsRoutes = require('./statsRoutes');

// Rute Publik (Aplikasi Warga - Naufal)
router.use('/reports', reportRoutes);
router.use('/river-segments', riverSegmentRoutes);

// Rute Dashboard Admin (Crespo)
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
