import React, { useState } from 'react';
import {
  Droplets,
  Megaphone,
  User,
  Menu,
  X,
  ShieldAlert,
  AlertTriangle,
  Info,
  Phone,
  Compass,
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function WargaLayout({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { stats } = useAdmin();

  const navItems = [
    { id: 'home', label: 'Beranda & Peta', icon: Compass },
    { id: 'report', label: 'Lapor Pencemaran', icon: FileText },
    { id: 'track', label: 'Lacak Laporan', icon: Search },
    { id: 'guide', label: 'Panduan & Edukasi', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Publik Warga */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Identitas Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0088cc] flex items-center justify-center text-white shadow-md shadow-[#0088cc]/20 transition-transform group-hover:scale-105">
              <Droplets className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  SIPEPES
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                  PALEMBANG
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                Green Generation River Care
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition relative ${
                    isActive
                      ? 'text-[#0088cc]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-[-18px] left-3.5 right-3.5 h-[2.5px] bg-[#0088cc] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Kanan: Widget Barometer + Tombol Lapor + Login Admin */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Widget Barometer IKA Desktop */}
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  BAROMETER MUSI
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Cemas / Sedang (IKA 58.4)
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  LAPORAN AKTIF
                </span>
                <span className="font-mono font-extrabold text-[#0088cc]">
                  24 Insiden
                </span>
              </div>
            </div>

            {/* Tombol CTA Lapor Sekarang */}
            <button
              onClick={() => setActiveTab('report')}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0088cc]/20 transition"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Lapor Sekarang</span>
            </button>

            {/* Tombol Akses Portal Admin */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Buka Portal Admin SIPEPES"
            >
              <User className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Hamburger Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub Bar: Barometer Musi IKA (Compact Mobile) */}
        <div className="md:hidden bg-amber-50/80 border-t border-amber-200/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-900 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span className="truncate">
              <strong>Barometer Musi:</strong> IKA 58.4 (Cemar Sedang)
            </span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold shrink-0 ml-1">
            Palembang Hari Ini
          </span>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-fade-in shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-sky-50 text-[#0088cc]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Akses Pengelola Komunitas</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Portal Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Banner Peringatan Kualitas Air (Desktop & Tablet) */}
      <section className="bg-white border-b border-slate-200/80 py-3 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200">
                    PENGADUAN CEPAT WARGA MUSI
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    &bull; Terkoneksi Command Center DLH Palembang
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Kualitas Air Musi:{' '}
                  <span className="text-amber-600 font-extrabold">
                    Cemar Sedang (Indeks IKA 58.4)
                  </span>{' '}
                  — Waspada Limbah Minyak &amp; Plastik
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={() => alert('Rujukan Standar Baku Mutu Air Nasional: PP No. 22 Tahun 2021 Lampiran VI.')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
              >
                <Info className="w-3.5 h-3.5 text-[#0088cc]" />
                <span>Baku Mutu PP 22/2021</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Lapor Darurat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Dynamic Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* 4. Footer Resmi Publik SIPEPES */}
      <footer className="bg-white border-t border-slate-200 pt-10 pb-8 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200/80">
            {/* Kolom 1: Profil Inisiatif */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0088cc] flex items-center justify-center text-white shadow-xs">
                  <Droplets className="w-4 h-4 fill-white/20" />
                </div>
                <div>
                  <span className="font-black text-slate-900 text-base">SIPEPES</span>{' '}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    PALEMBANG
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Sistem Pemantauan Pencemaran Sungai. Inisiatif kolaborasi keterbukaan informasi publik antara Dinas Lingkungan Hidup Kota Palembang, Balai Wilayah Sungai Sumatera VIII, dan relawan Green Generation.
              </p>
            </div>

            {/* Kolom 2: Akses Layanan Warga */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                AKSES LAYANAN
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('report')} className="hover:text-[#0088cc] flex items-center gap-1.5 transition">
                    <span>&rsaquo;</span> <span>Buat Laporan Baru</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('track')} className="hover:text-[#0088cc] flex items-center gap-1.5 transition">
                    <span>&rsaquo;</span> <span>Lacak Status Laporan</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-[#0088cc] flex items-center gap-1.5 transition">
                    <span>&rsaquo;</span> <span>Peta Sebaran Mutu Air</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('guide')} className="hover:text-[#0088cc] flex items-center gap-1.5 transition">
                    <span>&rsaquo;</span> <span>Panduan Parameter Mutu IKA</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak Cepat & Tanggap Darurat */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                KONTAK CEPAT &amp; TANGGAP DARURAT
              </h4>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Nomor Darurat Palembang Siaga:</span>
                      <strong className="text-slate-900 text-xs sm:text-sm">112 &bull; (0711) 351-409</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">WhatsApp DLH Musi:</span>
                  <a href="https://wa.me/6281178902211" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">
                    +62 811-7890-2211
                  </a>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                Sekretariat: Jl. Merdeka No. 1, 19 Ilir, Bukit Kecil, Palembang, Sumatera Selatan 30113.
              </p>
            </div>
          </div>

          {/* Footer Mobile Call-to-Actions (Compact Mobile) */}
          <div className="grid grid-cols-2 gap-2.5 pt-4 md:hidden">
            <a
              href="tel:112"
              className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>112 Darurat</span>
            </a>
            <a
              href="https://wa.me/6281178902211"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp DLH</span>
            </a>
          </div>

          {/* Bottom Bar: Copyright & Links */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <p className="text-[11px]">
              &copy; 2026 SIPEPES &bull; Pemerintah Kota Palembang &amp; Komunitas Peduli Musi.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => alert('Kebijakan Privasi Warga Sesuai UU Perlindungan Data Pribadi')} className="hover:underline">
                Kebijakan Privasi
              </button>
              <button onClick={() => alert('Syarat & Ketentuan Pelaporan Lingkungan DAS')} className="hover:underline">
                Syarat &amp; Ketentuan
              </button>
              <button onClick={() => alert('Portal Data Terbuka Lingkungan Hidup Pemkot Palembang')} className="hover:underline">
                Data Terbuka Pemkot
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

