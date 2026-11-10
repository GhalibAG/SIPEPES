const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth');
const { login, getMe } = require('../controllers/authController');

/**
 * Route Autentikasi Admin Komunitas (GG River Care)
 */

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me (Terproteksi)
router.get('/me', verifyAdminToken, getMe);

module.exports = router;
