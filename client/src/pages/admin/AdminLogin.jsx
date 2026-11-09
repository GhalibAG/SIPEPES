import React, { useState } from 'react';
import { Waves, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin({ onBackToPublic }) {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@sipepes.or.id');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sisi Kiri: Branding & Visual Hijau/Biru Sungai Musi (Layar 1 Figma) */}
      <div className="md:w-5/12 bg-gradient-to-br from-river-600 via-river-700 to-river-800 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Aksen Air */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="absolute left-10 top-1/3 w-60 h-60 rounded-full bg-eco-500/10 blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div>
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Portal Warga
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
              <Waves className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight flex items-center gap-2">
                SIPEPES
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-500 text-white">
                  GG River Care
                </span>
              </span>
              <p className="text-xs text-sky-100 font-medium">
                Sistem Pelaporan Pencemaran Sungai Musi
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
            Portal Verifikasi & Advokasi Komunitas
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm leading-relaxed max-w-sm">
            Area khusus bagi tim relawan Green Generation Palembang (Divisi PKL) untuk memverifikasi laporan masyarakat, memantau titik peta, dan mengunduh rekapitulasi data.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="space-y-3 pt-8 border-t border-white/10 text-xs text-sky-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-eco-400" />
            <span>Validasi foto & koordinat GPS akurat</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-eco-400" />
            <span>Ekspor rekap resmi untuk Dinas Lingkungan Hidup</span>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form Card Login */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-river-600">
              Autentikasi Petugas
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Masuk Dashboard Admin
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan kredensial pengurus terdaftar untuk mengakses data.
            </p>
          </div>

          {/* Alert Error jika ada */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@sipepes.or.id"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-river-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-river-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-md shadow-river-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              {isLoading ? (
                'Memverifikasi Akses...'
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Hint Akun Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 p-3 rounded-xl border text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">Kredensial Demo Pengujian:</p>
            <div className="font-mono text-slate-600 space-y-0.5">
              <p>Email: <strong className="text-river-700">admin@sipepes.or.id</strong></p>
              <p>Password: <strong className="text-river-700">admin123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
