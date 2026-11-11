import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Search,
  MessageSquare,
  ThumbsUp,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';

// Fix ikon Leaflet default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Pin Marker Generator
const createCustomPin = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="
      background-color: ${color};
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export default function WargaHome({ onNavigate }) {
  const { reports } = useAdmin();
  const [selectedZone, setSelectedZone] = useState('all'); // 'all' | 'ulu' | 'ilir' | 'berat'
  const [selectedReport, setSelectedReport] = useState(reports[0] || null);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(38);

  // Titik Pusat Sungai Musi (Sekitar Jembatan Ampera)
  const centerMusi = [-2.9912, 104.7635];

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvoteCount(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  const filteredReports = reports.filter(r => {
    if (selectedZone === 'ulu') {
      return (r.district && r.district.toLowerCase().includes('ulu')) || (r.address_landmark && r.address_landmark.toLowerCase().includes('ulu'));
    }
    if (selectedZone === 'ilir') {
      return (r.district && r.district.toLowerCase().includes('ilir')) || (r.address_landmark && r.address_landmark.toLowerCase().includes('ilir'));
    }
    if (selectedZone === 'berat') {
      return r.estimated_severity === 'berat' || r.category?.toLowerCase().includes('minyak');
    }
    return true;
  });

  return (
    <div className="space-y-6">

      {/* 1. Hero Header Sederhana & Ramah Warga */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            Peta Sebaran Titik Pencemaran Air
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Klik pin pada peta untuk melihat bukti foto, lokasi sempadan, dan status verifikasi tim relawan Green Generation Palembang.
          </p>
        </div>

        {/* 2 Tombol Aksi Cepat */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('report')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Lapor Titik Baru</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('track')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Lacak Tiket</span>
          </button>
        </div>
      </div>

      {/* 2. Peta Sebaran & Panel Detail Insiden */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Kolom Peta Utama */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">

            {/* Filter Bar Peta (Clean & Crisp - No Washed-Out Colors) */}
            <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                  Zona:
                </span>
                <button
                  onClick={() => setSelectedZone('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${selectedZone === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  Semua ({reports.length})
                </button>
                <button
                  onClick={() => setSelectedZone('ulu')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${selectedZone === 'ulu'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  Seberang Ulu
                </button>
                <button
                  onClick={() => setSelectedZone('ilir')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${selectedZone === 'ilir'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  Seberang Ilir
                </button>
                <button
                  onClick={() => setSelectedZone('berat')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${selectedZone === 'berat'
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedZone === 'berat' ? 'bg-white' : 'bg-rose-500'}`}></span>
                  <span>Kategori Parah</span>
                </button>
              </div>

              {/* Legenda Ringkas */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Parah
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Sedang
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ringan
                </span>
              </div>
            </div>

            {/* Wadah Peta Leaflet */}
            <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px]">
              <MapContainer
                center={centerMusi}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 10 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Radius Sempadan Musi */}
                <Circle
                  center={[-2.9912, 104.7635]}
                  radius={200}
                  pathOptions={{ color: '#0088cc', fillColor: '#38bdf8', fillOpacity: 0.15 }}
                />

                {/* Marker Laporan */}
                {filteredReports.map((rep) => {
                  const pinColor =
                    rep.estimated_severity === 'berat'
                      ? '#ef4444'
                      : rep.estimated_severity === 'sedang'
                        ? '#f59e0b'
                        : '#10b981';

                  return (
                    <Marker
                      key={rep.id}
                      position={[rep.latitude || -2.9904, rep.longitude || 104.7565]}
                      icon={createCustomPin(pinColor)}
                      eventHandlers={{
                        click: () => setSelectedReport(rep),
                      }}
                    >
                      <Popup>
                        <div className="p-1 space-y-1 text-xs">
                          <strong className="block text-slate-900">{rep.title}</strong>
                          <p className="text-slate-500 text-[11px]">{rep.address_landmark}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${rep.estimated_severity === 'berat' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            {rep.category}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Laporan yang Dipilih */}
        <div className="lg:col-span-4 space-y-4">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  #{selectedReport.tracking_code}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider text-white ${selectedReport.status === 'valid'
                    ? 'bg-emerald-600'
                    : selectedReport.status === 'ditolak'
                      ? 'bg-rose-600'
                      : 'bg-amber-500'
                  }`}>
                  {selectedReport.status === 'valid' ? 'Tervalidasi' : selectedReport.status === 'ditolak' ? 'Ditolak' : 'Menunggu Cek'}
                </span>
              </div>

              {/* Foto Bukti */}
              <div className="rounded-xl overflow-hidden border border-slate-100 max-h-48 relative">
                <img
                  src={selectedReport.photo_url}
                  alt={selectedReport.title}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium">
                  {selectedReport.category}
                </div>
              </div>

              {/* Judul & Lokasi */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {selectedReport.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0088cc] shrink-0" />
                  <span>{selectedReport.address_landmark}</span>
                </p>
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                "{selectedReport.description || 'Laporan pencemaran telah dicatat dan dalam proses peninjauan lapangan oleh pengelola.'}"
              </p>

              {/* Tombol Interaksi Ringkas */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleUpvote}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${hasUpvoted
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{hasUpvoted ? 'Terverifikasi' : 'Bantu Validasi'} ({upvoteCount})</span>
                </button>

                <a
                  href={`https://wa.me/6281178902211?text=Halo%20DLH%20Palembang,%20saya%20ingin%20menindaklanjuti%20laporan%20pencemaran%20${selectedReport.tracking_code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp DLH</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              Pilih salah satu titik marker pada peta untuk melihat detail laporan.
            </div>
          )}

          {/* Tips Partisipasi Warga (Clean Surface) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0088cc]" />
              Peran Anda Sangat Berarti
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Setiap laporan warga yang masuk diverifikasi langsung oleh relawan Green Generation Palembang untuk advokasi penanganan DLHK.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Floating Action Button (FAB) Mobile untuk Lapor Cepat */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => onNavigate && onNavigate('report')}
          className="p-3.5 rounded-full bg-[#0088cc] hover:bg-[#0077b3] text-white shadow-xl shadow-sky-500/30 flex items-center gap-2 font-bold text-xs transition active:scale-95 cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          <span>Lapor Sekarang</span>
        </button>
      </div>
    </div>
  );
}
