import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Compass,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function WargaTrack({ onNavigate }) {
  const { reports } = useAdmin();
  const [searchCode, setSearchCode] = useState('SPP-202611-0012');
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Mencari laporan yang sesuai atau fallback ke laporan pertama
  const cleanedSearch = searchCode.replace('#', '').trim().toLowerCase();
  const foundReport =
    reports.find(
      (r) =>
        r.tracking_code.toLowerCase().includes(cleanedSearch) ||
        r.id.toLowerCase().includes(cleanedSearch)
    ) || reports[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Pantau laporan pencemaran #${foundReport?.tracking_code} di SIPEPES Musi Palembang: ${window.location.href}`
      );
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleCopyCoord = (coord) => {
    navigator.clipboard.writeText(coord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {shareSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tautan laporan berhasil disalin ke papan klip!</span>
          </div>
          <button onClick={() => setShareSuccess(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Cek Status Laporan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Pantau perkembangan laporan pencemaran Sungai Musi secara mudah.
        </p>
      </div>

      {/* Search Bar Besar */}
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Masukkan nomor laporan (contoh: #SPP-202611-0012)"
            className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition"
          />
          {searchCode && (
            <button
              onClick={() => setSearchCode('')}
              className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
              title="Bersihkan"
            >
              &times;
            </button>
          )}
          <button
            onClick={() => {}}
            className="absolute right-2 px-3.5 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Cari
          </button>
        </div>

        {/* Contoh Kode Cepat */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 flex-wrap">
          <span>Contoh nomor laporan:</span>
          <button
            onClick={() => setSearchCode('SPP-202611-0012')}
            className="font-mono text-[#0088cc] hover:underline font-bold"
          >
            #SPP-202611-0012
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setSearchCode('SPP-202611-0015')}
            className="font-mono text-[#0088cc] hover:underline font-bold"
          >
            #SPP-202611-0015
          </button>
        </div>
      </div>

      {/* Card Hasil Pencarian Utama */}
      {foundReport && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-5 sm:p-7">
          {/* Header Card: Kode Tiket & Badge Kategori */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm sm:text-base text-[#0088cc] px-3 py-1 rounded-xl bg-sky-50 border border-sky-200">
                #{foundReport.tracking_code}
              </span>
            </div>

            <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Limbah Berat</span>
            </span>
          </div>

          {/* Foto Bukti & Detail Kejadian */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="relative rounded-2xl overflow-hidden w-full sm:w-44 h-40 sm:h-32 border border-slate-200 shrink-0 shadow-xs">
              <img
                src={foundReport.photo_url}
                alt={foundReport.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>GPS Valid</span>
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Kawasan {foundReport.district}, Palembang</span>
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {foundReport.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dilihat: {foundReport.description}
              </p>
              <p className="text-[11px] font-mono text-slate-400 pt-1">
                Waktu Lapor: 14 Nov 2026, 08:42 WIB
              </p>
            </div>
          </div>

          {/* Stepper Tahapan Penanganan Laporan (3 Langkah) */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#0088cc]" />
              <span>TAHAPAN PENANGANAN LAPORAN</span>
            </h3>

            {/* Desktop Stepper (Grid 3 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Langkah 1: Laporan Diterima */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      &check;
                    </div>
                    <span>1. Laporan Diterima</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Selesai
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                  Laporan masuk ke sistem pengawasan.
                </p>
              </div>

              {/* Langkah 2: Dicek Petugas */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      &check;
                    </div>
                    <span>2. Dicek Petugas</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Valid
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                  Foto dan lokasi telah diverifikasi tim posko.
                </p>
              </div>

              {/* Langkah 3: Tindak Lanjut Lapangan */}
              <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] animate-spin">
                      &#8635;
                    </div>
                    <span>3. Tindak Lanjut</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Proses
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                  Sedang dikerjakan oleh tim DLH Kota Palembang.
                </p>
              </div>
            </div>
          </div>

          {/* Grid Informasi Bawah: Verifikasi Titik & Transparansi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            {/* Kiri: Verifikasi Titik Lokasi */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  VERIFIKASI TITIK LOKASI
                </span>
                <button
                  onClick={() => handleCopyCoord(`${foundReport.latitude}, ${foundReport.longitude}`)}
                  className="font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                >
                  <span>{foundReport.latitude}, {foundReport.longitude}</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden h-28 border border-slate-200 bg-sky-100 flex items-center justify-center">
                <div className="text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-slate-800 text-[11px] bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
                    Dermaga 7 Ulu &bull; Musi Sub-Basin VIII
                  </p>
                </div>
              </div>
            </div>

            {/* Kanan: Transparansi Pengawasan SIPEPES & Tombol Bagikan */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Info className="w-4 h-4 text-[#0088cc]" />
                  <span>Transparansi Pengawasan SIPEPES</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporan dipantau publik secara real-time demi percepatan pemulihan air baku Sungai Musi oleh DLH &amp; relawan Green Generation.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleShare}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span>Bagikan ke Warga</span>
                </button>

                <a
                  href="https://wa.me/6281178902211"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp Petugas</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Laporan Lain di Sekitar Lokasi Ini */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Laporan Lain di Sekitar Lokasi Ini</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">Diperbarui baru saja</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card Laporan 1 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition cursor-pointer">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-400 text-[11px]">#SPP-202611-0008</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Tercemar Berat
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Jembatan Ampera - Sempadan Ulu
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              Limbah oli dan sampah plastik menumpuk pada tiang jembatan.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              <span className="text-emerald-600 font-medium">Tindak Lanjut Lapangan (DLH)</span>
              <span>800m terdekat</span>
            </div>
          </div>

          {/* Card Laporan 2 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition cursor-pointer">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-400 text-[11px]">#SPP-202611-0015</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Tercemar Sedang
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Kampung Kapitan, Ilir Barat I
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              Sedimentasi buangan detergen dan bau anyir di bantaran rawa.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              <span className="text-[#0088cc] font-medium">Verifikasi Valid Posko</span>
              <span>1.2km terdekat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

