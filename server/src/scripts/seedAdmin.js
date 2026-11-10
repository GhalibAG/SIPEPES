const bcrypt = require('bcryptjs');
const { pool, query } = require('../config/database');
const supabase = require('../config/supabase');
require('dotenv').config();

const seedAdmin = async () => {
  const email = 'admin@sipepes.com';
  const password = 'admin123';
  const fullName = 'Admin GG River Care';
  const role = 'admin';

  console.log('🔄 Memulai seeding akun admin SIPEPES...');

  const passwordHash = await bcrypt.hash(password, 10);

  if (pool) {
    try {
      const checkText = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1);';
      const checkRes = await query(checkText, [email]);

      if (checkRes.rows.length === 0) {
        const insertText = `
          INSERT INTO users (email, password_hash, full_name, role, is_active)
          VALUES ($1, $2, $3, $4, true)
          RETURNING id, email, full_name, role;
        `;
        const insertRes = await query(insertText, [email, passwordHash, fullName, role]);
        console.log('✅ Akun Admin berhasil dibuat di PostgreSQL:', insertRes.rows[0]);
      } else {
        const updateText = `
          UPDATE users SET password_hash = $1, is_active = true WHERE LOWER(email) = LOWER($2)
          RETURNING id, email, full_name, role;
        `;
        const updateRes = await query(updateText, [passwordHash, email]);
        console.log('✅ Password Akun Admin berhasil diperbarui di PostgreSQL:', updateRes.rows[0]);
      }
      return;
    } catch (err) {
      console.warn('⚠️ Gagal via pool, mencoba via Supabase client:', err.message);
    }
  }

  if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();

    if (!existing) {
      const { data, error } = await supabase.from('users').insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role,
        is_active: true,
      }).select().single();

      if (error) console.error('❌ Gagal seed via Supabase:', error.message);
      else console.log('✅ Akun Admin berhasil dibuat di Supabase:', data);
    } else {
      const { data, error } = await supabase.from('users').update({
        password_hash: passwordHash,
        is_active: true,
      }).eq('email', email).select().single();

      if (error) console.error('❌ Gagal update via Supabase:', error.message);
      else console.log('✅ Password Admin berhasil diperbarui di Supabase:', data);
    }
  }
};

if (require.main === module) {
  seedAdmin().then(() => {
    if (pool) pool.end();
  });
}

module.exports = seedAdmin;
