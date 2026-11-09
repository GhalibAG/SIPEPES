const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Route Autentikasi Admin Komunitas (GG River Care)
 * Bagian Backend: Crespo Silaban
 */

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  // Placeholder: Crespo akan mengimplementasikan verifikasi bcrypt & JWT sign
  return successResponse(res, 'Endpoint login admin (Sedang dikembangkan oleh Crespo)', {
    token: 'jwt-token-placeholder',
    user: { email: req.body.email || 'admin@sipepes.or.id', role: 'admin' },
  });
});

// GET /api/v1/auth/me (Terproteksi)
router.get('/me', verifyAdminToken, async (req, res) => {
  return successResponse(res, 'Profil admin terautentikasi', req.admin);
});

module.exports = router;
