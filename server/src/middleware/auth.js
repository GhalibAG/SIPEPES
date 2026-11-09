const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_sipepes_musilaban_2026';

/**
 * Middleware Autentikasi Admin Komunitas (GG River Care)
 * Disiapkan untuk endpoint terproteksi (Dashboard Admin)
 */
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Akses ditolak. Token otentikasi tidak ditemukan.', null, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Sesi login telah kedaluwarsa. Silakan login kembali.', null, 401);
    }
    return errorResponse(res, 'Token otentikasi tidak valid.', null, 403);
  }
};

module.exports = {
  verifyAdminToken,
};
