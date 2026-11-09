import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, User, Phone, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, StatusBadge, PollutionTypeBadge } from '../common/Badges';

// Custom Pin SVG untuk Leaflet
const createPinIcon = (severity) => {
  const colorMap = {
    berat: '#DC2626',
    sedang: '#D97706',
    ringan: '#059669',
  };
  const color = colorMap[severity] || '#0284C7';

  return L.divIcon({
    className: 'custom-droplet-pin',
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
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export default function AdminVerifyModal() {
  const { selectedReport, isVerifyModalOpen, closeVerifyModal, verifyReport } = useAdmin();

  const [severity, setSeverity] = useState('sedang');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('valid'); // 'valid' | 'ditolak'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedReport) {
      setSeverity(selectedReport.estimated_severity || 'sedang');
      setNotes(selectedReport.admin_notes || '');
      setRejectionReason(selectedReport.rejection_reason || '');
      setActionType(selectedReport.status === 'ditolak' ? 'ditolak' : 'valid');
    }
  }, [selectedReport]);

  if (!isVerifyModalOpen || !selectedReport) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === 'ditolak' && !rejectionReason.trim()) {
      alert('Alasan penolakan wajib diisi agar pelapor memahami penyebab laporan tidak valid.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      verifyReport(
        selectedReport.id,
        actionType,
        severity,
        notes,
        actionType === 'ditolak' ? rejectionReason : ''
      );
      setIsSubmitting(false);
      closeVerifyModal();
    }, 400);
  };

  const position = [selectedReport.latitude, selectedReport.longitude];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-river-100 text-river-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {selectedReport.tracking_code}
                </span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
                {selectedReport.title}
              </h2>
            </div>
          </div>
          <button
            onClick={closeVerifyModal}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Kolom Kiri: Bukti Foto & Peta (5 Kolom) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Foto Bukti */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
              <img
                src={selectedReport.photo_url}
                alt="Bukti Pencemaran"
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <span>Foto Bukti Lapangan</span>
              </div>
            </div>

            {/* Mini Map Interaktif Leaflet */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-river-600" /> Titik Koordinat GPS
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}
                </span>
              </div>
              <div className="h-44 w-full">
                <MapContainer
                  center={position}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={createPinIcon(selectedReport.estimated_severity)}>
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

            {/* Info Pelapor */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Pelapor:
                </span>
                <span className="font-semibold text-slate-800">{selectedReport.reporter_name || 'Warga Peduli (Anonim)'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Kontak / WA:
                </span>
                {selectedReport.reporter_phone ? (
                  <a
                    href={`https://wa.me/${selectedReport.reporter_phone.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-river-600 hover:underline flex items-center gap-1"
                  >
                    {selectedReport.reporter_phone} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Tidak dicantumkan</span>
                )}
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Kejadian:
                </span>
                <span className="text-slate-800 font-medium">
                  {new Date(selectedReport.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rincian & Form Verifikasi (7 Kolom) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Kategori & Lokasi */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <PollutionTypeBadge type={selectedReport.pollution_type} />
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  📍 Kec. {selectedReport.district}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 font-medium border border-sky-100">
                  🌊 {selectedReport.river_segment_name || 'Kawasan Sungai Musi'}
                </span>
              </div>

              {/* Patokan & Deskripsi */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1">Patokan Lokasi:</p>
                <p className="text-sm text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedReport.address_landmark || 'Tidak ada patokan tambahan'}
                </p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 mb-1">Deskripsi Temuan Warga:</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                  {selectedReport.description}
                </p>
              </div>

              {/* Form Evaluasi Verifikasi Admin */}
              <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-4 flex flex-col gap-4">
                {/* Switcher Aksi: Validasi vs Tolak */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Keputusan Tindakan Verifikasi:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType('valid')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                        actionType === 'valid'
                          ? 'bg-eco-50 border-eco-500 text-eco-700 ring-2 ring-eco-500/20'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-eco-600" />
                      Laporan Valid (Terima)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType('ditolak')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                        actionType === 'ditolak'
                          ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-red-600" />
                      Tolak Laporan
                    </button>
                  </div>
                </div>

                {/* Jika Aksi: Validasi -> Tentukan Severity */}
                {actionType === 'valid' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tetapkan Tingkat Dugaan Keparahan:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'ringan', label: 'Ringan', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
                        { id: 'sedang', label: 'Sedang', color: 'border-amber-400 bg-amber-50 text-amber-800' },
                        { id: 'berat', label: 'Berat', color: 'border-red-400 bg-red-50 text-red-800' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSeverity(item.id)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition ${
                            severity === item.id
                              ? `${item.color} ring-2 ring-offset-1`
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jika Aksi: Tolak -> Input Alasan Penolakan */}
                {actionType === 'ditolak' && (
                  <div>
                    <label className="block text-xs font-semibold text-red-700 mb-1">
                      Alasan Penolakan (Wajib Diisi):
                    </label>
                    <textarea
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Contoh: Lokasi berada di luar aliran Sungai Musi, atau foto tidak menunjukkan bukti pencemaran..."
                      className="w-full text-xs p-2.5 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                )}

                {/* Catatan Lapangan Admin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Verifikasi Tim Lapangan (Opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titik telah dikonfirmasi oleh tim GG River Care perahu 2. Siap diagendakan untuk aksi bersih sungai..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-river-500"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeVerifyModal}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2 text-xs font-semibold rounded-lg text-white shadow-sm flex items-center gap-1.5 transition ${
                      actionType === 'valid'
                        ? 'bg-eco-600 hover:bg-eco-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isSubmitting ? (
                      'Menyimpan...'
                    ) : actionType === 'valid' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Simpan Verifikasi Valid
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Konfirmasi Penolakan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

