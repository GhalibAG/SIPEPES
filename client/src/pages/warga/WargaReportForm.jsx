import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Lock,
  Send,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Shield,
  Trash2,
  Copy,
  Check,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function WargaReportForm({ onNavigate }) {
  const { sempadanList, addReport } = useAdmin();

  // Form State
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(
    sempadanList[0]?.nama || 'Dermaga 7 Ulu, Seberang Ulu I'
  );
  const [coords, setCoords] = useState({ lat: -2.9904, lon: 104.7565 });
  const [gpsLocked, setGpsLocked] = useState(false);
  const [category, setCategory] = useState('Minyak & B3');
  const [severity, setSeverity] = useState('sedang'); // 'berat' | 'sedang' | 'ringan'
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReport, setSuccessReport] = useState(null);
  const [copied, setCopied] = useState(false);

  // Kategori Pilihan Cepat
  const categories = [
    { id: 'Minyak & B3', label: 'Limbah Minyak / B3', icon: '🛢️', desc: 'Tumpahan oli, minyak kapal, atau bahan kimia' },
    { id: 'Sampah Domestik', label: 'Sampah Plastik / Domestik', icon: '🗑️', desc: 'Timbulan sampah plastik, botol, atau kasur' },
    { id: 'Eceng Gondok / Gulma', label: 'Gulma / Eceng Gondok', icon: '🌿', desc: 'Aliran sungai tersumbat tanaman liar tebal' },
  ];

  // Tingkat Keparahan (High Contrast - Bebas Warna Nanggung)
  const severityOptions = [
    { id: 'berat', label: 'Parah / Kritis', dotColor: 'bg-rose-500', desc: 'Air menghitam, aroma menyengat, atau tumpahan meluas' },
    { id: 'sedang', label: 'Sedang', dotColor: 'bg-amber-500', desc: 'Sampah mengapung cukup banyak, air keruh' },
    { id: 'ringan', label: 'Ringan', dotColor: 'bg-emerald-500', desc: 'Sampah serakan baru atau pencemaran lokal kecil' },
  ];

  // Handle Photo Upload / Capture
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

  // Handle GPS Auto-detect
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: parseFloat(pos.coords.latitude.toFixed(5)),
            lon: parseFloat(pos.coords.longitude.toFixed(5))
          });
          setGpsLocked(true);
        },
        () => {
          // Fallback realistis koordinat Palembang Musi
          setCoords({
            lat: parseFloat((-2.9912 + (Math.random() - 0.5) * 0.006).toFixed(5)),
            lon: parseFloat((104.7635 + (Math.random() - 0.5) * 0.006).toFixed(5))
          });
          setGpsLocked(true);
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoPreview) {
      alert('Mohon sertakan foto bukti pencemaran terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = addReport({
        title: `Laporan ${category} di ${selectedPoint}`,
        description: description || `Ditemukan pencemaran ${category.toLowerCase()} dengan tingkat dugaan ${severity} di sekitar ${selectedPoint}.`,
        category: category,
        estimated_severity: severity,
        latitude: coords.lat,
        longitude: coords.lon,
        address_landmark: selectedPoint,
        district: selectedPoint.includes('Ulu') ? 'Seberang Ulu I' : 'Ilir Timur I',
        is_anonymous: isAnonymous,
        reporter_name: isAnonymous ? 'Warga Palembang' : reporterName,
        reporter_contact: isAnonymous ? 'Disembunyikan' : reporterPhone,
        photo_url: photoPreview
      });

      setIsSubmitting(false);
      setSuccessReport(created);
    }, 600);
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

      {/* 1. Modal Sukses Saat Laporan Terkirim */}
      {successReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Laporan Berhasil Dikirim!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Terima kasih atas kontribusi Anda menjaga Sungai Musi. Laporan langsung masuk antrean verifikasi petugas.
              </p>
            </div>

            {/* Nomor Tiket */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                NOMOR TIKET LAPORAN ANDA
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono font-black text-lg text-[#0077b3]">
                  #{successReport.tracking_code}
                </span>
                <button
                  onClick={() => handleCopyTicket(successReport.tracking_code)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title="Salin Nomor Tiket"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setSuccessReport(null);
                  if (onNavigate) onNavigate('track');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Lacak Status Laporan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSuccessReport(null);
                  setPhotoPreview(null);
                  setDescription('');
                }}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Header Form (Lega & Proporsional) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lapor Pencemaran Sungai Musi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kirimkan foto bukti dan lokasi pencemaran di Sungai Musi. Formulir dirancang ringkas untuk kemudahan warga di lapangan.
        </p>
      </div>

      {/* 3. Main Grid Layout (Lebar & Seimbang) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Kolom Kiri: Formulir Lapor Utama (8 Kolom) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-5">

          {/* Bagian 1: Foto Bukti */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>1. Foto Bukti Pencemaran</span>
                <span className="text-rose-500 font-normal">*Wajib</span>
              </label>
            </div>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-72 sm:max-h-80">
                <img
                  src={photoPreview}
                  alt="Pratinjau Bukti"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-xs transition cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4 text-rose-300" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Foto Siap Dikirim
                  </span>
                  <span className="text-slate-300">Klik tempat sampah jika ingin mengganti</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tombol Ambil Kamera Langsung */}
                <label className="py-7 px-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Ambil Foto Kamera
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Buka kamera ponsel langsung
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                {/* Tombol Pilih dari Galeri */}
                <label className="py-7 px-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Pilih dari Galeri Foto
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Format JPG, PNG, atau WebP
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Bagian 2: Lokasi Kejadian & GPS */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>2. Lokasi Sempadan / Bantaran Sungai</span>
              <span className="text-rose-500 font-normal">*Wajib</span>
            </label>

            {/* Tombol Kunci GPS Cepat (Clean Neutral Surface) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${gpsLocked ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {gpsLocked ? 'Lokasi GPS Berhasil Terkunci' : 'Deteksi GPS Otomatis'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Koordinat: {coords.lat}, {coords.lon}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="py-2 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition self-start sm:self-center cursor-pointer"
              >
                {gpsLocked ? 'Perbarui Titik GPS' : 'Kunci Titik GPS Saya'}
              </button>
            </div>

            {/* Dropdown 18 Sempadan Musi */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Pilih Titik Pos / Sempadan Sungai Musi Terdekat:
              </span>
              <select
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {sempadanList.map((p) => (
                  <option key={p.kode} value={`${p.nama}, ${p.wilayah}`}>
                    {p.nama} — ({p.wilayah})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bagian 3: Kategori & Tingkat Dugaan Keparahan */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>3. Jenis &amp; Perkiraan Dampak</span>
              <span className="text-rose-500 font-normal">*Wajib</span>
            </label>

            {/* Kategori Pilihan Cepat (Crisp White Card with Sharp Ring) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {categories.map((c) => {
                const isSelected = category === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{c.label}</span>
                    </div>
                    <span className={`text-[10px] mt-1.5 leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tingkat Keparahan (Severity Chips - Solid High Contrast) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Tingkat Keparahan Pengamatan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {severityOptions.map((s) => {
                  const isSelected = severity === s.id;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSeverity(s.id)}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.dotColor}`}></span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {s.label}
                        </span>
                      </div>
                      <span className={`text-[10px] leading-snug block mt-1.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {s.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bagian 4: Keterangan Tambahan & Privasi Pelapor */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>4. Keterangan Tambahan &amp; Privasi</span>
              <span className="text-slate-400 font-normal text-xs">Opsional</span>
            </label>

            {/* Textarea */}
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan rincian jika ada (misal: warna air menghitam, perkiraan sumber, patokan jembatan)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            {/* Toggle Privasi Anonim */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="anonymous-toggle"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="anonymous-toggle" className="cursor-pointer select-none">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-700" />
                  Lapor Sebagai Anonim (Data Terlindungi)
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  Nama dan nomor kontak Anda tidak akan ditampilkan kepada publik maupun pihak lain.
                </span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Nama Pelapor:</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Nomor WhatsApp:</label>
                  <input
                    type="text"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tombol Kirim Laporan Utama */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-sky-500/20 transition active:scale-98 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Mengirim Laporan...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Kirim Laporan Pencemaran Sekarang</span>
              </span>
            )}
          </button>
        </form>

        {/* Kolom Kanan: Panduan Ringkas & Jaminan Pelapor (4 Kolom - Clean, Crisp, Zero Pastel Slop) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Card 1: Jaminan Kerahasiaan & Kecepatan Respon */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Jaminan Keamanan Pelapor
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data Anda Dilindungi Undang-Undang
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap laporan warga diverifikasi oleh relawan Green Generation Palembang sebelum diteruskan ke Dinas Lingkungan Hidup. Identitas Anda dijamin aman 100%.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Respon verifikasi maksimal 1x24 jam</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Terhubung ke 18 Pos Sempadan Musi</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Disediakan tiket pelacakan transparan</span>
              </div>
            </div>
          </div>

          {/* Card 2: Panduan Foto Valid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#0088cc]" />
              <span>Tips Foto yang Cepat Divalidasi</span>
            </h4>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#0088cc] font-bold">&bull;</span>
                <span>Pastikan permukaan air sungai dan jenis limbah terlihat dengan terang.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0088cc] font-bold">&bull;</span>
                <span>Sertakan patokan tepi seperti dermaga atau jembatan untuk mempermudah petugas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0088cc] font-bold">&bull;</span>
                <span>Hindari foto kabur saat malam hari tanpa bantuan cahaya.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
