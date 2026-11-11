import React from 'react';
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Droplets,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';

export default function WargaGuide({ onNavigate }) {
  const pollutionTypes = [
    {
      title: 'Limbah Minyak & Kimia B3',
      badge: 'Prioritas Tinggi / Darurat',
      badgeColor: 'bg-rose-600 text-white',
      icon: '🛢️',
      ciri: 'Tumpahan oli kapal atau buangan industri, air sungai berwarna pelangi/hitam pekat, berbau menyengat.',
      dampak: 'Mematikan ekosistem ikan Musi dan mencemari bahan baku air bersih PDAM Tirta Musi.'
    },
    {
      title: 'Sampah Plastik & Domestik',
      badge: 'Prioritas Sedang',
      badgeColor: 'bg-amber-500 text-white',
      icon: '🗑️',
      ciri: 'Timbulan kantong kresek, botol air mineral, styrofoam, dan limbah rumah tangga menyumbat kolong dermaga getek.',
      dampak: 'Memicu banjir pasang sungai, pendangkalan alur pelayaran, dan sarang penyakit.'
    },
    {
      title: 'Gulma & Eceng Gondok Liar',
      badge: 'Prioritas Pemantauan',
      badgeColor: 'bg-slate-800 text-white',
      icon: '🌿',
      ciri: 'Hamparan eceng gondok tebal yang menutupi permukaan air sungai dan menghalangi kapal jukung melintas.',
      dampak: 'Menurunkan kadar oksigen air sungai dan menyumbat pintu pompa air kota.'
    }
  ];

  return (
    <div className="space-y-8">

      {/* 1. Header Ringkas & Lebar (Clean Typography) */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Panduan &amp; Edukasi Warga Sempadan Musi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Ikuti panduan ringkas berikut agar laporan Anda dapat langsung diverifikasi dan ditindaklanjuti cepat oleh petugas.
        </p>
      </div>

      {/* 2. Kartu Perbandingan Foto Bukti (Clean & High Contrast) */}
      <div className="space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Panduan Pengambilan Foto Bukti yang Valid</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Foto Benar (Do) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Contoh Foto yang Benar (Valid)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cepat lolos verifikasi relawan patroli
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong className="text-slate-900">Fokus &amp; Terang:</strong> Objek limbah terlihat jelas saat siang hari atau dengan pencahayaan cukup.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong className="text-slate-900">Ada Patokan Lokasi:</strong> Terlihat latar belakang sempadan, dermaga, tiang jembatan, atau tepian sungai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong className="text-slate-900">Foto Asli di Tempat:</strong> Diambil langsung di lokasi kejadian saat pencemaran berlangsung.</span>
              </li>
            </ul>
          </div>

          {/* Foto Kurang Tepat (Don't) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✕
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Contoh Foto Tidak Valid (Ditolak)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Akan ditolak karena bukti tidak memadai
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold shrink-0">✕</span>
                <span><strong className="text-slate-900">Kabur / Gelap Gulita:</strong> Foto malam hari tanpa lampu sehingga jenis limbah tidak bisa diidentifikasi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold shrink-0">✕</span>
                <span><strong className="text-slate-900">Terlalu Zoom Dekat:</strong> Hanya foto botol plastik tanpa terlihat apakah berada di sungai atau di darat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold shrink-0">✕</span>
                <span><strong className="text-slate-900">Unduhan Internet / Hoaks:</strong> Menggunakan foto lama dari Google atau media sosial yang tidak relevan.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Tiga Jenis Pencemaran Utama */}
      <div className="space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          🌊 3 Jenis Pencemaran yang Sering Terjadi di Sungai Musi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pollutionTypes.map((type, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{type.icon}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${type.badgeColor}`}>
                    {type.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {type.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {type.ciri}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <strong className="text-slate-700 block mb-0.5">Dampak Lingkungan:</strong>
                {type.dampak}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Keamanan & FAQ Singkat */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Keamanan &amp; Kerahasiaan Identitas Pelapor</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block text-xs">Apakah identitas saya aman?</strong>
            <p className="leading-relaxed">
              Ya, 100% aman. SIPEPES menyediakan fitur pelaporan anonim. Nama dan kontak Anda tidak akan pernah dipublikasikan pada peta publik.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block text-xs">Berapa lama laporan ditindaklanjuti?</strong>
            <p className="leading-relaxed">
              Tim relawan Green Generation memverifikasi laporan maksimal 1x24 jam sebelum diteruskan ke Dinas Lingkungan Hidup Palembang.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Bottom CTA Banner (Solid Slate-900 - Premium, Authoritative, Zero Slop) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h3 className="font-black text-white text-base sm:text-lg">
            Melihat Pencemaran di Sekitar Anda Sekarang?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Kirimkan foto bukti dan titik lokasinya dalam kurang dari 1 menit untuk kelestarian Sungai Musi.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('report')}
          className="py-3 px-5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Lapor Pencemaran Sekarang</span>
        </button>
      </div>
    </div>
  );
}
