import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../../components/common/Badges';

export default function AdminReports() {
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
    openVerifyModal
  } = useAdmin();

  const districts = [
    'Bukit Kecil',
    'Seberang Ulu I',
    'Seberang Ulu II',
    'Ilir Barat I',
    'Ilir Barat II',
    'Ilir Timur I',
    'Ilir Timur II',
    'Gandus',
    'Kertapati',
    'Kalidoni',
    'Plaju'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen & Verifikasi Laporan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh laporan pencemaran masuk untuk dievaluasi dan diklasifikasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-river-50 text-river-700 font-semibold border border-river-100">
            Total {filteredReports.length} Laporan Ditampilkan
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar (Layar 6 Figma) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'Semua Laporan', count: stats.total },
          { id: 'menunggu', label: 'Menunggu Verifikasi', count: stats.menunggu, color: 'text-amber-700 bg-amber-50' },
          { id: 'valid', label: 'Terverifikasi (Valid)', count: stats.valid, color: 'text-eco-700 bg-eco-50' },
          { id: 'ditolak', label: 'Ditolak', count: stats.ditolak, color: 'text-slate-600 bg-slate-100' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-river-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : tab.color || 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode tiket (SPP-...), judul, nama pelapor, atau kecamatan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-river-500"
          />
        </div>

        {/* Filter Kecamatan */}
        <div className="sm:col-span-3">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-river-500"
          >
            <option value="all">Semua Kecamatan</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                Kec. {d}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tingkat Keparahan */}
        <div className="sm:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-river-500"
          >
            <option value="all">Semua Tingkat Keparahan</option>
            <option value="berat">🔴 Tercemar Berat</option>
            <option value="sedang">🟡 Tercemar Sedang</option>
            <option value="ringan">🟢 Tercemar Ringan</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Laporan (Layar 6 Figma) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Kode Tiket</th>
                <th className="py-3.5 px-4">Laporan & Lokasi</th>
                <th className="py-3.5 px-4">Jenis Limbah</th>
                <th className="py-3.5 px-4">Tingkat Dugaan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal Masuk</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan laporan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Kode Tiket */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {report.tracking_code}
                      </span>
                    </td>

                    {/* Laporan & Lokasi */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.photo_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate group-hover:text-river-600 transition">
                            {report.title}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Kec. {report.district}</span>
                            <span>&bull;</span>
                            <span className="truncate">{report.address_landmark}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Jenis Limbah */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PollutionTypeBadge type={report.pollution_type} />
                    </td>

                    {/* Tingkat Dugaan */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={report.estimated_severity} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {new Date(report.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Tombol Aksi */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => openVerifyModal(report)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto ${
                          report.status === 'menunggu'
                            ? 'bg-river-600 hover:bg-river-700 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{report.status === 'menunggu' ? 'Verifikasi' : 'Detail'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
