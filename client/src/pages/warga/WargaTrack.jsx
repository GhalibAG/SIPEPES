import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  MessageSquare,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function WargaTrack({ onNavigate }) {
  const { reports } = useAdmin();
  const [searchCode, setSearchCode] = useState('SPP-202611-0012');
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Mencari laporan berdasarkan nomor tiket
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
        `Pantau laporan pencemaran #${foundReport?.tracking_code} di SIPEPES Musi Palembang: ${window.location.origin}`
      );
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleCopyTicket = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notifikasi Berbagi */}
      {shareSuccess && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tautan nomor tiket berhasil disalin ke papan klip!</span>
          </div>
          <button onClick={() => setShareSuccess(false)} className="text-slate-400 hover:text-white font-bold ml-2 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lacak Status Laporan Pencemaran
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Masukkan nomor tiket laporan Anda untuk memantau proses verifikasi dan tindak lanjut lapangan oleh tim pengelola.
        </p>
      </div>

      {/* Input Pencarian Nomor Tiket */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-2xs p-1.5 focus-within:ring-2 focus-within:ring-slate-900 transition max-w-3xl">
        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0 pointer-events-none" />
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Ketik nomor tiket (contoh: SPP-202611-0012)..."
          className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
        />
        {searchCode && (
          <button
            onClick={() => setSearchCode('')}
            className="text-slate-400 hover:text-slate-600 px-2 text-sm font-bold cursor-pointer"
            title="Bersihkan"
          >
            &times;
          </button>
        )}
        <button
          onClick={() => {}}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
        >
          Cari Tiket
        </button>
      </div>

      {/* Konten Utama Pelacakan (Grid Lebar & Seimbang) */}
      {foundReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Kolom Kiri: Detail Tiket & Stepper Progress (8 Kolom) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-7 space-y-6">
            
            {/* Header Tiket */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  NOMOR TIKET RESMI
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-black text-xl text-slate-900">
                    #{foundReport.tracking_code}
                  </span>
                  <button
                    onClick={() => handleCopyTicket(foundReport.tracking_code)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    title="Salin Nomor Tiket"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white ${
                  foundReport.status === 'valid'
                    ? 'bg-emerald-600'
                    : foundReport.status === 'ditolak'
                    ? 'bg-rose-600'
                    : 'bg-amber-500'
                }`}>
                  {foundReport.status === 'valid' ? 'Tervalidasi' : foundReport.status === 'ditolak' ? 'Ditolak' : 'Menunggu Verifikasi'}
                </span>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  title="Bagikan Tautan Laporan"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Progres Tindak Lanjut (Bersih, Non-Slop, High Contrast) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                Tahapan Penanganan Laporan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tahap 1: Laporan Diterima */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    <span className="text-xs font-bold">1. Laporan Diterima</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {foundReport.created_at ? new Date(foundReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari ini'}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Tercatat di sistem</span>
                </div>

                {/* Tahap 2: Verifikasi Petugas */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    {foundReport.status === 'valid' || foundReport.status === 'ditolak' ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                    )}
                    <span>2. Verifikasi Lapangan</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {foundReport.status === 'valid' ? 'Diverifikasi GG River Care' : foundReport.status === 'ditolak' ? 'Ditinjau Petugas' : 'Sedang Ditinjau Petugas'}
                  </p>
                  <span className="text-[10px] text-slate-700 font-semibold block">
                    {foundReport.status === 'valid' ? 'Lokasi & Bukti Valid' : foundReport.status === 'ditolak' ? 'Laporan Ditolak' : 'Maksimal 1x24 Jam'}
                  </span>
                </div>

                {/* Tahap 3: Tindak Lanjut Dinas */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    {foundReport.status === 'valid' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#0088cc]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-normal">3</span>
                    )}
                    <span>3. Tindak Lanjut DLHK</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {foundReport.status === 'valid' ? 'Diserahkan ke DLH' : 'Menunggu Verifikasi'}
                  </p>
                  <span className="text-[10px] text-slate-700 font-semibold block">
                    {foundReport.status === 'valid' ? 'Dalam Antrean Pembersihan' : 'Tahap Berikutnya'}
                  </span>
                </div>
              </div>
            </div>

            {/* Rincian Laporan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-slate-100 items-start">
              {/* Foto Bukti */}
              <div className="md:col-span-5 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={foundReport.photo_url}
                  alt={foundReport.title}
                  className="w-full h-44 object-cover"
                />
              </div>

              {/* Informasi Detail */}
              <div className="md:col-span-7 space-y-2.5">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {foundReport.title}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0088cc] shrink-0" />
                    <span>{foundReport.address_landmark} ({foundReport.district})</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  "{foundReport.description || 'Laporan pencemaran telah masuk ke sistem pengawasan Sungai Musi.'}"
                </div>

                {foundReport.admin_notes && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-amber-500 text-xs text-slate-800 shadow-2xs">
                    <strong className="block text-[11px] text-amber-700 uppercase tracking-wider mb-0.5">
                      Catatan Petugas Verifikator:
                    </strong>
                    "{foundReport.admin_notes}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Bantuan & Kontak Cepat (4 Kolom) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bantuan &amp; Tindak Lanjut</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingin menanyakan perkembangan tiket Anda langsung ke tim reaksi cepat lingkungan hidup?
              </p>

              <a
                href={`https://wa.me/6281178902211?text=Halo%20DLH%20Palembang,%20saya%20ingin%20menanyakan%20status%20laporan%20pencemaran%20${foundReport.tracking_code}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tanya WhatsApp Petugas DLH</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">
                Tahap Penanganan
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Laporan yang telah terverifikasi akan direkapitulasi secara berkala untuk penindakan lapangan oleh Satgas Sungai Musi Dinas Lingkungan Hidup Kota Palembang.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">Nomor tiket tidak ditemukan.</p>
          <p className="text-xs text-slate-400">Pastikan nomor tiket yang Anda masukkan sudah benar (contoh: SPP-202611-0012).</p>
        </div>
      )}
    </div>
  );
}
