import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Check,
  Printer,
  Table,
  Filter,
  Layers,
  Shield,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminExport() {
  const { advocacyArchives, stats } = useAdmin();
  const [exportFormat, setExportFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('01 Nov 2026');
  const [endDate, setEndDate] = useState('14 Nov 2026');
  const [stampSpatial, setStampSpatial] = useState(true);
  const [auditTrail, setAuditTrail] = useState(true);
  const [legalReference, setLegalReference] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleDownload = (format) => {
    setDownloadSuccess(`Berkas laporan ${format.toUpperCase()} berhasil digenerate dan diunduh.`);
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
          <button onClick={() => setDownloadSuccess('')} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
      )}

      {/* Header Utama & Kanan Atas */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200">
              MODUL FR-8 &bull; ADVOKASI RESMI
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Kuartal IV / 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pusat Advokasi &amp; Rekapitulasi Data Lingkungan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed mt-1">
            Susun dan unduh laporan resmi hasil partisipasi warga untuk bahan audiensi bersama Dinas Lingkungan Hidup &amp; Kebersihan (DLHK) Kota Palembang serta pemangku kebijakan DAS Musi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs">104 LAPORAN</p>
              <p className="text-[10px] text-slate-400">Status Valid Siap Ekspor</p>
            </div>
          </div>

          <button
            onClick={() => handleDownload('PDF Eksekutif')}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold shadow-md shadow-[#0088cc]/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Cepat (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2 Kolom: Form Parameter Berkas di Kiri & Pratinjau Dokumen di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Form Parameter Berkas */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#0088cc]">⚙</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Parameter Berkas</h3>
                <p className="text-[10px] text-slate-400">SIPEPES-CFG-V2 &bull; Filter &amp; Atribut</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0088cc]">
              104 Data Siap
            </span>
          </div>

          {/* Format Ekspor Toggle */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              FORMAT EKSPOR
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  exportFormat === 'pdf'
                    ? 'border-[#0088cc] bg-sky-50/50 ring-1 ring-[#0088cc]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${exportFormat === 'pdf' ? 'text-[#0088cc]' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold text-xs text-slate-900">PDF Laporan</p>
                    <p className="text-[10px] text-slate-500">Format A4 KOP</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${exportFormat === 'pdf' ? 'border-[#0088cc]' : 'border-slate-300'}`}>
                  {exportFormat === 'pdf' && <div className="w-2 h-2 rounded-full bg-[#0088cc]"></div>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  exportFormat === 'excel'
                    ? 'border-[#0088cc] bg-sky-50/50 ring-1 ring-[#0088cc]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Table className={`w-4 h-4 ${exportFormat === 'excel' ? 'text-[#0088cc]' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Excel Tabulasi</p>
                    <p className="text-[10px] text-slate-500">Raw GPS &amp; Lab</p>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${exportFormat === 'excel' ? 'border-[#0088cc]' : 'border-slate-300'}`}>
                  {exportFormat === 'excel' && <div className="w-2 h-2 rounded-full bg-[#0088cc]"></div>}
                </div>
              </button>
            </div>
          </div>

          {/* Rentang Waktu */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              RENTANG WAKTU INSIDEN
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Mulai</span>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs w-full focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Selesai</span>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status & Zonasi */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                STATUS LAPORAN
              </label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0088cc]"></span>
                  Terverifikasi
                </span>
                <span className="font-mono font-bold text-[#0088cc]">104</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                ZONASI DAS
              </label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">Semua Sektor (Ulu &amp; Ilir)</span>
              </div>
            </div>
          </div>

          {/* Tingkat Keparahan */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TINGKAT KEPARAHAN
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Berat (38)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Sedang (49)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Ringan (17)
              </span>
            </div>
          </div>

          {/* Kelengkapan Bukti Legalitas */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              KELENGKAPAN BUKTI LEGALITAS
            </label>

            <div className="space-y-2 text-xs">
              <label className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stampSpatial}
                  onChange={(e) => setStampSpatial(e.target.checked)}
                  className="mt-0.5 rounded text-[#0088cc]"
                />
                <div>
                  <p className="font-bold text-slate-800">Lampirkan Foto Stempel Spasial</p>
                  <p className="text-[10px] text-slate-400">Koordinat latitude/longitude &amp; watermark waktu</p>
                </div>
              </label>

              <label className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={auditTrail}
                  onChange={(e) => setAuditTrail(e.target.checked)}
                  className="mt-0.5 rounded text-[#0088cc]"
                />
                <div>
                  <p className="font-bold text-slate-800">Audit Trail Verifikator Lapangan</p>
                  <p className="text-[10px] text-slate-400">Catatan inspeksi fisik &amp; ID identitas petugas</p>
                </div>
              </label>

              <label className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalReference}
                  onChange={(e) => setLegalReference(e.target.checked)}
                  className="mt-0.5 rounded text-[#0088cc]"
                />
                <div>
                  <p className="font-bold text-slate-800">Rujukan Perda No. 3 Palembang</p>
                  <p className="text-[10px] text-slate-400">Pasal pelanggaran pembuangan limbah DAS</p>
                </div>
              </label>
            </div>
          </div>

          {/* Tombol Ekspor */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => handleDownload('PDF Eksekutif')}
              className="w-full py-3 px-4 rounded-xl bg-[#075985] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <FileText className="w-4 h-4" />
              <span>Generate &amp; Unduh Laporan PDF Eksekutif</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('Excel Tabulasi')}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Unduh Format Excel Tabulasi (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Pratinjau Dokumen Resmi (Format A4) */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#0088cc]">📑</span>
              <h3 className="font-bold text-slate-900 text-sm">
                Pratinjau Dokumen Resmi (Format A4)
              </h3>
            </div>
          </div>

          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200">
              <span>NAMA DOKUMEN BERKAS</span>
              <span>TUJUAN AUDIENSI / TARGET</span>
            </div>

            {advocacyArchives.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#0088cc]/50 transition flex items-center justify-between gap-3 text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{doc.nama}</p>
                    <p className="text-[10px] font-mono text-slate-400">HASH: {doc.hash}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 ${doc.target_badge}`}>
                  {doc.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Riwayat & Arsip Berkas Advokasi */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Riwayat &amp; Arsip Berkas Advokasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Log dokumen yang telah diekspor untuk rapat koordinasi, audiensi legislatif, dan laporan berkala DLH.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Arsip: <strong className="text-slate-800">18 Berkas</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">NAMA DOKUMEN BERKAS</th>
                <th className="py-3 px-4">TUJUAN AUDIENSI / TARGET</th>
                <th className="py-3 px-4">FORMAT &amp; UKURAN</th>
                <th className="py-3 px-4">PENGUNDUH</th>
                <th className="py-3 px-4">WAKTU UNDUH</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {advocacyArchives.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doc.nama}</p>
                        <p className="text-[10px] font-mono text-slate-400">HASH: {doc.hash}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${doc.target_badge}`}>
                      {doc.target}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                    <p className="font-bold text-slate-800">{doc.format}</p>
                    <p className="text-[10px] text-slate-400">{doc.ukuran}</p>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{doc.pengunduh}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {doc.waktu}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDownload(doc.nama)}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0088cc] font-bold text-xs flex items-center gap-1.5 mx-auto transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
