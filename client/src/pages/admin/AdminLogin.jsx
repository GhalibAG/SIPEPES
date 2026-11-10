import React, { useState } from 'react';
import { Eye, EyeOff, Droplets } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin({ onSwitchToWarga }) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('19890412-GG-042');
  const [password, setPassword] = useState('admin123');
  const [accountName, setAccountName] = useState('DLH Palembang × GG River Care');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(username, password, accountName);
      if (!res.success) {
        setErrorMsg(res.message || 'Login gagal. Periksa kembali NIP/Username dan password.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-between overflow-hidden bg-[#eef2f6]">
      {/* Background Geometris Miring Sesuai Desain Figma */}
      <div 
        className="absolute top-0 right-0 h-full w-[42%] bg-[#0088cc] hidden lg:block"
        style={{
          clipPath: 'polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)'
        }}
      />
      {/* Garis Aksen Biru Muda Tipis di Belakang Sisi Miring */}
      <div 
        className="absolute top-0 right-[39%] h-full w-[5%] bg-[#38bdf8]/40 hidden lg:block"
        style={{
          clipPath: 'polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)'
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 py-8 sm:py-12">
        {/* Kolom Kiri: Brand & Tagline */}
        <div className="max-w-xl text-left w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#bae6fd] flex items-center justify-center text-[#0284c7] shadow-sm shrink-0">
              <Droplets className="w-6 h-6 sm:w-7 sm:h-7 fill-[#0284c7]/20" />
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e293b] tracking-tight">
                SIPEPES
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#38bdf8]">
                Enterprise
              </span>
            </div>
          </div>
          <p className="text-slate-600 text-sm sm:text-lg lg:text-xl font-normal mt-1 sm:mt-2 tracking-normal">
            Your Unified Musi River Monitoring Platform.
          </p>
        </div>

        {/* Kolom Kanan: Card Login */}
        <div className="w-full max-w-[450px]">
          {onSwitchToWarga && (
            <button
              onClick={onSwitchToWarga}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold shadow-xs mb-3 transition border border-slate-200/80 cursor-pointer"
            >
              <span>&larr; Kembali ke Beranda Warga</span>
            </button>
          )}

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-10">
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username / NIP */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Username / NIP
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan NIP atau ID Petugas"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition placeholder:text-slate-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition pr-11 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Account Name / Unit Kerja */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Account Name / Unit Kerja
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Contoh: DLH Palembang × GG River Care"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition placeholder:text-slate-300"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0088cc] focus:ring-[#0088cc] border-slate-300"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-[#0088cc] hover:underline font-medium"
                >
                  Forgot your info?
                </button>
              </div>

              {/* Tombol Sign In */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold text-sm shadow-md shadow-[#0088cc]/20 transition disabled:opacity-70 mt-2"
              >
                {isLoading ? 'Memverifikasi Kredensial...' : 'Sign In'}
              </button>

              {/* Separator OR */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                  OR
                </span>
              </div>

              {/* SAML SSO */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} })}
                  className="text-xs font-medium text-[#0088cc] hover:underline"
                >
                  Log in with email (SAML SSO)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Version di pojok kanan bawah */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 sm:text-white/80 select-none z-20">
        VERSION 2.4.0
      </div>
    </div>
  );
}
