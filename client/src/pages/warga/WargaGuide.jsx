import React from 'react';
import {
  ShieldAlert,
  Camera,
  HelpCircle,
  AlertTriangle,
  Flame,
  Trash2,
  Leaf,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  WifiOff,
  Megaphone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function WargaGuide({ onNavigate }) {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Header Panduan */}
      <div className="relative rounded-3xl bg-[#0088cc] p-6 sm:p-10 text-white overflow-hidden shadow-lg">
        {/* Background Waves Decors */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-24 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                📖 Panduan Cepat Warga
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                &bull; DLHK Palembang
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Panduan Mengenali &amp; Melaporkan Pencemaran Musi
            </h1>

            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xl">
              Kenali tanda pencemaran air di sekitar Anda dan cara mengambil foto bukti yang tepat agar cepat ditindaklanjuti.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-200 block">
                STANDAR VERIFIKASI
              </span>
              <p className="font-extrabold text-sm text-white">
                Respon Cepat &lt; 24 Jam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 1: 3 Tanda Pencemaran Air */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#0088cc] uppercase tracking-wider block">
            BAGIAN 1 &bull; IDENTIFIKASI VISUAL
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              3 Tanda Pencemaran Air
            </h2>
            <p className="text-xs text-slate-500">
              Kenali kategori indikasi sebelum mengambil foto bukti aduan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kartu 1: Bahaya / Oli / Kimia */}
          <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                  SEGERA LAPOR
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Bahaya / Oli / Kimia
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Limbah cair beracun</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIRI-CIRI UTAMA:</p>
                <ul className="space-y-1.5 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">&bull;</span>
                    <span>Air hitam mengkilap atau berlapis minyak/solar</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">&bull;</span>
                    <span>Bau zat kimia tajam &amp; menyengat indra penciuman</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">&bull;</span>
                    <span>Banyak ikan mati mengapung terbawa arus</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] text-rose-800 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>
                <strong>Peringatan:</strong> Jauhi air segera, jangan gunakan mandi/cuci, dan langsung laporkan!
              </p>
            </div>
          </div>

          {/* Kartu 2: Tumpukan Sampah Plastik */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                  PATROLI RUTIN
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Tumpukan Sampah Plastik
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Penyumbatan sempadan</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIRI-CIRI UTAMA:</p>
                <ul className="space-y-1.5 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">&bull;</span>
                    <span>Sampah botol &amp; kantong plastik menyangkut di tiang getek</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">&bull;</span>
                    <span>Menumpuk di sela rakit dermaga atau pilar jembatan</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">&bull;</span>
                    <span>Menghalangi perahu dan mengeluarkan bau busuk sampah</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <span className="text-amber-600 font-bold">👥</span>
              <p>
                <strong>Aksi:</strong> Tim patroli relawan kano Green Generation diagendakan bersihkan titik terjadwal.
              </p>
            </div>
          </div>

          {/* Kartu 3: Tanaman & Ranting Musiman */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                  AKSI BERSIH
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Tanaman &amp; Ranting Musiman
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Biomassa hanyut</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIRI-CIRI UTAMA:</p>
                <ul className="space-y-1.5 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">&bull;</span>
                    <span>Rumpun eceng gondok hanyut terbawa arus pasang surut</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">&bull;</span>
                    <span>Potongan batang kayu atau dahan pohon roboh musiman</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">&bull;</span>
                    <span>Aliran tersumbat sementara saat air surut di anak sungai</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Keterangan:</strong> Bukan limbah kimia B3 berbahaya, namun butuh koordinasi pembersihan ranting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 2: 3 Cara Mengambil Foto Bukti yang Sah */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#0088cc] uppercase tracking-wider block">
            BAGIAN 2 &bull; KAIDAH DOKUMENTASI DLHK
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              3 Cara Mengambil Foto Bukti yang Sah
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              ✓ 98% Laporan Cepat Diverifikasi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Panduan 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088cc] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              1. Foto Jelas &amp; Tidak Buram
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ambil foto dari jarak aman dengan fokus tajam ke permukaan air atau tumpukan limbah. Pastikan cahaya cukup agar warna limbah terlihat natural.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Hindari foto bergerak dari atas getek yang berguncang</span>
            </div>
          </div>

          {/* Panduan 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088cc] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              2. Ada Patokan Lokasi Sekitar
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sertakan bangunan tetap atau landmark di sekitar seperti dermaga, tiang jembatan Ampera, rakit, atau rumah panggung warga sebagai acuan posisi petugas.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5">
              <span>📍</span>
              <span>Contoh: Terlihat dermaga getek 16 ilir di latar foto</span>
            </div>
          </div>

          {/* Panduan 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088cc] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              3. Kirim Segera Saat Kejadian
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Arus Sungai Musi bergerak cepat. Laporkan langsung dalam hitungan menit agar koordinat GPS otomatis tersimpan dan sampel air belum terhanyut ke hilir.
            </p>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5">
              <span>🛰️</span>
              <span>GPS &amp; jam otomatis tersimpan di tiket SIPEPES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 3: Tanya Jawab Cepat (FAQ) */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#0088cc] uppercase tracking-wider block">
            BAGIAN 3 &bull; EDUKASI &amp; KEAMANAN WARGA
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tanya Jawab Cepat (FAQ)
            </h2>
            <p className="text-xs text-slate-500">
              Kerahasiaan dan kemudahan akses bagi warga perairan Musi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Apakah identitas saya dirahasiakan?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Ya, 100% aman dan terlindungi.</strong> Sistem SIPEPES menyediakan opsi pelaporan anonim. Nama dan nomor telepon Anda hanya digunakan oleh sistem verifikasi internal dan tidak akan pernah dipublikasikan kepada publik maupun pihak terlapor.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <WifiOff className="w-4 h-4 text-[#0088cc]" />
              <span>Bagaimana jika tidak ada sinyal di perahu?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ambil foto sebanyak mungkin dengan kamera bawaan ponsel Anda terlebih dahulu. Begitu perahu merapat ke dermaga atau mendapatkan jaringan seluler, buka aplikasi SIPEPES dan unggah foto tersebut—waktu pemotretan asli tetap tersimpan di dalam data foto.
            </p>
          </div>
        </div>
      </section>

      {/* Banner Call-To-Action Bawah */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0369a1] to-[#0284c7] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
            📢 Aksi Cepat Warga Sempadan
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Menemukan Titik Pencemaran Hari Ini?
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 max-w-md">
            Jangan ragu, kirim aduan Anda sekarang agar dapat diverifikasi oleh relawan lapangan dan ditindaklanjuti oleh DLHK Palembang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('report')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition"
          >
            Lapor Sekarang
          </button>

          <a
            href="https://wa.me/6281178902211"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp DLHK</span>
          </a>
        </div>
      </div>
    </div>
  );
}

