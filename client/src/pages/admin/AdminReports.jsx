import React, { useState } from 'react';
import {
  Search,
  Eye,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Map,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../../components/common/Badges';

const createMiniPin = (severity) => {
  const colorMap = { berat: '#DC2626', sedang: '#D97706', ringan: '#059669' };
  const color = colorMap[severity] || '#0284C7';
  return L.divIcon({
    className: 'custom-table-pin',
    html: `<div style="width: 24px; height: 24px; background-color: ${color}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

export default function AdminReports({ onNavigate }) {
  const {
    filteredReports,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    districtFilter,
    setDistrictFilter,
    severityFilter,
    setSeverityFilter,
    stats,
    selectedReport,
    setSelectedReportId
  } = useAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const districts = [
    'Bukit Kecil', 'Seberang Ulu I', 'Seberang Ulu II', 'Ilir Barat I',
    'Ilir Barat II', 'Ilir Timur I', 'Ilir Timur II', 'Gandus', 'Kalidoni'
  ];

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedPos = selectedReport
    ? [selectedReport.latitude, selectedReport.longitude]
    : [-2.9909, 104.7565];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman (Sesuai Layar 6 Figma) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Daftar Laporan</span>
            <span>&bull;</span>
            <span className="text-river-600 font-semibold">Tabel Rekapitulasi Data</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rekapitulasi Seluruh Laporan Warga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencarian, penyaringan data komprehensif, dan pratinjau lokasi titik laporan
          </p>
        </div>

        <button
          onClick={() => onNavigate('export')}
          className="px-4 py-2 bg-river-50 hover:bg-river-100 text-river-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto border border-river-200"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Ekspor Rekap Data</span>
        </button>
      </div>

      {/* 4 Pills Statistik Ringkas di Atas Tabel (Sesuai Layar 6 Figma) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Total Masuk</span>
          <span className="text-lg font-black text-slate-900">{stats.total}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800">Menunggu Review</span>
          <span className="text-lg font-black text-amber-800">{stats.menunggu}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-eco-200 bg-eco-50/30 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-eco-800">Tervalidasi</span>
          <span className="text-lg font-black text-eco-800">{stats.valid}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Ditolak</span>
          <span className="text-lg font-black text-slate-700">{stats.ditolak}</span>
        </div>
      </div>

      {/* Grid: Tabel Kiri (8 Kolom) + Panel Kanan Ringkasan Lokasi (4 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= TABEL LAPORAN (8 Kolom) ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Filter Status */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Semua Laporan', count: stats.total },
              { id: 'menunggu', label: 'Menunggu', count: stats.menunggu, color: 'text-amber-700 bg-amber-100' },
              { id: 'valid', label: 'Valid', count: stats.valid, color: 'text-eco-700 bg-eco-100' },
              { id: 'ditolak', label: 'Ditolak', count: stats.ditolak, color: 'text-slate-600 bg-slate-200' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-river-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari kode tiket, judul, pelapor..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-river-500 shadow-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={districtFilter}
                onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-river-500 shadow-sm text-slate-700"
              >
                <option value="all">Semua Kecamatan</option>
                {districts.map(d => <option key={d} value={d}>Kec. {d}</option>)}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={severityFilter}
                onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-river-500 shadow-sm text-slate-700"
              >
                <option value="all">Semua Keparahan</option>
                <option value="berat">🔴 Berat</option>
                <option value="sedang">🟡 Sedang</option>
                <option value="ringan">🟢 Ringan</option>
              </select>
            </div>
          </div>

          {/* Tabel Utama */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3.5">Kode</th>
                    <th className="py-3 px-3.5">Judul Laporan</th>
                    <th className="py-3 px-3.5">Kecamatan</th>
                    <th className="py-3 px-3.5">Tingkat</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Tidak ada laporan yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report) => {
                      const isSelected = selectedReport?.id === report.id;
                      return (
                        <tr
                          key={report.id}
                          onClick={() => setSelectedReportId(report.id)}
                          className={`cursor-pointer transition ${
                            isSelected ? 'bg-river-50/80 font-medium' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {report.tracking_code}
                          </td>
                          <td className="py-3 px-3.5 max-w-[200px]">
                            <p className="font-bold text-slate-900 truncate">{report.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{report.address_landmark}</p>
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                            Kec. {report.district}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <SeverityBadge severity={report.estimated_severity} />
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReportId(report.id);
                                onNavigate('verify');
                              }}
                              className="px-2.5 py-1 bg-river-600 hover:bg-river-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition inline-flex items-center gap-1"
                            >
                              <span>Verifikasi</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Sesuai Layar 6 Figma) */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Halaman {currentPage} dari {totalPages}</span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-md font-bold transition ${
                      currentPage === page
                        ? 'bg-river-600 text-white'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PANEL KANAN: PREVIEW TITIK & DETAIL (4 Kolom) ================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-river-600" /> Pratinjau Titik Terpilih
            </h3>
            <button
              onClick={() => onNavigate('map')}
              className="text-[11px] font-bold text-river-600 hover:underline flex items-center gap-1"
            >
              <span>Buka Peta Penuh</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {selectedReport ? (
            <>
              {/* Mini Map */}
              <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200">
                <MapContainer
                  center={selectedPos}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={selectedPos} icon={createMiniPin(selectedReport.estimated_severity)} />
                </MapContainer>
              </div>

              {/* Info Card Ringkas */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedReport.photo_url}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <span className="font-mono font-bold text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {selectedReport.tracking_code}
                    </span>
                    <h4 className="font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {selectedReport.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      📍 Kec. {selectedReport.district}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Tingkat Pencemaran:</span>
                    <SeverityBadge severity={selectedReport.estimated_severity} />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status Laporan:</span>
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('verify')}
                  className="w-full py-2 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>Buka Form Verifikasi Lengkap</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              Pilih baris tabel untuk melihat lokasi titik.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
