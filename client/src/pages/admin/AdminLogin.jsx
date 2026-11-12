import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Droplets, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import PartnerLogo from '../../components/PartnerLogo';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function AdminLogin() {
  const { login, adminUser } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@sipepes.or.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Jika sudah login, langsung alihkan ke /admin
  React.useEffect(() => {
    if (adminUser) {
      navigate('/admin', { replace: true });
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg(res.message || 'Email atau kata sandi tidak sesuai.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-abu-100 font-sans">
      {/* ========================================================
          KOLOM KIRI: PANEL UNGU KOMUNITAS (Desktop >= 1024px)
         ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-ungu-600 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        {/* Hiasan Gumpalan / Gelombang SVG Lembut */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="none">
            <circle cx="450" cy="80" r="180" fill="white" />
            <circle cx="80" cy="420" r="220" fill="white" />
          </svg>
        </div>

        {/* Header Kiri */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
            <Droplets className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight block">SIPEPES</span>
            <span className="text-xs text-white/80 font-semibold block">GG River Care</span>
          </div>
        </div>

        {/* Konten Utama Kiri */}
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-block bg-white p-1 rounded-2xl shadow-lg">
            <PartnerLogo size={64} />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Portal Admin &amp; Relawan GG River Care
            </h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
              Verifikasi laporan warga, pantau sebaran titik pencemaran sempadan Musi, dan kelola berkas advokasi lingkungan secara mandiri.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-toska-400 shrink-0" />
              <span>Validasi cepat foto bukti dan koordinat sempadan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-toska-400 shrink-0" />
              <span>Pemutakhiran titik peta publik secara otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-toska-400 shrink-0" />
              <span>Ekspor laporan eksekutif PDF &amp; data Excel advokasi</span>
            </div>
          </div>
        </div>

        {/* Footer Kiri */}
        <div className="relative z-10 text-xs text-white/70">
          &copy; 2026 Green Generation Palembang &bull; Program GG River Care
        </div>
      </div>

      {/* ========================================================
          KOLOM KANAN: FORM LOGIN BERSIH (Desktop & Mobile)
         ======================================================== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Tombol Kembali ke Portal Warga */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Warga</span>
          </Link>

          {/* Form Card */}
          <Card className="p-6 sm:p-10 space-y-6 shadow-lembut bg-white">
            {/* Header Form di Mobile (Menampilkan Logo GGP) */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="lg:hidden flex items-center justify-center sm:justify-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-ungu-600 flex items-center justify-center text-white">
                  <Droplets className="w-5 h-5" />
                </div>
                <PartnerLogo size={40} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Masuk Sesi Admin
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft mt-1">
                  Gunakan email dan kata sandi admin komunitasmu.
                </p>
              </div>
            </div>

            {/* Pesan Error Login */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-tingkat-berat-bg border border-tingkat-berat-tx/20 text-xs font-bold text-tingkat-berat-tx animate-fade-in">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Email (FR-1) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Email Admin
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sipepes.or.id"
                  className="w-full h-12 px-4 rounded-2xl border border-garis bg-slate-50 text-sm font-semibold text-ink focus:outline-none focus:bg-white focus:border-ungu-600 focus:ring-4 focus:ring-ungu-100 transition placeholder:text-ink-muted"
                />
              </div>

              {/* Input Kata Sandi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Kata Sandi
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full h-12 pl-4 pr-12 rounded-2xl border border-garis bg-slate-50 text-sm font-semibold text-ink focus:outline-none focus:bg-white focus:border-ungu-600 focus:ring-4 focus:ring-ungu-100 transition placeholder:text-ink-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="utama"
                  size="md"
                  disabled={isLoading}
                  className="w-full bg-ungu-600 hover:bg-ungu-800 text-white shadow-lembut"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}</span>
                </Button>
              </div>
            </form>

            <div className="pt-3 border-t border-garis text-center text-xs text-ink-muted">
              Belum punya akun admin? Hubungi koordinator GG River Care.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
