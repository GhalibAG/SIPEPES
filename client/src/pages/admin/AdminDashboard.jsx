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
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import PollutionBarChart from '../../components/admin/PollutionBarChart';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../../components/common/Badges';

export default function AdminDashboard({ onNavigate }) {
  const { stats, reports, openVerifyModal } = useAdmin();

  // Ambil laporan berstatus menunggu verifikasi untuk list "Perlu Ditinjau"
  const pendingReports = reports.filter(r => r.status === 'menunggu').slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-river-600 to-river-700 rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-sky-100 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Dashboard Pengawasan Sungai Musi
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Selamat Datang, Tim Advokasi GG River Care!
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
            Terdapat <strong className="text-white underline">{stats.menunggu} laporan baru</strong> yang memerlukan verifikasi lapangan sebelum dimasukkan ke rekapitulasi advokasi.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 bg-white text-river-700 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
          >
            Mulai Verifikasi
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Cards Metrik Ringkasan (Layar 2 Figma) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Laporan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Laporan
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats.total}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Dari seluruh wilayah Sungai Musi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-river-50 text-river-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between bg-amber-50/20">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Menunggu Review
            </p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">
              {stats.menunggu}
            </h3>
            <span className="text-[11px] text-amber-600 mt-0.5 block font-medium">
              Memerlukan tindak lanjut admin
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Laporan Valid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-eco-700 uppercase tracking-wider">
              Terverifikasi Valid
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats.valid}
            </h3>
            <span className="text-[11px] text-eco-600 mt-0.5 block font-medium">
              Tampil di peta publik
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-eco-50 text-eco-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rekap Advokasi Siap */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Laporan Ditolak
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats.ditolak}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Tidak memenuhi kriteria sungai
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row Grafik & Analisis Keparahan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Bar Chart Tren 6 Bulan (8 Kolom) */}
        <div className="lg:col-span-8">
          <PollutionBarChart />
        </div>

        {/* Kolom Kanan: Distribusi Tingkat Pencemaran Valid (4 Kolom) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Kondisi Titik Terverifikasi
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Klasifikasi tingkat pencemaran siap advokasi
            </p>

            <div className="space-y-3">
              {/* Berat */}
              <div className="p-3 rounded-xl bg-red-50/60 border border-red-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <div>
                    <p className="text-xs font-bold text-red-900">Tercemar Berat</p>
                    <p className="text-[11px] text-red-700">Limbah industri / ceceran oli</p>
                  </div>
                </div>
                <span className="text-lg font-black text-red-800">{stats.berat}</span>
              </div>

              {/* Sedang */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <div>
                    <p className="text-xs font-bold text-amber-900">Tercemar Sedang</p>
                    <p className="text-[11px] text-amber-700">Tumpukan limbah padat</p>
                  </div>
                </div>
                <span className="text-lg font-black text-amber-800">{stats.sedang}</span>
              </div>

              {/* Ringan */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Tercemar Ringan</p>
                    <p className="text-[11px] text-emerald-700">Sampah musiman hanyut</p>
                  </div>
                </div>
                <span className="text-lg font-black text-emerald-800">{stats.ringan}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('export')}
              className="w-full py-2.5 bg-river-50 hover:bg-river-100 text-river-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Rekap Advokasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row Laporan Menunggu Ditinjau (Quick Review List) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Laporan Terbaru Menunggu Verifikasi
            </h3>
            <p className="text-xs text-slate-500">
              Daftar laporan masyarakat yang perlu diputuskan validitasnya
            </p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-river-600 hover:text-river-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Semua Laporan ({reports.length}) &rarr;
          </button>
        </div>

        {pendingReports.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            🎉 Tidak ada laporan yang sedang menunggu verifikasi saat ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={report.photo_url}
                    alt={report.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {report.tracking_code}
                      </span>
                      <SeverityBadge severity={report.estimated_severity} />
                      <PollutionTypeBadge type={report.pollution_type} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> Kec. {report.district}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(report.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openVerifyModal(report)}
                  className="px-4 py-2 bg-river-600 hover:bg-river-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
                >
                  <span>Tinjau & Verifikasi</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
