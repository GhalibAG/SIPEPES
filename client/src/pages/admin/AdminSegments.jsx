import React, { useState } from 'react';
import {
  FolderTree,
  RotateCcw,
  Plus,
  Search,
  Download,
  Copy,
  Check,
  MapPin,
  Flame,
  Radio,
  Sliders,
  ExternalLink,
  ShieldAlert,
  FileText,
  Settings
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSegments({ onNavigate }) {
  const { sempadanList } = useAdmin();
  const [selectedPoint, setSelectedPoint] = useState(sempadanList[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('semua');
  const [copiedCode, setCopiedCode] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCopy = (coord, kode) => {
    navigator.clipboard.writeText(coord);
    setCopiedCode(kode);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredPoints = sempadanList.filter((p) => {
    if (activeTab === 'ulu' && !p.wilayah.toLowerCase().includes('ulu')) return false;
    if (searchTerm) {
      const match =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.wilayah.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Sesuai Desain Figma */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span>Portal Admin</span>
        <span>/</span>
        <span>Master Data</span>
        <span>/</span>
        <span className="text-[#0088cc] font-medium">Titik Sempadan Musi</span>
      </div>

      {/* Header Utama: Judul Pecah 2 Baris, Badge di Bawahnya, Lalu Paragraf Deskripsi */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          {/* Judul 2 Baris */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Kelola Master Titik Sempadan<br />
            Musi
          </h1>

          {/* Badge 18 POS DAS AKTIF Tepat di Bawah Judul */}
          <div className="mt-2.5 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200">
              18 POS DAS AKTIF
            </span>
          </div>

          {/* Deskripsi Dibatasi Lebarnya agar Pecah 3 Baris Sesuai Desain */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Inventarisasi 18 pos pantau dan dermaga sempadan DAS Musi Kota<br className="hidden sm:inline" />
            Palembang untuk validasi geofencing laporan warga, pemetaan<br className="hidden sm:inline" />
            buangan limbah, &amp; monitoring telemetri indeks kualitas air (IKA).
          </p>
        </div>

        {/* Tombol Kanan Atas */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => alert('Sinkronisasi Geospasial dengan Server DLHK Kota Palembang Berhasil.')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Sinkronisasi GIS DLH</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold shadow-sm shadow-[#0088cc]/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Titik Sempadan Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Titik Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              TOTAL TITIK TERDAFTAR
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0088cc] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              18 <span className="text-sm font-semibold text-slate-500">Titik Pantau</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              <strong className="text-slate-800">12</strong> Seberang Ulu &bull; <strong className="text-slate-800">6</strong> Seberang Ilir
            </p>
          </div>
        </div>

        {/* Pos Kritis / Rentan B3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              POS KRITIS / RENTAN B3
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              5 <span className="text-sm font-semibold text-rose-500">Titik Waspada</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Dermaga 7 Ulu, Kertapati, Tangga Buntung
            </p>
          </div>
        </div>

        {/* Buffer Sempadan Rata-Rata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              BUFFER SEMPADAN RATA-RATA
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              100 <span className="text-sm font-semibold text-slate-500">Meter</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Sesuai Perda RTRW Sungai Kota Palembang
            </p>
          </div>
        </div>

        {/* Status Telemetri Sensor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              STATUS TELEMETRI SENSOR
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              94.4% <span className="text-sm font-semibold text-emerald-500">Aktif</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              <strong className="text-slate-800">17</strong> Online &bull; <strong className="text-amber-600">1</strong> Kalibrasi
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Tabel Kiri + Detail Card Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Filter & Tabel Master Sempadan */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header Filter */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('semua')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'semua' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semua Titik (18)
              </button>
              <button
                onClick={() => setActiveTab('ulu')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'ulu' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Sektor Ulu (12)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama pos, kode, kecama..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={() => alert('Ekspor 18 Master Pos Sungai Musi ke format CSV Berhasil!')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Tabel Master */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">KODE TITIK</th>
                  <th className="py-3 px-4">NAMA POS &amp; WILAYAH</th>
                  <th className="py-3 px-4">GEOSPASIAL (LAT, LON)</th>
                  <th className="py-3 px-4">BUFFER</th>
                  <th className="py-3 px-4">INDEKS MUTU AIR</th>
                  <th className="py-3 px-4">LAP. WARG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPoints.map((p) => {
                  const isSelected = selectedPoint.kode === p.kode;
                  return (
                    <tr
                      key={p.kode}
                      onClick={() => setSelectedPoint(p)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-sky-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0088cc] whitespace-nowrap">
                        {p.kode}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{p.nama}</p>
                        <p className="text-[10px] text-slate-400">{p.wilayah}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{p.lat}, {p.lon}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(`${p.lat}, ${p.lon}`, p.kode);
                            }}
                            title="Salin Koordinat"
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          >
                            {copiedCode === p.kode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap font-semibold">
                        {p.buffer}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`font-mono font-bold flex items-center gap-1.5 ${
                            p.ika_status === 'Kritis'
                              ? 'text-rose-600'
                              : p.ika_status === 'Sedang'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.ika_status === 'Kritis'
                                ? 'bg-rose-500'
                                : p.ika_status === 'Sedang'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          {p.ika}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {p.laporan_warga} <span className="text-[10px] text-slate-400 font-normal">aktif</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Menampilkan 1-6 dari 18 Master Pos Sungai Musi</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded border border-slate-200 text-slate-400">&lt;</button>
              <button className="px-2.5 py-1 rounded bg-[#0088cc] text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
              <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
              <button className="px-2 py-1 rounded border border-slate-200 text-slate-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Titik Terpilih */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="text-[#0088cc]">📍</span>
                <span>DETAIL TITIK TERPILIH</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedPoint.ika_status === 'Kritis'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}
              >
                {selectedPoint.ika_status} &bull;
              </span>
            </div>

            <div>
              <span className="font-mono font-bold text-xs text-[#0088cc]">
                {selectedPoint.kode}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {selectedPoint.nama}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPoint.wilayah}, Palembang
              </p>
            </div>

            {/* Visualisasi Geofence Mini Map */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-sky-50/50 p-4 h-48 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm border border-slate-200">
                  🌐 Buffer Aktif: {selectedPoint.buffer} Geofence
                </span>
              </div>

              {/* Mock Peta Grafis */}
              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 ring-4 ring-rose-500/40 flex items-center justify-center mx-auto text-rose-600 animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                </div>
                <p className="text-[10px] font-mono text-slate-600 font-bold">
                  {selectedPoint.lat}, {selectedPoint.lon}
                </p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('map')}
                className="w-full py-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di GIS Full</span>
              </button>
            </div>

            {/* Metrik IKA & Laporan Warga */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Indeks Mutu Air (IKA)</p>
                <p className="text-base font-extrabold text-rose-600 mt-0.5">
                  {selectedPoint.ika} <span className="text-[10px] font-normal text-slate-500">PPM Cemar</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Laporan Warga Tertaut</p>
                <p className="text-base font-extrabold text-[#0088cc] mt-0.5">
                  {selectedPoint.laporan_warga} <span className="text-[10px] font-normal text-slate-500">Verifikasi</span>
                </p>
              </div>
            </div>

            {/* Regu Patroli Lapangan */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">🛡️</span>
                <div>
                  <p className="font-bold text-slate-800">Regu Patroli Lapangan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedPoint.regu_patroli}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Kontak Darurat Sempadan:</span>
                <strong className="text-slate-800 font-mono">{selectedPoint.kontak_darurat}</strong>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Telemetri: {selectedPoint.sensor}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Update: {selectedPoint.last_update}</span>
              </div>
            </div>

            {/* Tombol Konfigurasi */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => alert(`Buka pengaturan geofence untuk titik ${selectedPoint.kode}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Konfigurasi Geofence</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white transition shadow-sm"
                title="Cetak Berkas Titik"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dasar Hukum Buffer Sempadan Card */}
          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80 text-xs flex items-start gap-3">
            <span className="text-emerald-600 text-lg">📜</span>
            <div>
              <h4 className="font-bold text-emerald-950 text-xs mb-1">
                Dasar Hukum Buffer Sempadan
              </h4>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                {selectedPoint.dasar_hukum}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
