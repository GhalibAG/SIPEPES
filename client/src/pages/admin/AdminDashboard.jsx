import React from 'react';
import {
  Calendar,
  RotateCcw,
  Download,
  FileText,
  Hourglass,
  ShieldCheck,
  XCircle,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Phone,
  Radio,
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard({ onNavigate }) {
  const {
    stats,
    weeklyTrendData,
    wasteComposition,
    criticalPoints,
    reports,
    setSelectedReportId
  } = useAdmin();

  // 3 tiket mendesak di antrean verifikasi
  const urgentReports = reports.filter(r => r.is_urgent || r.status === 'menunggu').slice(0, 3);

  const handleReview = (id) => {
    setSelectedReportId(id);
    onNavigate('verify');
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Header Bersih */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1 max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Selamat Bertugas, Tim Pengelola Kerusakan Lingkungan
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Konsorsium Pengawasan Daerah Aliran Sungai Musi &bull; Green Generation River Care Palembang
          </p>
        </div>

        {/* Action Buttons Kanan Atas */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 self-start lg:self-center">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>November 2026</span>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Muat Ulang Data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('export')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Ekspor Ringkasan</span>
          </button>
        </div>
      </div>

      {/* 5 Metrik Utama (Simpel & Rapi Tidak Numpuk) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Masuk */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Total Masuk</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.totalMasuk}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                ↗ {stats.persenKenaikan}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">{stats.subMasuk}</p>
          </div>
        </div>

        {/* Card 2: Antrean Verifikasi */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Antrean Verifikasi</span>
            <Hourglass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">0{stats.antreanVerifikasi}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0">
                Urgent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">SLA kritis &lt; 3 jam</p>
          </div>
        </div>

        {/* Card 3: Terverifikasi */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Terverifikasi</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.terverifikasiValid}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                81% Valid
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">{stats.subValid}</p>
          </div>
        </div>

        {/* Card 4: Ditolak */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Ditolak</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.laporanDitolak}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white shrink-0">
                11.7%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">{stats.subDitolak}</p>
          </div>
        </div>

        {/* Card 5: Rata-Rata IKA */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Rata-Rata IKA</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.rataRataIka}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0">
                {stats.statusIka}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Status Kualitas Air</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Kolom Kiri (Chart + Antrean Mendesak) & Kolom Kanan (Titik Pantau, Aktivitas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI (8 Kolom): Chart & Antrean Mendesak */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          
          {/* Card 1: Dinamika & Tren Pencemaran Mingguan */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  Dinamika &amp; Tren Pencemaran Mingguan
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Volume akumulasi laporan masuk vs terverifikasi (Senin – Minggu)
                </p>
              </div>

              {/* Legenda Warna */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                  <span>Plastik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                  <span>Limbah Cair / B3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span>
                  <span>Organik</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Sesuai Tampilan Desain */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Bagian Bar Chart */}
              <div className="md:col-span-7 flex flex-col justify-end min-w-0">
                <div className="overflow-x-auto pb-2 scrollbar-none">
                  <div className="h-44 min-w-[280px] w-full flex items-end justify-between gap-2.5 px-1 border-b border-slate-200 pb-2">
                    {weeklyTrendData.map((d, idx) => {
                      const hPlastik = (d.plastik / 50) * 100;
                      const hB3 = (d.b3 / 50) * 100;
                      const hOrganik = (d.organik / 50) * 100;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <div className="w-full max-w-[24px] flex flex-col justify-end rounded-t-md overflow-hidden bg-slate-100 transition hover:brightness-95">
                            <div style={{ height: `${hB3}%` }} className="bg-rose-500 w-full" title={`B3: ${d.b3}`}></div>
                            <div style={{ height: `${hPlastik}%` }} className="bg-slate-900 w-full" title={`Plastik: ${d.plastik}`}></div>
                            <div style={{ height: `${hOrganik}%` }} className="bg-emerald-600 w-full" title={`Organik: ${d.organik}`}></div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2.5 text-xs text-slate-500">
                  <span>Total Minggu Ini: <strong className="text-slate-900">148 insiden</strong></span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sinkronisasi Otomatis
                  </span>
                </div>
              </div>

              {/* Komposisi Kategori Limbah */}
              <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>KOMPOSISI KATEGORI</span>
                  <span className="text-slate-400">100% Total</span>
                </div>

                {wasteComposition.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.label}</span>
                      <span className="text-slate-600 font-medium">{item.count} <span className="text-slate-400">({item.percent}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                  <p className="leading-snug">Indikasi ceceran oli meningkat di Seberang Ulu I.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Antrean Verifikasi Mendesak */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  Antrean Verifikasi Mendesak
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] shrink-0">
                  3 Prioritas
                </span>
              </div>

              <button
                onClick={() => onNavigate('verify')}
                className="text-xs font-semibold text-[#0088cc] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Lihat Seluruh Antrean</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List 3 Tiket dengan layout bersih */}
            <div className="space-y-3">
              {urgentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={report.photo_url}
                      alt={report.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          #{report.tracking_code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                            report.estimated_severity === 'berat'
                              ? 'bg-rose-600'
                              : 'bg-amber-500'
                          }`}
                        >
                          {report.estimated_severity === 'berat' ? 'Tercemar Berat' : 'Tercemar Sedang'}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {report.created_time_str}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{report.title}</h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{report.address_landmark}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReview(report.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleReview(report.id)}
                      title="Quick Action"
                      className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (4 Kolom): Titik Pantau Sempadan Kritis & Aktivitas */}
        <div className="lg:col-span-4 space-y-5 min-w-0">
          
          {/* Card 1: Titik Pantau Sempadan Kritis */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Titik Pantau Sempadan Kritis
              </h3>
              <span className="text-xs font-semibold text-slate-400">5 Pos</span>
            </div>
            <p className="text-xs text-slate-500">
              Indikator ambang batas limbah radius 200m dari bantaran Musi
            </p>

            <div className="space-y-2 pt-1">
              {criticalPoints.map((cp, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{cp.name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="truncate">{cp.zone}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      cp.status === 'Kritis'
                        ? 'bg-rose-600 text-white'
                        : cp.status === 'Sedang'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {cp.percent}% {cp.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between font-medium">
              <span>Prioritas patroli:</span>
              <strong className="text-slate-900">Sektor Ulu I &amp; 16 Ilir</strong>
            </div>
          </div>

          {/* Card 2: Aktivitas Verifikasi Terakhir */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Aktivitas Verifikasi Terakhir
              </h3>
              <span className="text-[10px] font-mono text-slate-400">AUDIT TRAIL</span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="border-l-2 border-emerald-600 pl-3 py-1 bg-slate-50/50 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Admin Rian F.</span>
                  <span className="text-[10px] text-slate-400 font-mono">11:42 WIB</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Validasi tiket <strong className="text-slate-900 font-mono">#SPP-202611-0008</strong>: Kategori Tercemar Berat di Kertapati.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 pl-3 py-1 bg-slate-50/50 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Zira Pertiwi</span>
                  <span className="text-[10px] text-slate-400 font-mono">09:15 WIB</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Menolak tiket <strong className="text-slate-900 font-mono">#SPP-202611-0005</strong>: Foto kabur di luar sempadan Musi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
