import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Droplets,
  Plus
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function WargaGuide() {
  const pollutionTypes = [
    {
      title: 'Limbah Minyak & Bahan Kimia',
      badge: 'Tingkat Berat',
      badgeType: 'berat',
      bgClass: 'bg-koral-100 border-koral-500/30 text-ink',
      ciri: 'Tumpahan oli kapal atau buangan industri, air sungai berwarna pelangi atau hitam pekat, serta mengeluarkan aroma menyengat.',
      dampak: 'Merusak ekosistem ikan Musi dan membahayakan sumber air bersih warga tepian.'
    },
    {
      title: 'Sampah Plastik & Domestik',
      badge: 'Tingkat Sedang',
      badgeType: 'sedang',
      bgClass: 'bg-ceria-100 border-ceria-400/40 text-ink',
      ciri: 'Timbulan kantong kresek, botol plastik, styrofoam, dan sampah rumah tangga yang menyumbat kolong dermaga atau getek.',
      dampak: 'Memicu pendangkalan alur sungai, menyumbat saluran pembuangan, dan mengotori sempadan.'
    },
    {
      title: 'Busa Industri & Limbah Pabrik',
      badge: 'Tingkat Berat',
      badgeType: 'berat',
      bgClass: 'bg-musi-100 border-musi-600/30 text-ink',
      ciri: 'Gumpalan busa putih tebal terapung di permukaan air disertai perubahan warna air sungai menjadi keruh kecokelatan tidak wajar.',
      dampak: 'Menurunkan kadar oksigen terlarut dan mematikan biota air sungai.'
    },
    {
      title: 'Gulma & Eceng Gondok Tebal',
      badge: 'Tingkat Ringan',
      badgeType: 'ringan',
      bgClass: 'bg-toska-100 border-toska-400/40 text-ink',
      ciri: 'Hamparan eceng gondok liar yang menutupi alur sempadan sungai hingga menghalangi perahu jukung melintas.',
      dampak: 'Menghambat sirkulasi air dan menjadi tempat terperangkapnya sampah plastik.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* 1. Header Panduan */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-musi-100 text-musi-800 text-xs font-bold">
          <Droplets className="w-3.5 h-3.5" />
          <span>Edukasi Pelaporan Komunitas Musi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
          Panduan Mengenali &amp; Melaporkan Pencemaran
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
          Ikuti pedoman visual berikut agar foto dan data yang kamu kirimkan mudah diverifikasi oleh tim relawan GG River Care.
        </p>
      </div>

      {/* 2. Jenis-Jenis Pencemaran (Kartu Warna Muda Bergantian) */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
          <span>Jenis Pencemaran yang Dapat Dilaporkan</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pollutionTypes.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-5 sm:p-6 border space-y-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 ${item.bgClass}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-ink">
                  {item.title}
                </h3>
                <Badge type="tingkat" value={item.badgeType} size="md" />
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-ink block">Ciri visual di lapangan:</span>
                  <p className="text-ink-soft">{item.ciri}</p>
                </div>
                <div>
                  <span className="font-bold text-ink block">Dampak lingkungan:</span>
                  <p className="text-ink-soft">{item.dampak}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Komparasi Foto Valid vs Tidak Valid */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink">
          Tips Mengambil Foto Bukti yang Sah
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Foto Benar (Do) */}
          <Card className="p-5 sm:p-6 space-y-4 border-toska-400/40">
            <div className="flex items-center gap-2.5 pb-3 border-b border-garis">
              <div className="w-8 h-8 rounded-full bg-toska-100 text-toska-800 flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm sm:text-base">
                  Contoh Foto yang Benar (Valid)
                </h3>
                <p className="text-xs text-ink-muted">
                  Cepat lolos verifikasi relawan GG River Care
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-toska-800 shrink-0 mt-0.5" />
                <span>Foto diambil dengan pencahayaan cukup di siang hari sehingga warna air tampak jelas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-toska-800 shrink-0 mt-0.5" />
                <span>Memuat patokan lokasi sempadan seperti tiang dermaga, getek, atau pemukiman tepian.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-toska-800 shrink-0 mt-0.5" />
                <span>Jarak pemotretan proporsional (tidak terlalu jauh atau buram).</span>
              </li>
            </ul>
          </Card>

          {/* Foto Salah (Don't) */}
          <Card className="p-5 sm:p-6 space-y-4 border-tingkat-berat-tx/30">
            <div className="flex items-center gap-2.5 pb-3 border-b border-garis">
              <div className="w-8 h-8 rounded-full bg-tingkat-berat-bg text-tingkat-berat-tx flex items-center justify-center font-bold text-sm shrink-0">
                ✕
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm sm:text-base">
                  Foto yang Berisiko Ditolak
                </h3>
                <p className="text-xs text-ink-muted">
                  Menyulitkan peninjauan di lapangan
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-tingkat-berat-tx shrink-0 mt-0.5" />
                <span>Foto terlalu gelap saat malam hari tanpa bantuan lampu penerang.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-tingkat-berat-tx shrink-0 mt-0.5" />
                <span>Hanya memperlihatkan air tanpa patokan sempadan tepian sungai sama sekali.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-tingkat-berat-tx shrink-0 mt-0.5" />
                <span>Menggunakan foto unduhan dari internet atau hasil tangkapan layar media sosial lama.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* 4. Banner Ajakan di Bawah */}
      <Card className="bg-gradient-to-r from-musi-600 to-toska-400 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lembut">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            Melihat Pencemaran di Sekitarmu?
          </h3>
          <p className="text-xs sm:text-sm text-white/90">
            Hanya butuh 2 menit untuk mengirimkan laporan tanpa perlu login.
          </p>
        </div>

        <Link to="/lapor" className="shrink-0">
          <Button variant="ajakan" size="lg">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Laporkan Sekarang</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
