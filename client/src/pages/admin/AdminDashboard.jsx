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
    <div className="space-y-5 sm:space-y-6">
      {/* Siklus Pengawasan Badge & Welcome Header Sesuai Desain Figma */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200 text-[10px] sm:text-[11px] font-bold mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-pulse"></span>
            <span>SIKLUS PENGAWASAN AKTIF &bull; SUMSEL 16.71</span>
          </div>

          {/* Heading Dibatasi Lebarnya agar Pecah Sesuai Desain Figma */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-[1.25] max-w-md">
            Selamat Bertugas, Tim<br className="hidden sm:inline" /> Pengelola<br className="hidden sm:inline" /> Kerusakan Lingkungan
          </h1>

          {/* Subjudul Dibatasi Lebarnya agar Pecah Sesuai Desain Figma */}
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
            Konsorsium Pengawasan Daerah Aliran Sungai<br className="hidden sm:inline" /> Musi &bull; Green Generation River Care Palembang
          </p>
        </div>

        {/* Action Buttons Kanan Atas: 2 Baris Presisi Sesuai Desain */}
        <div className="flex flex-col gap-2 shrink-0 self-start lg:self-auto w-full sm:w-auto">
          {/* Baris 1: Tanggal & Muat Ulang */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium flex-1 sm:flex-initial">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">November 2026 <span className="text-slate-400 font-normal hidden sm:inline">(Bulan Berjalan)</span></span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition shrink-0"
              title="Muat Ulang Data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>
          </div>

          {/* Baris 2: Tombol Unduh Ringkasan Cepat di bawahnya */}
          <button
            onClick={() => onNavigate('export')}
            className="w-full sm:w-auto self-start flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold shadow-sm shadow-[#0088cc]/20 transition"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Unduh Ringkasan Cepat</span>
          </button>
        </div>
      </div>

      {/* 5 Metrik Utama (Responsif: 2 kolom di mobile, 3 di tablet, 5 di desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Card 1: Total Laporan Masuk */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              TOTAL MASUK
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-50 text-[#0088cc] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{stats.totalMasuk}</span>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600">
                ↗ {stats.persenKenaikan}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">{stats.subMasuk}</p>
          </div>
        </div>

        {/* Card 2: Antrean Verifikasi */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              ANTEAN VERIFIKASI
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Hourglass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-600">0{stats.antreanVerifikasi}</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-600 text-white">
                urgent
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">SLA kritis &lt; 3 jam</p>
          </div>
        </div>

        {/* Card 3: Terverifikasi Valid */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              TERVERIFIKASI
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-50 text-[#0088cc] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{stats.terverifikasiValid}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-sky-50 text-[#0088cc]">
                81% valid
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">{stats.subValid}</p>
          </div>
        </div>

        {/* Card 4: Laporan Ditolak */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              DITOLAK
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{stats.laporanDitolak}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                11.7%
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">{stats.subDitolak}</p>
          </div>
        </div>

        {/* Card 5: Rata-Rata IKA Musi (Memanjang 2 kolom di mobile agar genap) */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              RATA-RATA IKA
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500">{stats.rataRataIka}</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-600">
                {stats.statusIka}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden flex">
              <div className="bg-amber-500 h-full w-[58%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Kolom Kiri (Chart + Antrean Mendesak) & Kolom Kanan (Titik Pantau, Aktivitas, Hotline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* KOLOM KIRI (lg:col-span-8): Chart Mingguan di atas, Antrean Verifikasi Mendesak di bawahnya */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6 min-w-0">
          {/* Card 1: Dinamika & Tren Pencemaran Mingguan */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0088cc]"></span>
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    Dinamika &amp; Tren Pencemaran Mingguan
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Volume akumulasi laporan masuk vs terverifikasi (Senin – Minggu)
                </p>
              </div>

              {/* Legenda Warna */}
              <div className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span>
                  <span>Plastik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                  <span>Limbah Cair/B3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span>
                  <span>Organik</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Sesuai Tampilan Desain */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Bagian Bar Chart dengan Scroll Horizontal Halus di Mobile */}
              <div className="md:col-span-7 flex flex-col justify-end pt-2 min-w-0">
                <div className="overflow-x-auto pb-2 scrollbar-none">
                  <div className="h-44 min-w-[280px] w-full flex items-end justify-between gap-2.5 px-1 border-b border-slate-200 pb-2">
                    {weeklyTrendData.map((d, idx) => {
                      const hPlastik = (d.plastik / 50) * 100;
                      const hB3 = (d.b3 / 50) * 100;
                      const hOrganik = (d.organik / 50) * 100;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <div className="w-full max-w-[22px] sm:max-w-[24px] flex flex-col justify-end rounded-t-md overflow-hidden bg-slate-100 transition hover:brightness-95">
                            <div style={{ height: `${hB3}%` }} className="bg-rose-500 w-full" title={`B3: ${d.b3}`}></div>
                            <div style={{ height: `${hPlastik}%` }} className="bg-slate-800 w-full" title={`Plastik: ${d.plastik}`}></div>
                            <div style={{ height: `${hOrganik}%` }} className="bg-emerald-600 w-full" title={`Organik: ${d.organik}`}></div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2.5 text-[10px] sm:text-[11px] text-slate-500">
                  <span>Total Minggu Ini: <strong className="text-slate-800">148 insiden</strong></span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sinkronisasi Otomatis
                  </span>
                </div>
              </div>

              {/* Komposisi Kategori Limbah di Samping Chart */}
              <div className="md:col-span-5 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>KOMPOSISI KATEGORI</span>
                  <span className="text-[10px] text-slate-400">100% Total</span>
                </div>

                {wasteComposition.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 text-[11px] sm:text-xs">{item.label}</span>
                      <span className="text-slate-600 font-medium text-[10px] sm:text-xs">{item.count} <span className="text-slate-400">({item.percent}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-[10px] sm:text-[11px] text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                  <p className="leading-snug">Indikasi ceceran oli meningkat di Seberang Ulu I.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Antrean Verifikasi Mendesak (Perlu Penanganan Cepat) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  Antrean Verifikasi Mendesak
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[9px] sm:text-[10px] border border-amber-200 shrink-0">
                  3 Prioritas
                </span>
              </div>

              <button
                onClick={() => onNavigate('verify')}
                className="text-xs font-semibold text-[#0088cc] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Lihat Seluruh Antrean (9)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List 3 Tiket dengan layout responsif */}
            <div className="space-y-3">
              {urgentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#0088cc]/50 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={report.photo_url}
                      alt={report.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-[#0088cc] text-[11px] sm:text-xs">
                          #{report.tracking_code}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            report.estimated_severity === 'berat'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          {report.estimated_severity === 'berat' ? 'Tercemar Berat' : 'Tercemar Sedang'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {report.created_time_str}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{report.title}</h3>

                      <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{report.address_landmark}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReview(report.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold shadow-sm shadow-[#0088cc]/20 flex items-center gap-1.5 transition"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleReview(report.id)}
                      title="Quick Action"
                      className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (lg:col-span-4): Titik Pantau Sempadan Kritis + Aktivitas Verifikasi + Hotline Tanggap */}
        <div className="lg:col-span-4 space-y-5 min-w-0">
          {/* Card 1: Titik Pantau Sempadan Kritis */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#0088cc]">📶</span>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Titik Pantau Sempadan Kritis
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">5 Pos</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Indikator ambang batas limbah radius 200m dari bantaran Musi
            </p>

            <div className="space-y-2 pt-1">
              {criticalPoints.map((cp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{cp.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="truncate">{cp.zone}</span>
                    </p>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${cp.color}`}>
                    {cp.percent}% {cp.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-sky-50 text-[11px] text-[#0088cc] flex items-center justify-between font-medium">
              <span>Prioritas drone patroli:</span>
              <strong className="text-slate-800">Sektor Ulu I &amp; 16 Ilir</strong>
            </div>
          </div>

          {/* Card 2: Aktivitas Verifikasi Terakhir (NFR-5 AUDIT) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">⚡</span>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Aktivitas Verifikasi Terakhir
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">NFR-5 AUDIT</span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Admin Rian F.</span>
                  <span className="text-[10px] text-slate-400 font-mono">11:42 WIB</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Validasi tiket <strong className="text-[#0088cc]">#SPP-202611-0008</strong>: Kategori Tercemar Berat di Kertapati.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 pl-3 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Admin Nadia S.</span>
                  <span className="text-[10px] text-slate-400 font-mono">10:15 WIB</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Tolak <strong className="text-rose-500">#SPP-202611-0005</strong>: Foto blur, luar bantaran sungai.
                </p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Admin M. Ridho Pratama</span>
                  <span className="text-[10px] text-slate-400 font-mono">08:30 WIB</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Rilis dossier advokasi DLH Provinsi Sumsel (28 lembar).
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Hotline Tanggap Sempadan (SIAGA 24 JAM) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Hotline Tanggap Sempadan
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">SIAGA 24 JAM</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 truncate">Posko DLH Kota Palembang</p>
                  <p className="font-bold text-slate-900 font-mono text-xs">(0711) 352-101</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 truncate">Patroli Relawan Sahabat Musi</p>
                  <p className="font-bold text-slate-900 font-mono text-xs truncate">+62 812-7390-099 &bull; Ch. 14</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
