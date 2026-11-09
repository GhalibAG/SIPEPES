const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/response');
const { login } = require('../controllers/authControllers');
/**
 * Route Autentikasi Admin Komunitas (GG River Care)
 * Bagian Backend: Crespo Silaban
 */

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me (Terproteksi)
router.get('/me', verifyAdminToken, async (req, res) => {
  return successResponse(res, 'Profil admin terautentikasi', req.admin);
});

module.exports = router;
