import React, { useState } from 'react';
import { Waves, AlertTriangle, ShieldCheck, MapPin, Send, CheckCircle2, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('peta');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
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

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('peta')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'peta'
                  ? 'bg-river-50 text-river-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peta Sebaran
            </button>
            <button
              onClick={() => setActiveTab('lapor')}
              className="bg-river-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-river-700 shadow-sm flex items-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" />
              Lapor Sekarang
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

        {/* Status Indikator & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Laporan Menunggu</p>
              <h3 className="text-2xl font-bold text-slate-900">4</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Laporan Terverifikasi</p>
              <h3 className="text-2xl font-bold text-slate-900">18</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Rekap Siap Advokasi</p>
              <h3 className="text-2xl font-bold text-slate-900">2 Dokumen</h3>
            </div>
          </div>
        </div>

        {/* Peta Sebaran Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-river-600" />
                Peta Titik Pencemaran Sungai Musi
              </h2>
              <p className="text-xs text-slate-500">
                Pembaruan koordinat real-time dengan integrasi Leaflet & MapTiler
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Palembang (Sungai Musi)
            </span>
          </div>

          <div className="w-full h-80 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <Waves className="w-12 h-12 text-river-300 mb-2 animate-pulse" />
            <p className="font-semibold text-slate-600">Container Peta Siap Terpasang</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Komponen Leaflet.js siap diintegrasikan dengan koordinat database Supabase (Lat: -2.9909, Lng: 104.7565).
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
