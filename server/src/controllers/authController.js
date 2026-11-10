const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_sipepes_musilaban_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Handler POST /api/v1/auth/login
 * Autentikasi Admin Komunitas (GG River Care)
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email dan password wajib diisi.', [
        { field: !email ? 'email' : 'password', message: 'Kolom ini tidak boleh kosong' },
      ], 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    // 1. Cari pengguna dari database PostgreSQL (Pool)
    if (pool) {
      try {
        const text = 'SELECT * FROM users WHERE LOWER(email) = $1 AND is_active = true LIMIT 1;';
        const result = await query(text, [cleanEmail]);
        if (result.rows.length > 0) {
          user = result.rows[0];
        }
      } catch (err) {
        console.warn('⚠️ [PG_AUTH_FALLBACK] Mencoba via Supabase Client:', err.message);
      }
    }

    // 2. Fallback via Supabase Client
    if (!user && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          user = data;
        }
      } catch (err) {
        console.warn('⚠️ [SUPABASE_AUTH_FAIL]:', err.message);
      }
    }

    // 3. Fallback dev mock jika database belum ter-seed
    if (!user && cleanEmail === 'admin@sipepes.com') {
      const mockHash = await bcrypt.hash('admin123', 10);
      user = {
        id: 'admin-default-01',
        email: 'admin@sipepes.com',
        password_hash: mockHash,
        full_name: 'Admin GG River Care',
        role: 'admin',
        is_active: true,
      };
    }

    if (!user) {
      return errorResponse(res, 'Kredensial email atau password salah.', null, 401);
    }

    // 4. Verifikasi Password Hash dengan Bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return errorResponse(res, 'Kredensial email atau password salah.', null, 401);
    }

    // 5. Buat JWT Token
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role || 'admin',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return successResponse(res, 'Login berhasil. Selamat datang di Portal Admin SIPEPES.', {
      token,
      user: payload,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handler GET /api/v1/auth/me
 * Mengambil profil admin yang sedang login
 */
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 'Profil admin terautentikasi', req.admin);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getMe,
};
