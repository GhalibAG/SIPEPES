import React, { useState } from 'react';
import {
  Shield,
  Calendar,
  Download,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Database,
  Key,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminAuditLog() {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('Semua Aksi');
  const [officerFilter, setOfficerFilter] = useState('Semua Petugas');

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Rantai Blok Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Portal Admin</span>
          <span>&gt;</span>
          <span>Keamanan &amp; Kepatuhan</span>
          <span>&gt;</span>
          <span className="text-[#0088cc] font-medium">Log Audit Petugas</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold self-start sm:self-auto">
          <Shield className="w-3.5 h-3.5" />
          <span>Rantai Blok Internal: Aktif &amp; Terkunci</span>
        </div>
      </div>

      {/* Header Utama & Tombol Export Stacked Sesuai Desain Figma */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Log Audit Aktivitas &amp; Rekam Jejak Petugas
          </h1>
          {/* Subtitle dengan Penekanan Warna Biru pada NFR-5 Sesuai Desain */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Rekam jejak tidak dapat diubah (<strong>immutable audit trail</strong>) untuk setiap tindakan verifikasi, perubahan status laporan, dan ekspor data advokasi sesuai standar <strong className="text-[#0088cc] font-bold">NFR-5 &amp; UU PPLH No. 32/2009</strong>.
          </p>
        </div>

        {/* Kolom Kanan: Filter Tanggal di Baris 1 & Tombol Unduh Laporan di Baris 2 (Vertically Stacked) */}
        <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0 self-start lg:self-auto w-full sm:w-auto">
          {/* Baris 1: Filter Tanggal */}
          <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium w-full sm:w-auto cursor-pointer">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>01 Nov 2026 - 14 Nov 2026</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>

          {/* Baris 2: Tombol Unduh Laporan Audit Kriptografis */}
          <button
            onClick={() => alert('Mengunduh Laporan Audit Kriptografis (SHA-256 Timestampped PDF)...')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#075985] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md shadow-[#075985]/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan Audit (PDF Kriptografis)</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aktivitas Periode */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Aktivitas Periode
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,428 Aktivitas</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ↗ +12% <span className="text-slate-400 font-normal">vs siklus bulan lalu</span>
            </p>
          </div>
        </div>

        {/* Verifikasi Selesai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Verifikasi Selesai
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">104 Tiket</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Divalidasi ke Tim Reaksi Cepat
            </p>
          </div>
        </div>

        {/* Diskualifikasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Diskualifikasi
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">15 Tiket Ditolak</div>
            <p className="text-[11px] text-slate-500 mt-1">
              100% alasan terdokumentasi
            </p>
          </div>
        </div>

        {/* Integritas Hash */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Integritas Hash
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100% Sah</div>
            <p className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>SHA-256 Rantai Valid</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Tipe Aksi:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option>Semua Aksi</option>
              <option>Verifikasi Valid</option>
              <option>Penolakan Tiket</option>
              <option>Ekspor PDF</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Petugas:</span>
            <select
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
            >
              <option>Semua Petugas</option>
              <option>M. Ridho Pratama</option>
              <option>Nadia Sabrina, S.Si</option>
              <option>Admin DLHK Sumsel</option>
            </select>
          </div>

          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]">
            Protokol Audit: ISO 27001 / Annex A.12.4
          </span>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID Tiket, IP Address, atau..."
            className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0088cc]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            CTRL+K
          </span>
        </div>
      </div>

      {/* Tabel Alur Kronologis Rekam Jejak Forensik */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#0088cc] animate-ping" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Alur Kronologis Rekam Jejak Forensik
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
              5 Entri Terbaru Terpilih
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Runtun Hash: #008432 → #008436
            </span>
            <button className="flex items-center gap-1 hover:text-slate-800 transition">
              <RotateCcw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">TIMESTAMP (WIB)</th>
                <th className="py-3 px-4">PETUGAS &amp; PERAN</th>
                <th className="py-3 px-4">TINDAKAN</th>
                <th className="py-3 px-4">OBJEK &amp; REF ID</th>
                <th className="py-3 px-4">RANGKUMAN / CATATAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => {
                let badgeClass = 'bg-slate-100 text-slate-700';
                if (log.badge_type === 'valid') badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                if (log.badge_type === 'ditolak') badgeClass = 'bg-rose-50 text-rose-700 border border-rose-200';
                if (log.badge_type === 'ekspor') badgeClass = 'bg-sky-50 text-sky-700 border border-sky-200';
                if (log.badge_type === 'master') badgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
                if (log.badge_type === 'auth') badgeClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                          {log.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{log.petugas}</p>
                          <p className="text-[10px] text-slate-400">{log.nip} &bull; {log.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${badgeClass}`}>
                        {log.tindakan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-mono font-bold text-[#0088cc]">{log.objek_id}</p>
                        <p className="text-[10px] text-slate-500">{log.objek_lokasi}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-md leading-relaxed text-[11px]">
                      {log.catatan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Menampilkan 1-5 dari 1,428 entri</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Konsistensi Rantai Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-[#0088cc] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">286</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Card Sertifikasi & Keabsahan Bukti Digital */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0088cc] flex items-center justify-center shrink-0 shadow-sm">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Sertifikasi &amp; Keabsahan Bukti Digital
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                BSrE / UU ITE Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Semua catatan log audit ini disegel secara kriptografis menggunakan algoritma <strong>SHA-256</strong> dengan cap waktu bersertifikat (<strong>RFC 3161 Timestamping</strong>). Sah sebagai alat bukti hukum pemantauan lingkungan menurut UU No. 32 Tahun 2009 &amp; Pasal 5 UU ITE.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shrink-0 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-semibold">Kunci Publik Otoritas:</p>
            <p className="text-xs font-mono text-slate-700 font-bold">sip-ppl-sumsel-2026-root.crt</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
