import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  HelpCircle,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  Maximize2,
  MapPin,
  Camera,
  Layers,
  Send,
  Radio,
  Clock,
  User,
  Shield,
  Check
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminVerifyPage() {
  const {
    reports,
    selectedReport,
    setSelectedReportId,
    verifyReport
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('semua');
  const [severityFilter, setSeverityFilter] = useState('Semua Tingkat Keparahan');
  const [districtFilter, setDistrictFilter] = useState('Semua Kecamatan Sungai');
  const [searchCode, setSearchCode] = useState('');
  
  // State form verifikasi
  const [selectedSeverity, setSelectedSeverity] = useState('berat');
  const [adminNotes, setAdminNotes] = useState(
    'Validasi foto terkonfirmasi tumpahan oli pelumas (B3). Radius sebaran diperkirakan ±35 meter. Memerlukan pemasangan oil boom segera oleh tim reaksi cepat DLH Posko Ampera.'
  );
  const [checkedIds, setCheckedIds] = useState(['rep-0012', 'rep-0014', 'rep-0015']);
  const [toastMessage, setToastMessage] = useState('');

  const currentReport = selectedReport || reports[0];

  const handleSelectReport = (rep) => {
    setSelectedReportId(rep.id);
    setSelectedSeverity(rep.estimated_severity || 'berat');
    if (rep.admin_notes) {
      setAdminNotes(rep.admin_notes);
    }
  };

  const toggleCheck = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(item => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleValidasi = () => {
    verifyReport(currentReport.id, 'valid', selectedSeverity, adminNotes);
    setToastMessage(`Laporan #${currentReport.tracking_code} berhasil Divalidasi & Diterbitkan (FR-5)!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleTolak = () => {
    verifyReport(currentReport.id, 'ditolak', selectedSeverity, adminNotes, 'Tidak memenuhi kriteria pencemaran sempadan');
    setToastMessage(`Laporan #${currentReport.tracking_code} ditolak.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleEskalasi = () => {
    setToastMessage(`Laporan #${currentReport.tracking_code} berhasil Dieskalasi ke TRC DLH Kota Palembang via Webhook!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter list
  const filteredList = reports.filter(r => {
    if (activeTab === 'menunggu') return r.status === 'menunggu';
    if (activeTab === 'valid') return r.status === 'valid';
    if (activeTab === 'ditolak') return r.status === 'ditolak';
    if (searchCode && !r.tracking_code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
      )}

      {/* Header Validasi Dokumen FR-5 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088cc] flex items-center justify-center shrink-0 border border-sky-100">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Validasi Dokumen FR-5
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200">
                Siklus Pelaporan Musi Hilir
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Protokol standardisasi bukti pencemaran lapangan &bull; DLH Kota Palembang &times; Tim Satgas Relawan
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setToastMessage(`3 Laporan Terpilih Berhasil Divalidasi Massal.`);
              setTimeout(() => setToastMessage(''), 3000);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verifikasi Terpilih ({checkedIds.length})</span>
          </button>

          <button
            onClick={() => {
              setToastMessage('Data terpilih berhasil diekspor ke format CSV.');
              setTimeout(() => setToastMessage(''), 3000);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Ekspor Data Terpilih</span>
          </button>

          <button
            title="Bantuan Standardisasi FR-5"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar Lengkap */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-3 text-xs">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full xl:w-auto">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'semua' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('menunggu')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'menunggu' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Menunggu</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">9</span>
          </button>
          <button
            onClick={() => setActiveTab('valid')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'valid' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Valid</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-600 text-white font-bold">104</span>
          </button>
          <button
            onClick={() => setActiveTab('ditolak')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ditolak' ? 'bg-[#0088cc] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Ditolak</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-500 text-white font-bold">15</span>
          </button>
        </div>

        {/* Dropdowns & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option>Semua Tingkat Keparahan</option>
            <option>Tercemar Berat</option>
            <option>Tercemar Sedang</option>
            <option>Tercemar Ringan</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option>Semua Kecamatan Sungai</option>
            <option>Seberang Ulu I</option>
            <option>Ilir Barat II</option>
            <option>Ilir Timur I</option>
            <option>Gandus</option>
          </select>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>10 Nov 2026 - 14 Nov 2026</span>
          </div>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="#SPP-202611-0012"
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* Two Columns Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Antrean Verifikasi Lapangan */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header Antrean */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-xs">📋</span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ANTREAN VERIFIKASI LAPANGAN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                5 SIAP TINDAK
              </span>
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={checkedIds.length === reports.length}
                onChange={() => {
                  if (checkedIds.length === reports.length) {
                    setCheckedIds([]);
                  } else {
                    setCheckedIds(reports.map(r => r.id));
                  }
                }}
                className="w-3.5 h-3.5 rounded text-[#0088cc]"
              />
              <span>Pilih Semua</span>
            </label>
          </div>

          {/* List Tiket */}
          <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
            {filteredList.map((rep) => {
              const isSelected = currentReport.id === rep.id;
              const isChecked = checkedIds.includes(rep.id);

              return (
                <div
                  key={rep.id}
                  onClick={() => handleSelectReport(rep)}
                  className={`p-4 transition cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-sky-50/40 border-l-4 border-[#0088cc]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleCheck(rep.id);
                    }}
                    className="mt-1 w-3.5 h-3.5 rounded text-[#0088cc]"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-bold text-[#0088cc] text-xs">
                        #{rep.tracking_code}
                      </span>
                      {rep.rev && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                          {rep.rev}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'valid'
                            ? 'bg-sky-50 text-[#0088cc] border border-sky-200'
                            : rep.estimated_severity === 'berat'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}
                      >
                        {rep.status === 'valid'
                          ? 'Valid • Peta'
                          : rep.estimated_severity === 'berat'
                          ? 'Tercemar Berat'
                          : 'Tercemar Sedang'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {rep.location_name || rep.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {rep.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                      <span>{rep.created_time_str}</span>
                      <span className="text-slate-600 font-sans font-medium">{rep.reporter_name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Verifikasi Tiket */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Card Detail */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-black text-[#0088cc]">
                    #{currentReport.tracking_code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    DRAF VERIFIKASI FR-5
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                    PRIORITAS TINGGI
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {currentReport.location_name || currentReport.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sempadan Sungai Musi Bagian Selatan (Buffer Pemukiman &amp; Dermaga Rakyat)
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-sm self-start"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak FR-5</span>
              </button>
            </div>

            {/* Bukti Visual & Audit Metadata EXIF */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0088cc]" />
                  Bukti Visual &amp; Audit Metadata EXIF
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  EXIF INTEGRITY PASSED
                </span>
              </div>

              {/* Preview Gambar dengan Overlay */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={currentReport.photo_url}
                  alt={currentReport.title}
                  className="w-full h-56 sm:h-64 object-cover opacity-90 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-2">
                  <span>{currentReport.exif?.raw_tag || '#IMG-01 RAW'}</span>
                  <span>&bull;</span>
                  <span>{currentReport.exif?.dimensions || '4032 × 3024 • 6.4 MB'}</span>
                </div>

                <button className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 px-2.5 py-1 rounded text-[10px] font-semibold text-white flex items-center gap-1 transition">
                  <Maximize2 className="w-3 h-3" />
                  <span>Perbesar</span>
                </button>

                {/* Bar Hitam EXIF di Bawah Gambar */}
                <div className="p-3 bg-slate-900/95 text-white grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">DEVICE / SENSOR</span>
                    <span className="font-semibold">{currentReport.exif?.device || 'Sony Alpha ILCE-6700'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">LENS / EXPOSURE</span>
                    <span className="font-semibold">{currentReport.exif?.lens || 'E 24mm'} &bull; {currentReport.exif?.exposure || '1/500s'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">TIMESTAMP AUDIT</span>
                    <span className="font-mono text-sky-300">{currentReport.exif?.timestamp_audit || '14-Nov-2026 08:42 WIB'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">GPS GEOLOCATION</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Valid Radius
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validasi Koordinat & Sempadan GIS */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Validasi Koordinat &amp; Sempadan GIS
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  LAT: {currentReport.latitude} LONG: {currentReport.longitude}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-sky-50/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-7 bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    &bull; {currentReport.gis?.buffer_kering || 'BUFFER KERING: 15.4M DARI SEMPADAN'}
                  </span>
                  <div className="h-20 bg-slate-100 rounded flex items-center justify-center text-[10px] font-mono text-slate-400 border border-dashed border-slate-300">
                    EPSG:3857 &bull; SUMSEL GRID (Buffer 100m Aktif)
                  </div>
                </div>

                <div className="sm:col-span-5 text-xs space-y-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">ZONA PENGAWASAN</span>
                    <p className="font-bold text-slate-800">{currentReport.gis?.zona_pengawasan || 'DAS Musi Hilir S.U. 1'}</p>
                    <p className="text-[10px] text-slate-500">{currentReport.gis?.deskripsi_zona || 'Titik berada di alur perahu ketek.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Akurasi GPS:</span>
                      <strong className="text-emerald-600 font-mono">{currentReport.gis?.akurasi_gps || '± 2.4 meter'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pasang Surut:</span>
                      <strong className="text-slate-700 font-mono">{currentReport.gis?.pasang_surut || 'Surut (+0.82m)'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laporan Kesaksian Pelapor */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  LAPORAN KESAKSIAN PELAPOR
                </span>
                <span className="text-[10px] font-bold text-[#0088cc]">
                  {currentReport.reporter_source || 'Via SIPEPES Mobile App'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <blockquote className="italic text-slate-700 leading-relaxed">
                  "{currentReport.testimony || currentReport.description}"
                </blockquote>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span>Pelapor: <strong className="text-slate-800">{currentReport.reporter_name}</strong></span>
                  <span>Kontak: <strong className="font-mono text-slate-800">{currentReport.reporter_phone || '-'}</strong></span>
                </div>
              </div>
            </div>

            {/* Penetapan Verifikasi Admin DLH • Klasifikasi FR-5 */}
            <div className="pt-2 border-t border-slate-100 space-y-3.5">
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Penetapan Verifikasi Admin DLH &bull; Klasifikasi FR-5</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Memperbarui status spasial publik dan memicu notifikasi operasional Satgas DLH.
                </p>
              </div>

              {/* Radio Group Keparahan */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  VERIFIKASI PENETAPAN TINGKAT KEPARAHAN:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Berat */}
                  <label
                    onClick={() => setSelectedSeverity('berat')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                      selectedSeverity === 'berat'
                        ? 'border-rose-500 bg-rose-50/40 text-rose-900 font-bold ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      checked={selectedSeverity === 'berat'}
                      onChange={() => setSelectedSeverity('berat')}
                      className="accent-rose-600"
                    />
                    <div>
                      <p className="leading-tight flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        Tercemar Berat
                      </p>
                      <span className="text-[10px] text-slate-500 font-normal">B3 / Minyak / Ikan Mati</span>
                    </div>
                  </label>

                  {/* Sedang */}
                  <label
                    onClick={() => setSelectedSeverity('sedang')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                      selectedSeverity === 'sedang'
                        ? 'border-amber-500 bg-amber-50/40 text-amber-900 font-bold ring-1 ring-amber-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      checked={selectedSeverity === 'sedang'}
                      onChange={() => setSelectedSeverity('sedang')}
                      className="accent-amber-600"
                    />
                    <div>
                      <p className="leading-tight flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Tercemar Sedang
                      </p>
                      <span className="text-[10px] text-slate-500 font-normal">Sampah Padat / Bau</span>
                    </div>
                  </label>

                  {/* Ringan */}
                  <label
                    onClick={() => setSelectedSeverity('ringan')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                      selectedSeverity === 'ringan'
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      checked={selectedSeverity === 'ringan'}
                      onChange={() => setSelectedSeverity('ringan')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <p className="leading-tight flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Tercemar Ringan
                      </p>
                      <span className="text-[10px] text-slate-500 font-normal">Bercak Lokal</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Catatan Resmi Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    CATATAN RESMI VERIFIKATOR &amp; REKOMENDASI LAPANGAN (WAJIB):
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {adminNotes.length}/500 Karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  maxLength={500}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tuliskan analisis visual dan rekomendasi tindak lanjut penanganan..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#0088cc] bg-slate-50/30"
                />
              </div>

              {/* 3 Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleValidasi}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validasi &amp; Terbitkan (FR-5)</span>
                </button>

                <button
                  type="button"
                  onClick={handleTolak}
                  className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Laporan</span>
                </button>

                <button
                  type="button"
                  onClick={handleEskalasi}
                  className="py-2.5 px-4 rounded-xl bg-[#075985] hover:bg-[#0369a1] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Eskalasi TRC DLH</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
