import React, { useState } from 'react';
import { Waves, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin({ onBackToPublic }) {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@sipepes.or.id');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
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
    }, 300);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Aksen Diagonal Biru Kanan (Sesuai Layar 1 Figma) */}
      <div
        className="hidden md:block absolute top-0 right-0 w-[42%] h-full bg-river-600 z-0"
        style={{
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'
        }}
      />
      {/* Garis Aksen Biru Muda Tipis di Samping Aksen Biru */}
      <div
        className="hidden md:block absolute top-0 right-[41.5%] w-8 h-full bg-river-300/40 z-0"
        style={{
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'
        }}
      />

      {/* Kontainer Utama */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Kolom Kiri: Branding Teks SIPEPES */}
        <div className="max-w-md w-full text-left">
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-river-600 hover:text-river-700 transition mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Halaman Publik</span>
          </button>

          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-river-600 flex items-center justify-center text-white shadow-md shadow-river-600/25">
              <Waves className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                SIPEPES
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-100 text-eco-700 border border-eco-200">
                  GG River Care
                </span>
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Kota Palembang, Sumatera Selatan
              </p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
            Sistem Informasi Pelaporan Pencemaran Sungai
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Portal otentikasi tim verifikator Green Generation Palembang untuk memvalidasi bukti temuan pencemaran air dan menyusun berkas audiensi.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-eco-600 shrink-0" />
            <span>Akses khusus admin berwenang (Divisi PKL)</span>
          </div>
        </div>

        {/* Kolom Kanan: Card Floating Login (Sesuai Layar 1 Figma) */}
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-300/60">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Masuk Akun Admin
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan email dan kata sandi pengurus
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@sipepes.or.id"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-river-500 transition"
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-river-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-river-600 focus:ring-river-500"
                />
                <span>Ingat saya</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Kredensial demo: admin@sipepes.or.id / admin123'); }} className="text-river-600 hover:underline">
                Lupa sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-md shadow-river-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                'Memverifikasi...'
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Info Akun Demo */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Akun default: <code className="text-slate-700 font-mono font-semibold">admin@sipepes.or.id</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
