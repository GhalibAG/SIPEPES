// server/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
        }

        // 1. Cari admin berdasarkan email di tabel 'admins'
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return res.status(401).json({ success: false, message: 'Kredensial email atau password salah' });
        }

        // 2. Verifikasi kesesuaian password input dengan hash di database
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Kredensial email atau password salah' });
        }

        // 3. Susun payload dan buat Token JWT
        const payload = {
            id: admin.id,
            email: admin.email,
            role: admin.role || 'admin'
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Sesi login berlaku selama 8 jam
        );

        // 4. Kembalikan response sukses beserta token
        return successResponse(res, 'Login berhasil', {
            token,
            user: payload
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { login };