import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Filter,
  ArrowUpDown,
  FileDown,
  Check,
  ChevronDown,
  ChevronUp,
  Table,
  MapPin
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Toast from '../../components/Toast';

export default function AdminExport() {
  const { reports, advocacyArchives } = useAdmin();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [sortField, setSortField] = useState('date'); // 'date' | 'severity' | 'district'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const districts = [
    'Semua Kecamatan',
    'Seberang Ulu I',
    'Seberang Ulu II',
    'Ilir Timur I',
    'Ilir Timur II',
    'Ilir Timur III',
    'Ilir Barat I',
    'Ilir Barat II',
    'Gandus',
    'Kertapati',
    'Plaju',
    'Kalidoni',
    'Bukit Kecil'
  ];

  // Hanya laporan valid yang diekspor untuk bahan advokasi (FR-8)
  const validReports = useMemo(() => {
    return (reports || []).filter(r => r.status === 'valid' || r.status === 'terverifikasi');
  }, [reports]);

  // Filter Data
  const filteredReports = useMemo(() => {
    return validReports.filter(rep => {
      if (selectedDistrict !== 'all' && selectedDistrict !== 'Semua Kecamatan') {
        if (!(rep.district || '').toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
      }

      if (selectedSeverity !== 'all') {
        const sev = (rep.estimated_severity || rep.severity || '').toLowerCase();
        if (sev !== selectedSeverity) return false;
      }

      if (startDate) {
        const d = new Date(rep.created_at || rep.date);
        if (d < new Date(startDate)) return false;
      }

      if (endDate) {
        const d = new Date(rep.created_at || rep.date);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }

      return true;
    });
  }, [validReports, selectedDistrict, selectedSeverity, startDate, endDate]);

  // Pengurutan Tabel Titik Terurut (Wawancara GGP)
  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.created_at || a.date || 0);
        const dateB = new Date(b.created_at || b.date || 0);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }

      if (sortField === 'district') {
        const distA = a.district || '';
        const distB = b.district || '';
        return sortOrder === 'desc'
          ? distB.localeCompare(distA)
          : distA.localeCompare(distB);
      }

      if (sortField === 'severity') {
        const weight = { berat: 3, sedang: 2, ringan: 1 };
        const sevA = weight[(a.estimated_severity || a.severity || '').toLowerCase()] || 0;
        const sevB = weight[(b.estimated_severity || b.severity || '').toLowerCase()] || 0;
        return sortOrder === 'desc' ? sevB - sevA : sevA - sevB;
      }

      return 0;
    });
  }, [filteredReports, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Unduh Berkas CSV Nyata (FR-8)
  const handleExportCSV = () => {
    setIsDownloading(true);

    try {
      const headers = ['Kode Tiket', 'Judul', 'Kategori', 'Tingkat Dugaan', 'Kecamatan', 'Alamat/Patokan', 'Latitude', 'Longitude', 'Tanggal Masuk', 'Status'];
      const rows = sortedReports.map(r => [
        `"${r.tracking_code || ''}"`,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        `"${r.category || ''}"`,
        `"${r.estimated_severity || r.severity || ''}"`,
        `"${r.district || ''}"`,
        `"${(r.address_landmark || '').replace(/"/g, '""')}"`,
        r.latitude || '',
        r.longitude || '',
        `"${r.created_at || ''}"`,
        `"${r.status || ''}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SIPEPES_Data_Pencemaran_Musi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage('Berkas CSV mentah berhasil diunduh ke perangkat.');
    } catch (err) {
      setToastMessage('Gagal membuat berkas CSV.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Unduh Berkas PDF Nyata (Memanggil API Server atau Print Stream)
  const handleExportPDF = async () => {
    setIsDownloading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      const token = localStorage.getItem('sipepes_admin_token');

      const response = await fetch(`${apiBase}/export/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SIPEPES_Laporan_Advokasi_Musi_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToastMessage('Berkas PDF Eksekutif berhasil diunduh dari server.');
      } else {
        // Fallback jendela cetak laporan eksekutif
        window.print();
        setToastMessage('Membuka dialog cetak laporan eksekutif PDF.');
      }
    } catch (err) {
      window.print();
      setToastMessage('Membuka dialog cetak laporan eksekutif PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Header Banner Rekap & Advokasi */}
      <Card className="p-6 sm:p-8 space-y-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ungu-100 text-ungu-800 text-xs font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Modul Advokasi &amp; Ekspor Data (FR-8)</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Rekapitulasi &amp; Ekspor Berkas Advokasi
            </h1>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              Ekspor rekapitulasi titik pencemaran yang telah terverifikasi ke dalam format PDF Eksekutif dan CSV/Excel mentah sebagai bahan audiensi pelestarian Sungai Musi.
            </p>
          </div>

          {/* Tombol Unduh Riil */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="utama"
              size="md"
              onClick={handleExportPDF}
              disabled={isDownloading}
            >
              <FileDown className="w-4 h-4" />
              <span>Unduh PDF Eksekutif</span>
            </Button>

            <Button
              type="button"
              variant="garis"
              size="md"
              onClick={handleExportCSV}
              disabled={isDownloading}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Unduh Data CSV</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-garis">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Saring Data Titik ({sortedReports.length} Laporan Cocok)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Kecamatan
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Tingkat Dugaan
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600"
            >
              <option value="all">Semua Tingkat</option>
              <option value="berat">Berat</option>
              <option value="sedang">Sedang</option>
              <option value="ringan">Ringan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600"
            />
          </div>
        </div>
      </Card>

      {/* Tabel Titik Terurut (Sortable Table - Wawancara GGP) */}
      <Card className="p-0 overflow-hidden bg-white shadow-lembut">
        <div className="p-5 border-b border-garis flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-ink-muted" />
            <h3 className="text-sm sm:text-base font-bold text-ink">
              Tabel Titik Pencemaran Terverifikasi
            </h3>
          </div>
          <span className="text-xs text-ink-muted">
            Klik judul kolom untuk mengurutkan data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-garis text-ink-muted uppercase font-bold text-xs select-none">
                <th className="py-3 px-4">Kode Tiket</th>
                <th className="py-3 px-4">Judul Laporan</th>
                <th
                  onClick={() => toggleSort('severity')}
                  className="py-3 px-4 cursor-pointer hover:text-ink transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Tingkat</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('district')}
                  className="py-3 px-4 cursor-pointer hover:text-ink transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Kecamatan</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-ink transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal Masuk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Koordinat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {sortedReports.map((rep) => {
                const severity = (rep.estimated_severity || rep.severity || 'sedang').toLowerCase();
                const formattedDate = rep.created_at
                  ? new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '14 Nov 2026';

                return (
                  <tr key={rep.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-musi-600 tabular-nums">
                      {rep.tracking_code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-ink max-w-xs truncate">
                      {rep.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge type="tingkat" value={severity} size="md" />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-ink-soft">
                      {rep.district}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-ink-muted">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-ink-muted">
                      {rep.latitude ? `${rep.latitude}, ${rep.longitude}` : '-'}
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
