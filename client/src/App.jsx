import React, { useState } from 'react';
import {
  Waves,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Send,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink
} from 'lucide-react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';

function MainApp() {
  const { adminUser, stats } = useAdmin();
  const [viewMode, setViewMode] = useState('admin'); // Bawaan ke 'admin' sesuai tugas tim kita, bisa switch ke 'public'
  const [publicTab, setPublicTab] = useState('peta');

  // Jika mode Admin dipilih:
  if (viewMode === 'admin') {
    if (!adminUser) {
      return <AdminLogin onBackToPublic={() => setViewMode('public')} />;
    }
    return <AdminLayout onSwitchToPublic={() => setViewMode('public')} />;
  }

  // Tampilan Publik (Portal Warga)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation Bar Publik */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-river-600 flex items-center justify-center text-white shadow-sm">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                SIPEPES
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-eco-100 text-eco-700 border border-eco-200">
                  GG River Care
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Informasi Pelaporan Pencemaran Sungai Musi
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setPublicTab('peta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                publicTab === 'peta'
                  ? 'bg-river-50 text-river-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peta Sebaran
            </button>
            <button
              onClick={() => setPublicTab('lapor')}
              className="bg-river-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-river-700 shadow-sm flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Lapor Sekarang
            </button>

            {/* Tombol Akses Portal Admin */}
            <button
              onClick={() => setViewMode('admin')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm"
              title="Akses Dashboard Admin Komunitas"
            >
              <Lock className="w-3.5 h-3.5 text-river-600" />
              <span>Portal Admin</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Ringkasan Sistem */}
        <section className="bg-gradient-to-r from-river-600 to-river-700 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-sky-100 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Kolaborasi Green Generation Palembang
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Lindungi Sungai Musi dari Pencemaran
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed mb-6">
              Platform pelaporan cepat berbasis foto dan koordinat GPS. Setiap laporan diverifikasi langsung oleh tim relawan untuk bahan advokasi penanganan lingkungan.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> 🔴 Tercemar Berat
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 🟡 Tercemar Sedang
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 🟢 Tercemar Ringan
              </div>
            </div>
          </div>
        </section>

        {/* Status Indikator & Quick Stats Terhubung ke Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Laporan Menunggu</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.menunggu}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Laporan Terverifikasi</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.valid}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Rekap Siap Advokasi</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.valid} Dokumen</h3>
            </div>
          </div>
        </div>

        {/* Container Peta Sebaran */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-river-600" />
                Peta Titik Pencemaran Sungai Musi
              </h2>
              <p className="text-xs text-slate-500">
                Pembaruan koordinat real-time titik pencemaran yang telah diverifikasi
              </p>
            </div>
            <button
              onClick={() => setViewMode('admin')}
              className="text-xs px-3 py-1.5 rounded-lg bg-river-50 text-river-700 font-semibold hover:bg-river-100 transition"
            >
              Kelola di Dashboard Admin &rarr;
            </button>
          </div>

          <div className="w-full h-80 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <Waves className="w-12 h-12 text-river-400 mb-2" />
            <p className="font-semibold text-slate-700">Peta Sebaran Laporan Aktif</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {stats.valid} titik pencemaran telah divalidasi oleh Green Generation Palembang di sepanjang aliran Sungai Musi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Proyek Sistem Informasi (Fasilkom Universitas Sriwijaya) © 2026 Tim MuSilaban.</p>
        <p className="mt-1 text-slate-400">Tech Lead & Backend Developer: M. Naufal Rafif Pratama</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <MainApp />
    </AdminProvider>
  );
}
