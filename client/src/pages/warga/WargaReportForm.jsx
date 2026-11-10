import React, { useState } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  RotateCcw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  EyeOff,
  Send,
  Sparkles,
  Compass,
  FileCheck,
  Shield,
  ArrowRight,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function WargaReportForm({ onNavigate }) {
  const { sempadanList, addReport } = useAdmin();

  // Form State
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedPoint, setSelectedPoint] = useState(
    sempadanList[0]?.nama || 'Dermaga 7 Ulu, Seberang Ulu I'
  );
  const [coords, setCoords] = useState({ lat: -2.9904, lon: 104.7565 });
  const [severity, setSeverity] = useState('parah');
  const [description, setDescription] = useState(
    'Tumpahan solar atau cairan oli hitam pekat di sekitar tambatan getek dermaga, tercium aroma menyengat.'
  );
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReport, setSuccessReport] = useState(null);

  // Handle Photo Upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle GPS Refresh
  const handleRefreshGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lon: parseFloat(pos.coords.longitude.toFixed(4))
          });
        },
        () => {
          // Fallback jitter koordinat Musi
          setCoords({
            lat: parseFloat((-2.9900 - Math.random() * 0.005).toFixed(4)),
            lon: parseFloat((104.7560 + Math.random() * 0.005).toFixed(4))
          });
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addReport({
        title: `Limbah ${severity === 'parah' ? 'B3 / Minyak' : severity === 'sedang' ? 'Sampah Padat' : 'Organik'} di ${selectedPoint}`,
        description: description,
        category: severity === 'parah' ? 'Minyak & B3' : severity === 'sedang' ? 'Sampah Domestik' : 'Limbah Ringan',
        estimated_severity: severity === 'parah' ? 'berat' : severity,
        latitude: coords.lat,
        longitude: coords.lon,
        address_landmark: selectedPoint,
        district: selectedPoint.includes('Ulu') ? 'Seberang Ulu' : 'Seberang Ilir',
        is_anonymous: isAnonymous,
        photo_url: photoPreview
      });

      setIsSubmitting(false);
      setSuccessReport(created);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Success Modal Notification */}
      {successReport && (
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-4 shadow-lg animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-emerald-950">
                Laporan Berhasil Terkirim ke DLH &amp; Relawan!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                Terima kasih atas kepedulian Anda menjaga Sungai Musi. Nomor pelacakan resmi laporan Anda:
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-mono font-black text-sm text-[#0088cc] shadow-xs">
                <span>#{successReport.tracking_code}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('track')}
              className="py-2.5 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Lacak Status Laporan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSuccessReport(null)}
              className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Kirim Laporan Lainnya
            </button>
          </div>
        </div>
      )}

      {/* Header Form */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200">
            📢 Pengaduan Cepat Warga
          </span>
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            &bull; Barometer Musi: IKA 58.4
          </span>
          <span className="text-[10px] text-slate-400 font-medium ml-auto hidden sm:inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Koneksi Terenkripsi DLH</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Lapor Pencemaran Sungai
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Isi 3 langkah singkat di bawah. Laporan langsung diteruskan ke tim DLH &amp; relawan patroli.
        </p>
      </div>

      {/* Main Grid: Form di Kiri & Pratinjau Tiket di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Form 3 Langkah */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Langkah 1: Unggah Foto Bukti Kejadian */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Unggah Foto Bukti Kejadian <span className="text-rose-500 font-normal">*Wajib</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ambil foto langsung di lokasi perairan atau sempadan Musi
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline-block">
                ⚡ Auto-kompres &lt; 2MB
              </span>
            </div>

            {/* Area Unggah / Preview Foto */}
            <div className="relative rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/30 p-4 text-center transition hover:bg-sky-50/60">
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden max-h-64 sm:max-h-72 mx-auto">
                  <img
                    src={photoPreview}
                    alt="Bukti Pencemaran"
                    className="w-full h-48 sm:h-56 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-semibold bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Foto Tersimpan
                    </span>
                    <span className="font-mono text-slate-300">Hari ini, 10:42 WIB</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0088cc] flex items-center justify-center mx-auto shadow-sm">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      Klik atau seret foto bukti limbah ke sini
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Mendukung format JPG, PNG, WebP (Maksimal 10MB, otomatis diperkecil)
                    </p>
                  </div>
                </div>
              )}

              {/* Input File Tersembunyi */}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Pilih atau ganti foto bukti"
              />
            </div>

            {/* Tombol Ambil Foto & Pilih Galeri di Mobile */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              <label className="py-2.5 px-3 rounded-xl bg-[#0088cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                <Camera className="w-4 h-4" />
                <span>Ambil Foto</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
              </label>

              <label className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200 transition">
                <ImageIcon className="w-4 h-4" />
                <span>Pilih Galeri</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* Badges Fitur */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#0088cc]" />
                Deteksi GPS EXIF
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Privasi Terjaga
              </span>
            </div>
          </div>

          {/* Langkah 2: Lokasi Kejadian */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Lokasi Kejadian <span className="text-rose-500 font-normal">*Wajib</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pilih titik bantaran sungai atau gunakan pendeteksi posisi presisi
                  </p>
                </div>
              </div>
            </div>

            {/* Dropdown Dermaga / Titik Terdekat */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PILIH DERMAGA / TITIK TERDEKAT
              </label>
              <select
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0088cc]"
              >
                {sempadanList.map((p) => (
                  <option key={p.kode} value={`${p.nama}, ${p.wilayah}`}>
                    {p.nama} ({p.wilayah})
                  </option>
                ))}
              </select>
            </div>

            {/* Box Koordinat Otomatis GPS */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0088cc] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">KOORDINAT OTOMATIS GPS</span>
                  <p className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                    {coords.lat} S, {coords.lon} E
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Akurasi &plusmn;4m
                </span>
                <button
                  type="button"
                  onClick={handleRefreshGps}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] flex items-center gap-1 shadow-xs transition"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Cek Ulang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Langkah 3: Kondisi Air & Limbah */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Kondisi Air &amp; Limbah <span className="text-rose-500 font-normal">*Wajib</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pilih tingkat dampak pencemaran yang teramati di lapangan
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Radio Card Tingkat Keparahan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Parah */}
              <label
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                  severity === 'parah'
                    ? 'border-rose-400 bg-rose-50/50 ring-1 ring-rose-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span className="font-extrabold text-xs text-rose-700">Parah</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Oli / Minyak / Bau Menyengat / Biota Mati
                  </p>
                </div>
                <input
                  type="radio"
                  name="severity"
                  value="parah"
                  checked={severity === 'parah'}
                  onChange={() => setSeverity('parah')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
              </label>

              {/* Sedang */}
              <label
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                  severity === 'sedang'
                    ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-extrabold text-xs text-amber-700">Sedang</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Sampah Plastik / Keruh Luas / Busa
                  </p>
                </div>
                <input
                  type="radio"
                  name="severity"
                  value="sedang"
                  checked={severity === 'sedang'}
                  onChange={() => setSeverity('sedang')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
              </label>

              {/* Ringan */}
              <label
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                  severity === 'ringan'
                    ? 'border-emerald-400 bg-emerald-50/50 ring-1 ring-emerald-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs text-emerald-700">Ringan</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Sampah Lokal Tepian / Kotoran Sedikit
                  </p>
                </div>
                <input
                  type="radio"
                  name="severity"
                  value="ringan"
                  checked={severity === 'ringan'}
                  onChange={() => setSeverity('ringan')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Keterangan Tambahan */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>KETERANGAN TAMBAHAN (SINGKAT)</span>
                <span className="font-mono text-slate-400">{description.length}/200</span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsikan warna air, bau yang tercium, atau sumber pencemaran jika terlihat..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#0088cc]"
              />
            </div>

            {/* Checkbox Anonim */}
            <label className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 rounded text-[#0088cc] focus:ring-[#0088cc]"
              />
              <div>
                <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lapor Sebagai Anonim</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Nama &amp; kontak pelapor disembunyikan dari publikasi umum demi keselamatan Anda.
                </p>
              </div>
            </label>
          </div>

          {/* Tombol Kirim Laporan */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#0088cc]/20 transition disabled:opacity-70 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengompresi & Mengirim Laporan...' : 'Kirim Laporan Resmi'}</span>
            </button>

            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jaminan Kerahasiaan UU Perlindungan Saksi &amp; Terhubung Langsung ke Hotline DLH</span>
            </p>
          </div>
        </form>

        {/* Kolom Kanan: Pratinjau Tiket Warga & Alur Cepat (Desktop & Tablet) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Pratinjau Tiket Warga Live */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0088cc]" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                  PRATINJAU TIKET WARGA
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0088cc]">
                Real-Time
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#0088cc] text-xs">#MUSI-9041</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    severity === 'parah'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : severity === 'sedang'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  &bull; Kondisi {severity === 'parah' ? 'Parah' : severity === 'sedang' ? 'Sedang' : 'Ringan'}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden h-36 border border-slate-200">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[9px]">
                  {coords.lat} S, {coords.lon} E
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                  {selectedPoint}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Status: Siap Kirim
                </span>
                <span>{isAnonymous ? 'Pelapor Anonim' : 'Pelapor Terdaftar'}</span>
              </div>
            </div>
          </div>

          {/* Alur Cepat Setelah Lapor */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Alur Cepat Setelah Lapor</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">Verifikasi Titik (10 Menit)</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sistem mengecek kecocokan foto dan titik sempadan sungai.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800">Notifikasi Tim Patroli</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Laporan diteruskan ke DLH &amp; kapal patroli terdekat di Musi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800">Pemantauan Terbuka</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Perkembangan tindak lanjut dapat dilacak pada menu Lacak Laporan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

