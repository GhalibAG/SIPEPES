import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  FileCheck,
  Save
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../../components/common/Badges';

const createPinIcon = (severity) => {
  const colorMap = {
    berat: '#DC2626',
    sedang: '#D97706',
    ringan: '#059669',
  };
  const color = colorMap[severity] || '#0284C7';

  return L.divIcon({
    className: 'custom-verify-pin',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      ">
        <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

export default function AdminVerifyPage() {
  const {
    reports,
    selectedReportId,
    setSelectedReportId,
    selectedReport,
    verifyReport,
    stats
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('menunggu'); // 'menunggu', 'all', 'valid', 'ditolak'
  const [search, setSearch] = useState('');

  // Form State untuk Laporan Terpilih
  const [severity, setSeverity] = useState('sedang');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Update form fields saat selectedReport berganti
  useEffect(() => {
    if (selectedReport) {
      setSeverity(selectedReport.estimated_severity || 'sedang');
      setNotes(selectedReport.admin_notes || '');
      setRejectionReason(selectedReport.rejection_reason || '');
      setSaveSuccessMsg('');
    }
  }, [selectedReport]);

  const filteredList = reports.filter((r) => {
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tracking_code.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleAction = (newStatus) => {
    if (!selectedReport) return;

    if (newStatus === 'ditolak' && !rejectionReason.trim()) {
      alert('Alasan penolakan wajib diisi agar pelapor mengetahui penyebab laporan tidak valid.');
      return;
    }

    verifyReport(
      selectedReport.id,
      newStatus,
      severity,
      notes,
      newStatus === 'ditolak' ? rejectionReason : ''
    );

    setSaveSuccessMsg(
      newStatus === 'valid'
        ? 'Laporan berhasil divalidasi dan sekarang tampil di peta publik!'
        : 'Status laporan diubah menjadi Ditolak dengan catatan resmi.'
    );

    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const currentPos = selectedReport
    ? [selectedReport.latitude, selectedReport.longitude]
    : [-2.9909, 104.7565];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Halaman (Sesuai Layar 3 Figma) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Verifikasi Laporan</span>
            <span>&bull;</span>
            <span className="text-river-600 font-semibold">Tinjauan Bukti Lapangan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Verifikasi & Evaluasi Laporan Pencemaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih laporan dari panel kiri, periksa foto bukti & titik koordinat, lalu tentukan validitasnya
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {stats.menunggu} Menunggu Tindakan
          </span>
        </div>
      </div>

      {/* Grid 2-Pane Master Detail (Sesuai Layar 3 Figma: Kiri List, Kanan Rincian) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= PANEL KIRI: DAFTAR LAPORAN (5 Kolom) ================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[820px]">
          {/* Filter Tabs */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/50">
            {[
              { id: 'menunggu', label: 'Menunggu', count: stats.menunggu, color: 'text-amber-700 bg-amber-100' },
              { id: 'valid', label: 'Valid', count: stats.valid, color: 'text-eco-700 bg-eco-100' },
              { id: 'ditolak', label: 'Ditolak', count: stats.ditolak, color: 'text-slate-600 bg-slate-200' },
              { id: 'all', label: 'Semua', count: stats.total, color: 'text-slate-700 bg-slate-100' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-river-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode tiket, judul, kecamatan..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-river-500"
              />
            </div>
          </div>

          {/* List Kartu Laporan Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada laporan pada filter ini.
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = selectedReportId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReportId(item.id)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-river-50/70 border-river-500 shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={item.photo_url}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.tracking_code}
                        </span>
                        <SeverityBadge severity={item.estimated_severity} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                        <span className="truncate">📍 Kec. {item.district}</span>
                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= PANEL KANAN: RINCIAN & VERIFIKASI (7 Kolom) ================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {!selectedReport ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Pilih laporan dari panel kiri untuk meninjau rinciannya.
            </div>
          ) : (
            <>
              {/* Notifikasi Sukses Simpan */}
              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-eco-50 border border-eco-200 text-eco-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-eco-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Header Info Laporan Terpilih */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {selectedReport.tracking_code}
                    </span>
                    <StatusBadge status={selectedReport.status} />
                    <PollutionTypeBadge type={selectedReport.pollution_type} />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {selectedReport.title}
                  </h2>
                </div>
                <div className="text-right text-xs text-slate-400 shrink-0">
                  <p>Dilaporkan: {new Date(selectedReport.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>

              {/* Foto Bukti Resolusi Penuh (Sesuai Layar 3 Figma) */}
              <div className="rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-100">
                <img
                  src={selectedReport.photo_url}
                  alt={selectedReport.title}
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md">
                  Foto Bukti Lapangan Warga
                </div>
              </div>

              {/* Mini Map Koordinat & Info Lokasi (Sesuai Layar 3 Figma) */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-river-600" />
                    Lokasi: Kec. {selectedReport.district} ({selectedReport.address_landmark || 'Bantaran Sungai'})
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Lat: {selectedReport.latitude.toFixed(6)}, Lng: {selectedReport.longitude.toFixed(6)}
                  </span>
                </div>
                <div className="h-48 w-full">
                  <MapContainer
                    center={currentPos}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={currentPos} icon={createPinIcon(selectedReport.estimated_severity)}>
                      <Popup>
                        <div className="text-xs">
                          <strong>{selectedReport.title}</strong>
                          <p>{selectedReport.address_landmark}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {/* Data Pelapor & Deskripsi Warga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Identitas Pelapor</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {selectedReport.reporter_name || 'Warga Peduli (Anonim)'}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {selectedReport.reporter_phone ? (
                      <a
                        href={`https://wa.me/${selectedReport.reporter_phone.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-river-600 font-mono hover:underline flex items-center gap-1"
                      >
                        {selectedReport.reporter_phone} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Tidak mencantumkan nomor</span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Segmen Aliran Sungai Musi</span>
                  <p className="font-bold text-slate-800">
                    🌊 {selectedReport.river_segment_name || 'Kawasan Sungai Musi'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Patokan: {selectedReport.address_landmark || 'Dekat bantaran perairan'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Uraian Deskripsi Temuan Warga
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </p>
              </div>

              {/* Form Tindakan Evaluasi Admin (Sesuai Layar 3 & 5 Figma) */}
              <div className="p-4 rounded-xl border border-river-200 bg-river-50/20 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-river-600" />
                  Keputusan Verifikasi Admin Komunitas
                </h3>

                {/* Pemilih Keparahan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tingkat Dugaan Pencemaran Lapangan:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'ringan', label: '🟢 Ringan', desc: 'Sampah hanyut biasa' },
                      { id: 'sedang', label: '🟡 Sedang', desc: 'Limbah padat/keruh' },
                      { id: 'berat', label: '🔴 Berat', desc: 'Limbah oli/bau pekat' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSeverity(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          severity === item.id
                            ? 'bg-white border-river-600 ring-2 ring-river-500/30 shadow-sm'
                            : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catatan Lapangan Tim Verifikator */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Verifikasi Tim Lapangan GG River Care:
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titik telah dikonfirmasi oleh tim lapangan perahu 2. Siap ditindaklanjuti pada agenda bersih sungai..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-river-500"
                  />
                </div>

                {/* Input Alasan Penolakan (Jika ingin menolak) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alasan Penolakan (Hanya jika laporan ditolak / tidak valid):
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Lokasi berada di daratan jalan protokol, bukan kawasan bantaran Sungai Musi..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                {/* Tombol Aksi Utama (Sesuai Layar 3 Figma) */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleAction('ditolak')}
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Tolak Laporan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('valid')}
                    className="px-5 py-2 bg-eco-600 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-md shadow-eco-600/25 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validasi Laporan (Terima)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
