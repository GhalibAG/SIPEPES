import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Check,
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Search,
  ExternalLink,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ChipGroup from '../../components/ChipGroup';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';

// Pin Marker Generator
const createPin = (severity = 'sedang') => {
  const colorMap = { berat: '#D93A40', sedang: '#FFA63D', ringan: '#22B573' };
  const color = colorMap[severity] || colorMap.sedang;

  return L.divIcon({
    className: 'custom-drop-pin',
    html: `
      <div style="width:36px; height:36px; transform:translate(-50%, -100%); filter:drop-shadow(0 4px 6px rgba(18,33,63,0.3));">
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 2C18 2 6 15.5 6 23C6 29.6 11.4 35 18 35C24.6 35 30 29.6 30 23C30 15.5 18 2 18 2Z" fill="${color}" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="18" cy="22" r="4.5" fill="#FFFFFF"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
};

export default function AdminVerifyPage() {
  const { reports, verifyReport, stats } = useAdmin();
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  // State Filter & Tabs
  const [activeTab, setActiveTab] = useState('menunggu'); // 'menunggu' | 'valid' | 'ditolak'
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // State Detail Terpilih
  const [selectedId, setSelectedId] = useState(routeId || null);

  // State Form Verifikasi
  const [verifiedSeverity, setVerifiedSeverity] = useState('sedang');
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // State Modal Penolakan (A4)
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

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

  const severityOptions = [
    { value: 'berat', label: 'Berat', desc: 'Air menghitam pekat / bau menyengat' },
    { value: 'sedang', label: 'Sedang', desc: 'Sampah mengapung cukup banyak' },
    { value: 'ringan', label: 'Ringan', desc: 'Pencemaran lokal skala kecil' }
  ];

  // Filter Data Antrean Sesuai Tab & Kriteria
  const filteredList = useMemo(() => {
    return (reports || []).filter(rep => {
      // Filter Tab Status
      if (activeTab === 'menunggu' && rep.status !== 'menunggu') return false;
      if (activeTab === 'valid' && rep.status !== 'valid' && rep.status !== 'terverifikasi') return false;
      if (activeTab === 'ditolak' && rep.status !== 'ditolak') return false;

      // Filter Pencarian (Kode atau Judul)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = (rep.tracking_code || '').toLowerCase().includes(q);
        const matchTitle = (rep.title || '').toLowerCase().includes(q);
        if (!matchCode && !matchTitle) return false;
      }

      // Filter Kecamatan
      if (districtFilter !== 'all' && districtFilter !== 'Semua Kecamatan') {
        if (!(rep.district || '').toLowerCase().includes(districtFilter.toLowerCase())) return false;
      }

      // Filter Tingkat
      if (severityFilter !== 'all') {
        const sev = (rep.estimated_severity || rep.severity || '').toLowerCase();
        if (sev !== severityFilter) return false;
      }

      return true;
    });
  }, [reports, activeTab, searchQuery, districtFilter, severityFilter]);

  // Tentukan Laporan Aktif yang Sedang Diinspeksi
  const currentReport = useMemo(() => {
    if (selectedId) {
      const found = reports.find(r => r.id === selectedId);
      if (found) return found;
    }
    return filteredList[0] || reports[0] || null;
  }, [selectedId, filteredList, reports]);

  // Update State Form Saat Laporan Terpilih Berganti
  React.useEffect(() => {
    if (currentReport) {
      setVerifiedSeverity((currentReport.estimated_severity || currentReport.severity || 'sedang').toLowerCase());
      setAdminNotes(currentReport.admin_notes || '');
    }
  }, [currentReport?.id]);

  // Aksi Tandai Valid (FR-5)
  const handleApprove = () => {
    if (!currentReport) return;
    verifyReport(
      currentReport.id,
      'valid',
      verifiedSeverity,
      adminNotes || 'Laporan tervalidasi sesuai foto dan lokasi sempadan.',
      null
    );
    setToastMessage(`Laporan #${currentReport.tracking_code} berhasil ditandai VALID dan terbit di peta!`);
  };

  // Aksi Konfirmasi Tolak (A4)
  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectError('Mohon tuliskan alasan penolakan agar warga pelapor memahaminya.');
      return;
    }

    verifyReport(
      currentReport.id,
      'ditolak',
      verifiedSeverity,
      adminNotes,
      rejectionReason.trim()
    );

    setRejectModalOpen(false);
    setRejectionReason('');
    setRejectError('');
    setToastMessage(`Laporan #${currentReport.tracking_code} telah DITOLAK.`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* ========================================================
          1. HEADER & 4 STAT CARDS DINAMIS (FR-5 & A2)
         ======================================================== */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Antrean &amp; Verifikasi Laporan
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Validasi observasi visual warga sempadan Musi oleh relawan Green Generation Palembang.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            variant="musi"
            label="Total Masuk"
            value={stats.totalMasuk}
            description="Semua laporan warga"
            icon={FileCheck2}
          />
          <StatCard
            variant="ceria"
            label="Menunggu"
            value={stats.antreanVerifikasi}
            description="Butuh verifikasi relawan"
            icon={Clock}
          />
          <StatCard
            variant="toska"
            label="Terbit di Peta"
            value={stats.terverifikasiValid}
            description="Dinyatakan valid"
            icon={CheckCircle2}
          />
          <StatCard
            variant="putih"
            label="Ditolak"
            value={stats.laporanDitolak}
            description="Tidak memenuhi kriteria"
            icon={XCircle}
          />
        </div>
      </div>

      {/* ========================================================
          2. FILTER & TOOLBAR ANTREAN
         ======================================================== */}
      <Card className="p-4 sm:p-5 space-y-4">
        {/* Tab Segmentasi Status Laporan */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-garis">
          <div className="flex items-center gap-2">
            {[
              { id: 'menunggu', label: 'Menunggu Verifikasi', count: stats.menunggu, color: 'bg-ceria-400 text-ink' },
              { id: 'valid', label: 'Valid / Terbit', count: stats.valid, color: 'bg-musi-100 text-musi-800' },
              { id: 'ditolak', label: 'Ditolak', count: stats.ditolak, color: 'bg-abu-100 text-ink-soft' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedId(null);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer select-none ${
                    isActive
                      ? 'bg-ink text-white shadow-xs'
                      : 'bg-slate-50 text-ink-muted hover:bg-slate-100 hover:text-ink'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {(searchQuery || districtFilter !== 'all' || severityFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDistrictFilter('all');
                setSeverityFilter('all');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-musi-600 hover:text-musi-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Input Pencarian & Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID tiket atau kata kunci judul..."
              className="w-full h-10 pl-10 pr-3.5 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600 focus:ring-4 focus:ring-musi-100 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600 transition"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600 transition"
            >
              <option value="all">Semua Tingkat</option>
              <option value="berat">Tingkat Berat</option>
              <option value="sedang">Tingkat Sedang</option>
              <option value="ringan">Tingkat Ringan</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ========================================================
          3. MASTER-DETAIL DUA KOLOM (Desktop >= 1024px)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Daftar Antrean Laporan (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Daftar Laporan ({filteredList.length})
            </span>
            <span className="text-xs font-bold text-musi-600 capitalize">
              Status: {activeTab}
            </span>
          </div>

          {filteredList.length === 0 ? (
            <EmptyState
              title="Antrean Bersih"
              description={`Saat ini tidak ada laporan dengan status ${activeTab} yang sesuai filter.`}
            />
          ) : (
            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredList.map(rep => {
                const isSelected = currentReport?.id === rep.id;
                const severity = (rep.estimated_severity || rep.severity || 'sedang').toLowerCase();
                const formattedDate = rep.created_at
                  ? new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : '10 Nov';

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedId(rep.id)}
                    className={`bg-white rounded-2xl p-3.5 border transition-all duration-150 cursor-pointer flex gap-3 items-start select-none ${
                      isSelected
                        ? 'border-ungu-600 ring-4 ring-ungu-100 shadow-md scale-[1.01]'
                        : 'border-garis hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-garis">
                      <img
                        src={rep.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=300&q=80'}
                        alt={rep.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge type="tingkat" value={severity} size="md" />
                        <span className="text-xs font-semibold text-ink-muted">
                          {formattedDate}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-ink truncate mt-0.5">
                        {rep.title}
                      </h4>

                      <p className="text-xs text-ink-muted truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-musi-600 shrink-0" />
                        <span className="truncate">{rep.district}</span>
                      </p>

                      <div className="text-xs font-mono font-bold text-ink-muted tabular-nums">
                        {rep.tracking_code}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Panel Detail & Tindakan Verifikasi (lg:col-span-7) */}
        <div className="lg:col-span-7">
          {currentReport ? (
            <Card className="p-5 sm:p-7 space-y-6 bg-white">
              {/* Header Tiket Detail */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-garis">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-musi-600 bg-musi-100 px-2.5 py-0.5 rounded-full">
                      {currentReport.tracking_code}
                    </span>
                    <span className="text-xs text-ink-muted">
                      &bull; Dikirim {currentReport.created_at ? new Date(currentReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '14 Nov 2026'}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-ink leading-snug">
                    {currentReport.title}
                  </h2>
                </div>

                <Badge
                  type="status"
                  value={currentReport.status === 'terverifikasi' ? 'valid' : currentReport.status}
                  size="lg"
                />
              </div>

              {/* Foto Bukti Inspeksi Resolusi Penuh */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                  Foto Bukti yang Dikirimkan Warga
                </span>
                <div className="rounded-2xl overflow-hidden border border-garis bg-slate-900 max-h-96 flex items-center justify-center">
                  <img
                    src={currentReport.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80'}
                    alt={currentReport.title}
                    className="w-full h-full object-cover max-h-96"
                  />
                </div>
              </div>

              {/* Peta Lokasi Kejadian + Tombol Buka di Google Maps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Lokasi Sempadan Sungai
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${currentReport.latitude || -2.9904},${currentReport.longitude || 104.7565}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-musi-600 hover:text-musi-800"
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-garis relative">
                  <MapContainer
                    center={[currentReport.latitude || -2.9904, currentReport.longitude || 104.7565]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[currentReport.latitude || -2.9904, currentReport.longitude || 104.7565]}
                      icon={createPin(currentReport.estimated_severity || 'sedang')}
                    />
                  </MapContainer>
                </div>

                <div className="text-xs text-ink-soft flex items-center justify-between pt-1">
                  <span>{currentReport.district} &bull; {currentReport.address_landmark}</span>
                  <span className="font-mono text-ink-muted">{currentReport.latitude}, {currentReport.longitude}</span>
                </div>
              </div>

              {/* Deskripsi & Kondisi Lokasi */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-garis space-y-2 text-xs">
                <span className="font-bold text-ink uppercase tracking-wider block">
                  Keterangan Observasi Warga:
                </span>
                <p className="text-ink-soft leading-relaxed whitespace-pre-line">
                  {currentReport.description}
                </p>
              </div>

              {/* ====================================================
                  PANEL PENETAPAN VERIFIKASI RELAWAN (FR-5)
                 ==================================================== */}
              <div className="pt-4 border-t border-garis space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-ungu-100 text-ungu-800 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      Penetapan Verifikasi Relawan GG River Care
                    </h3>
                    <p className="text-xs text-ink-muted">
                      Menandai valid akan langsung menerbitkan laporan ini ke peta publik warga.
                    </p>
                  </div>
                </div>

                {/* Penetapan Tingkat Dugaan Resmi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Tetapkan Tingkat Pencemaran Resmi:
                  </label>
                  <ChipGroup
                    options={severityOptions}
                    value={verifiedSeverity}
                    onChange={setVerifiedSeverity}
                  />
                </div>

                {/* Catatan Relawan Verifikator */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Catatan Verifikator <span className="text-ink-muted font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Contoh: Titik tumpahan oli telah dikonfirmasi berada di bibir sempadan dermaga..."
                    className="w-full p-3 bg-white border border-garis rounded-2xl text-xs font-medium text-ink focus:outline-none focus:border-ungu-600 focus:ring-4 focus:ring-ungu-100 transition resize-none"
                  />
                </div>

                {/* Tombol Aksi Verifikasi */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="button"
                    variant="valid"
                    size="md"
                    onClick={handleApprove}
                    className="w-full sm:flex-1"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Tandai Valid &amp; Terbitkan ke Peta</span>
                  </Button>

                  <Button
                    type="button"
                    variant="tolak"
                    size="md"
                    onClick={() => {
                      setRejectModalOpen(true);
                      setRejectError('');
                    }}
                    className="w-full sm:w-auto"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak Laporan</span>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center p-12 text-ink-muted">
              Pilih salah satu laporan di kolom kiri untuk melihat rincian inspeksi.
            </Card>
          )}
        </div>
      </div>

      {/* ========================================================
          DIALOG PENOLAKAN LAPORAN (A4)
         ======================================================== */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 sm:p-8 space-y-5 bg-white shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-tingkat-berat-bg text-tingkat-berat-tx flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  Tolak Laporan #{currentReport?.tracking_code}?
                </h3>
                <p className="text-xs text-ink-muted">
                  Warga pelapor dapat membaca alasan ini saat mengecek kode tiket.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Alasan Penolakan <span className="text-tingkat-berat-tx">* (Wajib)</span>
              </label>
              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Foto bukti tidak memuat indikasi pencemaran air sempadan Musi yang jelas atau berada di daratan jalan protokol..."
                className="w-full p-3.5 bg-slate-50 border border-garis rounded-2xl text-xs font-medium text-ink focus:outline-none focus:bg-white focus:border-tingkat-berat-tx focus:ring-4 focus:ring-tingkat-berat-bg transition resize-none"
              />
              {rejectError && (
                <p className="text-xs text-tingkat-berat-tx font-bold">{rejectError}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="garis"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
              >
                <span>Batal</span>
              </Button>

              <Button
                type="button"
                variant="tolak"
                size="sm"
                onClick={handleConfirmReject}
              >
                <span>Konfirmasi Tolak</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
