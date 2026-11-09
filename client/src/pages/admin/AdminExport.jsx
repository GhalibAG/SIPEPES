import React from 'react';
import { FileSpreadsheet, Printer, Download, ShieldCheck, Waves, FileText, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, PollutionTypeBadge } from '../../components/common/Badges';

export default function AdminExport() {
  const { reports, stats, adminUser } = useAdmin();

  // Hanya laporan valid yang diekspor untuk advokasi
  const validReports = reports.filter(r => r.status === 'valid');

  // Cetak Dokumen PDF via Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Unduh Berkas CSV
  const handleDownloadCSV = () => {
    const headers = ['Kode Tiket', 'Judul Laporan', 'Kecamatan', 'Patokan Lokasi', 'Latitude', 'Longitude', 'Jenis Limbah', 'Tingkat Keparahan', 'Pelapor', 'Tanggal', 'Verifikator'];
    const rows = validReports.map(r => [
      `"${r.tracking_code}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.district}"`,
      `"${(r.address_landmark || '').replace(/"/g, '""')}"`,
      r.latitude,
      r.longitude,
      `"${r.pollution_type}"`,
      `"${r.estimated_severity}"`,
      `"${r.reporter_name || 'Anonim'}"`,
      `"${r.created_at}"`,
      `"${r.verified_by || 'Admin'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Advokasi_SIPEPES_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Action (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-river-600" />
            Rekapitulasi Dokumen Advokasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan resmi titik pencemaran terverifikasi untuk audiensi ke Dinas Lingkungan Hidup
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Unduh CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Lembar Dokumen Formal (Layar 8 Figma) */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-800 font-sans max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        {/* Kop Surat Dokumen Advokasi */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-river-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Waves className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                GREEN GENERATION PALEMBANG
              </h2>
              <p className="text-xs font-bold text-eco-700">
                Divisi Pengelola Kerusakan Lingkungan (PKL) &mdash; Program GG River Care
              </p>
              <p className="text-[11px] text-slate-500">
                Sekretariat: Kota Palembang, Sumatera Selatan | Email: kontak@greengeneration.id
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">
              Dokumen: ADV-2026-XI
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        {/* Judul Laporan */}
        <div className="text-center my-6">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wide">
            REKAPITULASI LAPORAN TITIK PENCEMARAN SUNGAI MUSI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Data Hasil Pelaporan Warga dan Verifikasi Tim Lapangan Periode November 2026
          </p>
        </div>

        {/* Ringkasan Statistik Eksekutif */}
        <div className="grid grid-cols-4 gap-3 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Laporan Valid</p>
            <p className="text-xl font-black text-slate-900">{stats.valid}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-red-600">Tercemar Berat</p>
            <p className="text-xl font-black text-red-700">{stats.berat}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-amber-600">Tercemar Sedang</p>
            <p className="text-xl font-black text-amber-700">{stats.sedang}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-emerald-600">Tercemar Ringan</p>
            <p className="text-xl font-black text-emerald-700">{stats.ringan}</p>
          </div>
        </div>

        {/* Tabel Data Rekapitulasi */}
        <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Kode Tiket</th>
                <th className="py-2.5 px-3">Lokasi & Landmark</th>
                <th className="py-2.5 px-3">Jenis Limbah</th>
                <th className="py-2.5 px-3">Tingkat Dugaan</th>
                <th className="py-2.5 px-3">Koordinat (Lat, Lng)</th>
                <th className="py-2.5 px-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {validReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    Belum ada data laporan yang berstatus valid.
                  </td>
                </tr>
              ) : (
                validReports.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.tracking_code}</td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[10px] text-slate-500">Kec. {item.district} ({item.address_landmark})</p>
                    </td>
                    <td className="py-2.5 px-3">{item.pollution_type.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 font-bold capitalize">
                      <span className={
                        item.estimated_severity === 'berat' ? 'text-red-700' :
                        item.estimated_severity === 'sedang' ? 'text-amber-700' : 'text-emerald-700'
                      }>
                        {item.estimated_severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kolom Tanda Tangan Pengesahan Advokasi */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-200 text-xs text-center">
          <div>
            <p className="text-slate-500">Palembang, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            <p className="font-semibold text-slate-800 mt-1">Koordinator Verifikasi Lapangan (PKL)</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">{adminUser?.full_name || 'M. Ghalib Assiddiq Gusri'}</p>
            <p className="text-[11px] text-slate-500">NIM / ID Tim: MuSilaban-01</p>
          </div>

          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-semibold text-slate-800 mt-1">Ketua Green Generation Palembang</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">Lazvie Moey Odano</p>
            <p className="text-[11px] text-slate-500">Perwakilan Komunitas GG River Care</p>
          </div>
        </div>
      </div>
    </div>
  );
}
