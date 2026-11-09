import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  ArrowUpRight,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  FileCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import PollutionBarChart from '../../components/admin/PollutionBarChart';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../../components/common/Badges';

export default function AdminDashboard({ onNavigate }) {
  const { stats, reports, riverSegments, activities, setSelectedReportId } = useAdmin();

  // 3 Laporan menunggu verifikasi untuk list tindakan cepat
  const pendingReports = reports.filter(r => r.status === 'menunggu').slice(0, 3);

  const handleQuickVerify = (reportId) => {
    setSelectedReportId(reportId);
    onNavigate('verify'); // Langsung buka halaman Verifikasi Laporan (Layar 3 Figma)
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman (Sesuai Layar 2 Figma) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Dashboard</span>
            <span>&bull;</span>
            <span className="text-river-600 font-semibold">Ringkasan Sistem</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Pengawasan & Evaluasi Pencemaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring kondisi Sungai Musi Kota Palembang dan tindak lanjut laporan warga
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('verify')}
            className="px-4 py-2 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <span>Verifikasi Laporan ({stats.menunggu})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Cards Statistik Berjajar (Sesuai Layar 2 Figma) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Total Laporan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Laporan
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.total}</h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              Semua
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Seluruh aliran Musi</p>
        </div>

        {/* 2. Menunggu Verifikasi */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Menunggu
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-amber-900">{stats.menunggu}</h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded animate-pulse">
              Prioritas
            </span>
          </div>
          <p className="text-[10px] text-amber-600 mt-1 truncate">Perlu evaluasi tim</p>
        </div>

        {/* 3. Terverifikasi Valid */}
        <div className="bg-white p-4 rounded-2xl border border-eco-200/90 bg-eco-50/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-eco-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-eco-600" /> Terverifikasi
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-eco-900">{stats.valid}</h3>
            <span className="text-[10px] font-bold text-eco-700 bg-eco-100 px-1.5 py-0.5 rounded">
              Valid
            </span>
          </div>
          <p className="text-[10px] text-eco-600 mt-1 truncate">Tampil di peta publik</p>
        </div>

        {/* 4. Ditolak */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-400" /> Ditolak
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-700">{stats.ditolak}</h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              Hoax/Out
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Bukan titik sungai</p>
        </div>

        {/* 5. Rekapitulasi Advokasi */}
        <div className="bg-white p-4 rounded-2xl border border-river-200/90 bg-river-50/20 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-river-700 uppercase tracking-wider flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3 text-river-600" /> Siap Advokasi
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-river-900">{stats.valid}</h3>
            <span className="text-[10px] font-bold text-river-700 bg-river-100 px-1.5 py-0.5 rounded">
              Dokumen
            </span>
          </div>
          <p className="text-[10px] text-river-600 mt-1 truncate">Siap audiensi ke DLH</p>
        </div>
      </div>

      {/* Grid 2 Kolom (Sesuai Layar 2 Figma: Kiri ~68%, Kanan ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= KOLOM KIRI (8 Kolom) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Box 1: Stacked Bar Chart Tren Laporan */}
          <PollutionBarChart />

          {/* Box 2: Daftar Laporan Perlu Verifikasi Segera */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Laporan Perlu Tindakan Segera
                </h3>
                <p className="text-xs text-slate-500">
                  Laporan masuk dari warga yang belum diverifikasi validitasnya
                </p>
              </div>

              <button
                onClick={() => onNavigate('verify')}
                className="text-xs font-bold text-river-600 hover:text-river-700 transition"
              >
                Lihat Semua &rarr;
              </button>
            </div>

            {pendingReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada laporan yang sedang menunggu verifikasi.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={report.photo_url}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {report.tracking_code}
                          </span>
                          <SeverityBadge severity={report.estimated_severity} />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {report.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> Kec. {report.district}
                          </span>
                          <span>&bull;</span>
                          <span>{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickVerify(report.id)}
                      className="px-3.5 py-1.5 bg-river-600 hover:bg-river-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1 self-end sm:self-center shrink-0"
                    >
                      <span>Verifikasi</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= KOLOM KANAN (4 Kolom) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box 1: Aktivitas Verifikasi Terkini (Timeline) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-river-600" />
              Aktivitas Verifikasi Terkini
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rekam jejak tindakan admin (Audit Trail)
            </p>

            <div className="space-y-3.5">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-2 text-xs pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 line-clamp-1">
                      {act.report_title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="font-mono">{act.tracking_code}</span>
                      <span>&bull;</span>
                      <span>{act.admin_name}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      act.action === 'valid'
                        ? 'bg-eco-50 text-eco-700 border border-eco-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {act.action === 'valid' ? 'Valid' : 'Ditolak'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Zonasi Titik Rawan Sungai Musi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-river-600" />
              Zonasi Rawan Sungai Musi
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribusi laporan per segmen wilayah
            </p>

            <div className="space-y-3 text-xs">
              {riverSegments.map((seg) => {
                const count = reports.filter(r => r.district === seg.district).length;
                const percent = Math.min(100, (count / reports.length) * 100);

                return (
                  <div key={seg.id} className="space-y-1">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-800 truncate">{seg.name}</span>
                      <span className="font-bold text-slate-900">{count} Titik</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-river-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box 3: Info Tim Advokasi PKL */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-river-50 to-sky-50 border border-river-100 text-xs">
            <div className="flex items-center gap-2 font-bold text-river-900 mb-1">
              <UserCheck className="w-4 h-4 text-river-600" />
              <span>Tim Advokasi Lingkungan GG</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Program GG River Care bermitra dengan warga lokal di sepanjang bantaran Sungai Musi untuk mendata titik kritis pencemaran secara real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
