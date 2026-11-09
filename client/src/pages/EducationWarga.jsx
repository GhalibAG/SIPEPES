import React from 'react';
import { Camera, Building, Clock, AlertTriangle, Info, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function EducationWarga({ onNavigateToReport }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      
      {/* PAGE INTRO HEADER BANNER */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-river-600 text-xs font-semibold">
            📘 Panduan Cepat Warga
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
            🌿 DLHK Palembang
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Panduan Mengenali & Melaporkan Pencemaran Musi
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-3xl">
              Kenali tanda pencemaran air di sekitar Anda dan cara mengambil foto bukti yang tepat agar cepat ditindaklanjuti.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Standar Verifikasi Respon Cepat &lt;24 Jam</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: 3 Tanda Pencemaran Air (Symmetric 3-Column Matrix Grid on Desktop) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">BAGIAN 1 • IDENTIFIKASI VISUAL</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">3 Tanda Pencemaran Air</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A: Bahaya / Oli / Kimia */}
          <div className="border-2 border-red-200 hover:border-red-400 bg-white shadow-sm rounded-2xl p-5 transition-transform hover:scale-[1.01] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  Bahaya / Oli / Kimia
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                  Segera Lapor
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Limbah cair beracun</p>
              
              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold text-slate-800 block">CIRI-CIRI UTAMA:</span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Air hitam mengkilap atau berlapisan minyak/solar</li>
                  <li>Bau zat kimia tajam & menyengat indra penciuman</li>
                  <li>Banyak ikan mati mengapung terbawa arus</li>
                </ul>
              </div>
            </div>

            {/* Warning Callout Panel */}
            <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-xs font-medium flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>⚠️ Jauhi air segera, jangan gunakan mandi/cuci, dan langsung laporkan!</span>
            </div>
          </div>

          {/* Card B: Tumpukan Sampah Plastik */}
          <div className="border-2 border-amber-200 hover:border-amber-400 bg-white shadow-sm rounded-2xl p-5 transition-transform hover:scale-[1.01] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  Tumpukan Sampah Plastik
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Patroli Rutin
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Penyumbatan sempadan</p>
              
              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold text-slate-800 block">CIRI-CIRI UTAMA:</span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Sampah botol & kantong plastik menyangkut di tiang getek</li>
                  <li>Menumpuk di sela rakit dermaga atau pilar jembatan</li>
                  <li>Menghalangi perahu dan mengeluarkan bau busuk sampah</li>
                </ul>
              </div>
            </div>

            {/* Callout Banner */}
            <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 text-xs font-medium flex items-start space-x-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>ℹ️ Foto dari jarak dekat dan laporkan agar dikoordinasikan pembersihan titik terjadwal.</span>
            </div>
          </div>

          {/* Card C: Tanaman & Ranting Musiman */}
          <div className="border-2 border-emerald-200 hover:border-emerald-400 bg-white shadow-sm rounded-2xl p-5 transition-transform hover:scale-[1.01] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Tanaman & Ranting Musiman
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Aksi Bersih
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Biomassa hanyut</p>
              
              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold text-slate-800 block">CIRI-CIRI UTAMA:</span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Rumpun eceng gondok hanyut terbawa arus pasang surut</li>
                  <li>Potongan batang kayu atau dahan pohon roboh musiman</li>
                  <li>Aliran tersumbat sementara saat air surut di anak sungai</li>
                </ul>
              </div>
            </div>

            {/* Notice Panel */}
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-medium flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>✅ Komunikasi dengan warga sekitar dan lakukan pembersihan bersama relawan.</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: 3 Cara Mengambil Foto Bukti yang Sah */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">BAGIAN 2 • KAIDAH DOKUMENTASI DLHK</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
            98% Laporan Cepat Diverifikasi
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">3 Cara Mengambil Foto Bukti yang Sah</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-river-600 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Foto Jelas & Tidak Buram</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ambil foto dari jarak aman dengan fokus tajam ke permukaan air atau tumpukan limbah. Pastikan cahaya cukup agar warna limbah terlihat natural.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 italic">
              💡 Hindari foto bergerak dari atas getek yang berguncang.
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-river-600 flex items-center justify-center font-bold shadow-xs">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Ada Patokan Lokasi Sekitar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sertakan bangunan tetap atau landmark di sekitar seperti dermaga, tiang jembatan Ampera, rakit, atau rumah panggung warga sebagai acuan posisi petugas.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 italic">
              📍 Contoh: Terlihat dermaga paket 3B di latar foto.
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-river-600 flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Kirim Segera Saat Kejadian</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arus Sungai Musi bergerak cepat. Laporkan langsung dalam hitungan menit agar koordinat GPS otomatis tersimpan dan sampah air belum terbanyut ke hilir.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 italic">
              ⏱️ GPS & jam otomatis tercampak tiket SIPEPES.
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: Tanya Jawab Cepat (FAQ Grid) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">BAGIAN 3 • EDUKASI & KEAMANAN WARGA</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tanya Jawab Cepat (FAQ)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* FAQ Item 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-river-600"></span>
              Apakah identitas saya dirahasiakan?
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-sky-100">
              Ya, 100% aman dan terlindungi. Sistem SIPEPES menyediakan opsi pelaporan anonim. Nama dan nomor telepon Anda hanya digunakan oleh sistem verifikasi internal dan tidak akan pernah dipublikasikan kepada publik maupun pihak terlapor.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-river-600"></span>
              Bagaimana jika tidak ada sinyal di perahu?
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-sky-100">
              Ambil foto sebanyak mungkin dengan kamera bawaan ponsel Anda terlebih dahulu. Begitu perahu merapat ke dermaga atau mendapatkan jaringan seluler, buka aplikasi SIPEPES dan unggah foto tersebut—waktu pemotretan asli tetap tersimpan di dalam data foto.
            </p>
          </div>

        </div>
      </div>

      {/* INTERACTIVE CALL-TO-ACTION LAYOUT BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Aksi Cepat Warga Sempadan
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Menemukan Titik Pencemaran Hari Ini?
          </h3>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Jangan ragu, kirim aduan Anda sekarang agar dapat diverifikasi oleh relawan lapangan dan ditindaklanjuti oleh DLHK Palembang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              if (onNavigateToReport) onNavigateToReport();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-river-600 hover:bg-river-700 text-white font-semibold text-sm shadow-md transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Lapor Sekarang</span>
          </button>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp DLH (+62 812-7890-4421)</span>
          </a>
        </div>
      </div>

    </div>
  );
}