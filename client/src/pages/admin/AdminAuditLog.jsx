import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Database,
  Calendar,
  User,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

export default function AdminAuditLog() {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return (auditLogs || []).filter(log => {
      if (actionFilter !== 'all') {
        if (log.badge_type !== actionFilter) return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchPetugas = (log.petugas || '').toLowerCase().includes(q);
        const matchObjek = (log.objek_id || '').toLowerCase().includes(q);
        const matchCatatan = (log.catatan || '').toLowerCase().includes(q);
        if (!matchPetugas && !matchObjek && !matchCatatan) return false;
      }

      return true;
    });
  }, [auditLogs, actionFilter, searchTerm]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <Card className="p-6 sm:p-8 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ungu-100 text-ungu-800 text-xs font-bold">
              <History className="w-3.5 h-3.5" />
              <span>Transparansi Komunitas (NFR-5)</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Riwayat Verifikasi &amp; Tindakan Relawan
            </h1>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
              Catatan rekam jejak setiap aksi verifikasi laporan, penetapan status, penolakan tiket, dan ekspor data advokasi oleh tim GG River Care.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-garis text-xs font-bold text-ink self-start sm:self-auto">
            <span>{filteredLogs.length} Aktivitas Tercatat</span>
          </div>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama relawan, ID tiket, atau catatan..."
              className="w-full h-10 pl-10 pr-3.5 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-ungu-600 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 px-3.5 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-ungu-600"
            >
              <option value="all">Semua Jenis Aksi</option>
              <option value="valid">Verifikasi Valid</option>
              <option value="ditolak">Penolakan Laporan</option>
              <option value="ekspor">Ekspor Berkas</option>
              <option value="master">Update Master Data</option>
            </select>

            {(searchTerm || actionFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('all');
                }}
                className="p-2 text-ink-muted hover:text-ink cursor-pointer"
                title="Reset filter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Tabel Riwayat Verifikasi */}
      <Card className="p-0 overflow-hidden bg-white shadow-lembut">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-garis text-ink-muted uppercase font-bold text-xs select-none">
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Relawan Pelaksana</th>
                <th className="py-3.5 px-4">Tindakan</th>
                <th className="py-3.5 px-4">Objek Laporan</th>
                <th className="py-3.5 px-4">Catatan Verifikator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filteredLogs.map(log => {
                const isApproved = log.badge_type === 'valid';
                const isRejected = log.badge_type === 'ditolak';

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap font-medium">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-ungu-100 text-ungu-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {log.initials || 'GG'}
                        </div>
                        <div>
                          <span className="font-bold text-ink block">{log.petugas}</span>
                          <span className="text-xs text-ink-muted font-medium block">{log.role}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isApproved
                          ? 'bg-musi-100 text-musi-800'
                          : isRejected
                          ? 'bg-tingkat-berat-bg text-tingkat-berat-tx'
                          : 'bg-slate-100 text-ink-soft'
                      }`}>
                        {isApproved && <CheckCircle2 className="w-3 h-3 text-musi-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-tingkat-berat-tx" />}
                        <span>{log.tindakan}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-ink">
                      <span>{log.objek_id}</span>
                      <span className="block font-sans text-xs font-normal text-ink-muted">{log.objek_lokasi}</span>
                    </td>

                    <td className="py-3.5 px-4 text-ink-soft max-w-md leading-relaxed">
                      {log.catatan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
