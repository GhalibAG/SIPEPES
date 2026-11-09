import React, { useState } from 'react';
import {
  Database,
  Cloud,
  Radio,
  FileCheck,
  RotateCcw,
  Save,
  Globe,
  Sliders,
  FileCode,
  RadioTower,
  ShieldCheck,
  Info,
  Check,
  Send
} from 'lucide-react';

export default function AdminSettings() {
  const [activeSubTab, setActiveSubTab] = useState('buffer');
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [autoDeduplicate, setAutoDeduplicate] = useState(true);
  const [ticketExpiry, setTicketExpiry] = useState('48 Jam (Standar Operasional DLHK)');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState('2.0');
  const [exifValidation, setExifValidation] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const navItems = [
    { id: 'buffer', label: 'Buffer GIS & Validasi', icon: Globe },
    { id: 'ika', label: 'Standar Ambang IKA', icon: Sliders },
    { id: 'media', label: 'Berkas & Kompresi (FR-3)', icon: FileCode },
    { id: 'partnership', label: 'Jalur Kemitraan TRC DLH', icon: RadioTower },
    { id: 'security', label: 'Verifikator & Keamanan', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Notifikasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Portal Admin</span>
          <span>&gt;</span>
          <span>Konfigurasi</span>
          <span>&gt;</span>
          <span className="text-[#0088cc] font-medium">Pengaturan Sistem</span>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Semua konfigurasi berhasil disinkronkan ke server</span>
          </div>
        )}
      </div>

      {/* Header Utama & Tombol Action */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan &amp; Konfigurasi Sistem SIPEPES
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Manajemen parameter operasional pelaporan DAS Musi, ambang batas IKA, integrasi storage bukti, dan protokol kemitraan regulasi DLHK Kota Palembang.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setGeofenceRadius(100);
              setAutoDeduplicate(true);
              setAutoEscalate(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset ke Default</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold shadow-sm shadow-[#0088cc]/20 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </div>

      {/* 4 Status Badges Atas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">STATUS BASIS DATA</p>
              <p className="text-xs font-bold text-slate-800">PostgreSQL &amp; GIS</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            &bull; Aktif
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">S3 MEDIA STORAGE</p>
              <p className="text-xs font-bold text-slate-800">42ms Latency</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Terhubung
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">TRC DLH ESCALATION</p>
              <p className="text-xs font-bold text-slate-800">Standby 24/7</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Siaga
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">REGULASI BAKU MUTU</p>
              <p className="text-xs font-bold text-slate-800">Perda 3 Plg</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            Valid
          </span>
        </div>
      </div>

      {/* Main Grid: Sub-nav di Kiri & Form Konten di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Navigasi Sub-Tab & Pedoman Pengelola */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition ${
                    isActive
                      ? 'bg-sky-50 text-[#0088cc]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0088cc]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pedoman Pengelola */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-1.5">
              <Info className="w-4 h-4 text-[#0088cc]" />
              <span>Pedoman Pengelola</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Perubahan ambang batas IKA dan toleransi sempadan akan diterapkan seketika pada seluruh form mobile GG River Care dan dasbor verifikasi lapangan.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-[10px] text-slate-400">
              Terakhir diubah: <span className="font-medium text-slate-600">28 Okt 2026 &bull; 14:22 WIB</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Semua Panel Konfigurasi */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Parameter Validasi Pelaporan Warga */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0088cc] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Parameter Validasi Pelaporan Warga
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Kendali presisi geospasial, filtering laporan out-of-boundary, dan klasterisasi duplikasi.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                PARAM-GIS-01
              </span>
            </div>

            {/* Slider Geofencing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Geofencing Radius Toleransi Sempadan Musi
                </span>
                <span className="font-bold px-2 py-0.5 rounded bg-sky-50 text-[#0088cc] border border-sky-200">
                  {geofenceRadius} Meter
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Laporan warga yang diajukan di luar toleransi sempadan ini akan otomatis ditandai dengan peringatan status <em>"Di Luar Sempadan Resmi Musi"</em> saat masuk antrean verifikasi.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-mono text-slate-400">20m</span>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(e.target.value)}
                  className="w-full accent-[#0088cc] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-400">300m</span>
              </div>
            </div>

            {/* Toggle Deteksi Duplikasi */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="max-w-md">
                <p className="text-xs font-semibold text-slate-800">
                  Deteksi Duplikasi Laporan Otomatis
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kelompokkan otomatis laporan warga dalam radius 50 meter dan rentang waktu 2 jam ke dalam satu tiket induk (cluster incident) untuk menghindari beban ganda tim patroli.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoDeduplicate(!autoDeduplicate)}
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  autoDeduplicate ? 'bg-[#0088cc]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    autoDeduplicate ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Input Masa Kedaluwarsa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Masa Kedaluwarsa Tiket Menunggu Verifikasi
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Batas waktu SLA sebelum laporan berstatus Menunggu dialihkan ke notifikasi tindak lanjut dinas atau ditandai arsip pasif.
                </p>
              </div>
              <input
                type="text"
                value={ticketExpiry}
                onChange={(e) => setTicketExpiry(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium sm:w-64 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Standar Ambang Batas Indeks Kualitas Air (IKA) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Standar Ambang Batas Indeks Kualitas Air (IKA)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Penyesuaian klasifikasi Perda No. 3 Palembang untuk integrasi sensor DO, pH, COD, dan TSS.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                PERDA-PLG-03
              </span>
            </div>

            {/* 3 Kategori Kartu IKA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ringan */}
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Ringan
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Kategori I</span>
                </div>
                <p className="text-xs font-extrabold text-slate-900">Nilai IKA 0.0 – 50.0</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Air relatif stabil, membutuhkan monitoring rutin komunal GG River Care.
                </p>
                <div className="w-full h-1 bg-emerald-500 rounded-full mt-2.5"></div>
              </div>

              {/* Sedang */}
              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Sedang
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Kategori II</span>
                </div>
                <p className="text-xs font-extrabold text-slate-900">Nilai IKA 50.1 – 70.0</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Limbah domestik/organik terdeteksi, perlu penjadwalan patroli perahu.
                </p>
                <div className="w-full h-1 bg-amber-500 rounded-full mt-2.5"></div>
              </div>

              {/* Berat */}
              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Berat
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Kategori III</span>
                </div>
                <p className="text-xs font-extrabold text-slate-900">Nilai IKA 70.1 – 100.0</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Indikasi tumpahan oli / limbah kimia industri, bahaya hayati sungai aktif.
                </p>
                <div className="w-full h-1 bg-rose-500 rounded-full mt-2.5"></div>
              </div>
            </div>

            {/* Toggle Auto-Escalation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="max-w-md">
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="text-rose-500">⚡</span>
                  Auto-Escalation ke TRC DLH
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bila diaktifkan, setiap laporan berstatus "Tercemar Berat / B3" akan seketika menembakkan alert darurat ke WhatsApp Tim Reaksi Cepat DLH dan menyalakan pin radar merah di Peta GIS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoEscalate(!autoEscalate)}
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  autoEscalate ? 'bg-rose-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    autoEscalate ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Konfigurasi Media & Kompresi Client (FR-3) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Konfigurasi Media &amp; Kompresi Client (FR-3)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Manajemen beban transmisi jaringan seluler tepian sungai dan integritas metadata foto.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                MEDIA-FR3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Batas Maksimum Berkas Foto */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Batas Maksimum Berkas Foto
                </label>
                <p className="text-[10px] text-slate-400">
                  Foto berukuran lebih dari nilai ini akan otomatis dikompresi di sisi browser pelapor (Canvas WebP) sebelum proses transmisi.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={maxFileSize}
                    onChange={(e) => setMaxFileSize(e.target.value)}
                    className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">Megabyte (MB)</span>
                </div>
              </div>

              {/* Format Berkas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Format Berkas Yang Diizinkan
                </label>
                <p className="text-[10px] text-slate-400">
                  Pilih ekstensi raster gambar yang diterima server SIPEPES.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-700 font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#0088cc]" />
                    <span>JPEG / JPG</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#0088cc]" />
                    <span>PNG</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#0088cc]" />
                    <span>WebP (Optimal)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-400 cursor-not-allowed">
                    <input type="checkbox" disabled className="rounded text-slate-300" />
                    <span>HEIC (Apple Raw)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Toggle EXIF Anti-Spoofing */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="max-w-md">
                <p className="text-xs font-semibold text-slate-800">
                  Wajib Pemeriksaan Metadata Sensor (EXIF Anti-Spoofing)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Periksa timestamp asli kamera dan geotag tersemat dari perangkat pelapor untuk mencegah pengunggahan foto arsip lawas atau manipulasi lokasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExifValidation(!exifValidation)}
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  exifValidation ? 'bg-[#0088cc]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    exifValidation ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 4: Notifikasi & Jalur Kemitraan Eksternal */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0088cc] flex items-center justify-center">
                  <RadioTower className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Notifikasi &amp; Jalur Kemitraan Eksternal
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Jalur sinkronisasi data langsung dengan Dinas Lingkungan Hidup dan Kehutanan Sumsel.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                INT-DLHK
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Hotline WhatsApp DLH Palembang
              </label>
              <input
                type="text"
                defaultValue="+62 812-7390-099"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Menerima rekapan harian ringkas (Daily Digest) setiap pukul 17:00 WIB.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Webhook Kedaruratan TRC DLH (Payload JSON)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue="https://api.dlh.palembang.go.id/v1/emergency-webhook"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                />
                <button className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition">
                  <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span>Uji Ping</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">Supabase Data Layer</p>
                  <p className="text-[10px] text-slate-400">Cluster ap-southeast-1 &bull; 42ms</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">S3 Bucket (Bukti Foto)</p>
                  <p className="text-[10px] text-slate-400 font-mono">musi-evidence-vault-enc256</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>

          {/* Section 5: Tim Verifikator & Sesi Petugas */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Tim Verifikator &amp; Sesi Petugas
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Standar otentikasi birokrasi, proteksi audit trail, dan siklus pencadangan data.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                AUTH-SECURITY
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Durasi Sesi Login Dinas (JWT Token)</p>
                <p className="text-[11px] text-slate-500">
                  Petugas wajib melakukan login ulang setelah periode ini berakhir atau bila IP lokasi berpindah secara signifikan.
                </p>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-center">
                30 Hari (Perangkat Dinas Terdaftar)
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="max-w-md">
                <p className="text-xs font-semibold text-slate-800">Dua Faktor Otentikasi (2FA OTP)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Wajibkan verifikasi TOTP Authenticator untuk akun dengan level wewenang <em>Kepala Seksi &amp; Verifikator Utama DLH</em> sebelum menerbitkan status validasi hukum.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  twoFactorAuth ? 'bg-[#0088cc]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    twoFactorAuth ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-800">Pencadangan Database Otomatis</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Snapshot penuh SQL + Spasial Geometri diekspor setiap 24 jam ke Cloud Cold Storage terenkripsi AES-256.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pukul 02:00 WIB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

