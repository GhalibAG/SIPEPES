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
      {/* Header Utama Audit Forensik (Clean Unified Banner Card) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              KEAMANAN &amp; KEPATUHAN
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              ISO 27001 &bull; UU PPLH No. 32/2009
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 ml-1">
              <Check className="w-3 h-3" />
              Rantai Blok Terkunci
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            Log Audit &amp; Rekam Jejak Petugas
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Rekam jejak tidak dapat diubah (<strong>immutable audit trail</strong>) untuk setiap tindakan verifikasi lapangan, perubahan status, dan ekspor data advokasi sesuai standar <strong className="text-slate-800">NFR-5</strong>.
          </p>
        </div>

        {/* Action Group di Kanan */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer hover:bg-slate-100/70 transition">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>01 - 14 Nov 2026</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </div>

          <button
            onClick={() => alert('Mengunduh Laporan Audit Kriptografis (SHA-256 Timestampped PDF)...')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF Kriptografis</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards: Simpel & Tidak Numpuk */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Aktivitas Periode */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Aktivitas Periode</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">1,428</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                ↗ +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Total aktivitas siklus ini</p>
          </div>
        </div>

        {/* Card 2: Verifikasi Selesai */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Verifikasi Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">104</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white shrink-0">
                Tiket
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Diteruskan ke TRC DLH</p>
          </div>
        </div>

        {/* Card 3: Diskualifikasi */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Diskualifikasi</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">15</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0">
                Ditolak
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">100% terdokumentasi legal</p>
          </div>
        </div>

        {/* Card 4: Integritas Hash */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Integritas Hash</span>
            <Shield className="w-4 h-4 text-slate-900" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">100% Sah</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                SHA-256
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Rantai blok tervalidasi</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Terpadu */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs">
        {/* Search Input Utama */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID tiket, nama petugas, IP address..."
            className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs font-mono"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 hidden sm:inline">
            CTRL+K
          </span>
        </div>

        {/* Dropdowns Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative sm:w-44 flex-1 sm:flex-initial">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-xs"
            >
              <option>Semua Aksi</option>
              <option>Verifikasi Valid</option>
              <option>Penolakan Tiket</option>
              <option>Ekspor PDF</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative sm:w-48 flex-1 sm:flex-initial">
            <select
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-xs"
            >
              <option>Semua Petugas</option>
              <option>M. Ridho Pratama</option>
              <option>Nadia Sabrina, S.Si</option>
              <option>Admin DLHK Sumsel</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabel Alur Kronologis Rekam Jejak Forensik */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Alur Kronologis Rekam Jejak Forensik
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
              5 Entri Terbaru Terpilih
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-800 font-semibold flex items-center gap-1.5">

              Runtun Hash: #008432 → #008436
            </span>
            <button className="flex items-center gap-1 hover:text-slate-800 transition">
              <RotateCcw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tampilan Mobile */}
        <div className="p-3.5 space-y-3 md:hidden divide-y divide-slate-100">
          {auditLogs.map((log) => {
            let badgeClass = 'bg-slate-900 text-white';
            if (log.badge_type === 'valid') badgeClass = 'bg-emerald-600 text-white';
            if (log.badge_type === 'ditolak') badgeClass = 'bg-rose-600 text-white';
            if (log.badge_type === 'ekspor') badgeClass = 'bg-slate-900 text-white';
            if (log.badge_type === 'master') badgeClass = 'bg-amber-500 text-white';
            if (log.badge_type === 'auth') badgeClass = 'bg-slate-800 text-white';

            return (
              <div key={log.id} className="pt-3 first:pt-0 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block">{log.timestamp}</span>
                    <span className="font-mono font-bold text-xs text-slate-900">{log.objek_id}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({log.objek_lokasi})</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase shrink-0 ${badgeClass}`}>
                    {log.tindakan}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {log.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{log.petugas}</p>
                    <p className="text-[10px] text-slate-400 truncate">{log.nip} &bull; {log.role}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {log.catatan}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tampilan Desktop */}
        <div className="hidden md:block overflow-x-auto">
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
                let badgeClass = 'bg-slate-900 text-white';
                if (log.badge_type === 'valid') badgeClass = 'bg-emerald-600 text-white';
                if (log.badge_type === 'ditolak') badgeClass = 'bg-rose-600 text-white';
                if (log.badge_type === 'ekspor') badgeClass = 'bg-slate-900 text-white';
                if (log.badge_type === 'master') badgeClass = 'bg-amber-500 text-white';
                if (log.badge_type === 'auth') badgeClass = 'bg-slate-800 text-white';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
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
                        <p className="font-mono font-bold text-slate-900">{log.objek_id}</p>
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
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Konsistensi Rantai Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">&lt;</button>
            <button className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">286</button>
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Card Sertifikasi & Keabsahan Bukti Digital */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Key className="w-4 h-4 sm:w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Sertifikasi &amp; Keabsahan Bukti Digital
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                BSrE / UU ITE Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Semua catatan log audit ini disegel secara kriptografis menggunakan algoritma <strong>SHA-256</strong> dengan cap waktu bersertifikat (<strong>RFC 3161 Timestamping</strong>). Sah sebagai alat bukti hukum pemantauan lingkungan menurut UU No. 32 Tahun 2009 &amp; Pasal 5 UU ITE.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0 shadow-2xs w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <p className="text-[10px] text-slate-400 font-semibold">Kunci Publik Otoritas:</p>
            <p className="text-xs font-mono text-slate-700 font-bold truncate">sip-ppl-sumsel-2026-root.crt</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
