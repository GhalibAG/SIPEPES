import React, { useState } from 'react';
import {
  Droplets,
  Compass,
  FileText,
  Search,
  BookOpen,
  User,
  Plus,
  Menu,
  X,
  ChevronRight,
  Phone,
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

  // Label navbar persis sesuai desain Figma asli
  const navItems = [
    { id: 'home', label: 'Beranda & Peta', icon: Compass },
    { id: 'report', label: 'Lapor Pencemaran', icon: FileText },
    { id: 'track', label: 'Lacak Laporan', icon: Search },
    { id: 'guide', label: 'Panduan & Edukasi', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Publik Warga */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">

          {/* Brand Logo & Title */}
          <div
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0077b3] to-[#0099e6] flex items-center justify-center text-white shadow-md shadow-sky-500/20 transition-transform group-hover:scale-105">
              <Droplets className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  SIPEPES
                </span>

              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                Green Generation River Care
              </p>
            </div>
          </div>

          {/* Desktop Nav Items (Nama persis sesuai desain) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition relative cursor-pointer ${isActive
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

          {/* Kanan: Tombol Lapor + Login Admin + Hamburger Mobile */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Tombol CTA Lapor Sekarang */}
            <button
              onClick={() => setActiveTab('report')}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Lapor Sekarang</span>
            </button>

            {/* Tombol Akses Portal Admin */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Buka Portal Admin SIPEPES"
            >
              <User className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Hamburger Button untuk Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Buka Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Hamburger Dropdown) */}
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${isActive
                    ? 'bg-sky-50 text-[#0088cc] font-bold'
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
              <span className="text-xs text-slate-500">Akses Pengurus GG River Care</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Portal Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Content Area (Lega & Proporsional) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* 3. Footer Bersih & Fungsional */}
      <footer className="bg-white border-t border-slate-200 mt-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200">
            {/* Kolom 1: Tentang SIPEPES */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0088cc] flex items-center justify-center text-white">
                  <Droplets className="w-4 h-4 fill-white/20" />
                </div>
                <span className="font-black text-slate-900 text-base">SIPEPES Palembang</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                Sistem Informasi Pelaporan Pencemaran Sungai Musi. Kolaborasi warga Palembang, Green Generation, dan Dinas Lingkungan Hidup untuk menjaga kelestarian perairan Musi.
              </p>

            </div>

            {/* Kolom 2: Navigasi Cepat */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-[#0088cc] transition cursor-pointer">
                    Beranda &amp; Peta
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('report')} className="hover:text-[#0088cc] transition cursor-pointer">
                    Lapor Pencemaran
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('track')} className="hover:text-[#0088cc] transition cursor-pointer">
                    Lacak Laporan
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('guide')} className="hover:text-[#0088cc] transition cursor-pointer">
                    Panduan &amp; Edukasi
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak Darurat */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Kontak Cepat &amp; Tanggap Darurat
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Call Center Darurat:</span>
                  <a href="tel:112" className="font-bold text-rose-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    112 Palembang Siaga
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                  <span className="text-slate-500 text-[11px]">WhatsApp DLH Musi:</span>
                  <a href="https://wa.me/6281178902211" target="_blank" rel="noreferrer" className="font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    +62 811-7890-2211
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Baris Bawah: Hak Cipta */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>&copy; 2026 SIPEPES Palembang &bull; Green Generation River Care.</p>
            <p>Dibangun untuk kemudahan partisipasi masyarakat menjaga DAS Musi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
