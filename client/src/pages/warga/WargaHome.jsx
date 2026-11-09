import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Search,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Download,
  Clock,
  Layers,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';

// Fix ikon marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pin marker helper
const createCustomPin = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2.5px solid white;
      box-shadow: 0 0 8px rgba(0,0,0,0.45);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function WargaHome({ onNavigate }) {
  const { reports } = useAdmin();
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedReport, setSelectedReport] = useState(reports[0] || null);
  const [validationsCount, setValidationsCount] = useState(42);
  const [hasValidated, setHasValidated] = useState(false);

  // Koordinat Jembatan Ampera Kota Palembang
  const centerMusi = [-2.9912, 104.7635];

  const handleValidate = () => {
    if (!hasValidated) {
      setValidationsCount(prev => prev + 1);
      setHasValidated(true);
    }
  };

  const filteredReports = reports.filter(r => {
    if (selectedZone === 'ulu') return r.district.toLowerCase().includes('ulu') || r.address_landmark.toLowerCase().includes('ulu');
    if (selectedZone === 'ilir') return r.district.toLowerCase().includes('ilir') || r.address_landmark.toLowerCase().includes('ilir');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner Mobile Only (Sesuai Desain Figma Compact Mobile) */}
      <div className="lg:hidden space-y-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0088cc] border border-sky-200 text-xs font-bold mb-2">
            💧 Gerakan Jaga Sungai Musi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Pantau &amp; Laporkan Pencemaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Wadah resmi warga Palembang melaporkan timbulan sampah liar, tumpahan minyak, &amp; limbah air di sepanjang aliran Sungai Musi.
          </p>
        </div>

        {/* 2 Tombol CTA Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate && onNavigate('report')}
            className="w-full py-3 px-4 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0088cc]/20 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Lapor Pencemaran Sekarang</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('track')}
            className="w-full py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#0088cc] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-200 transition"
          >
            <Search className="w-4 h-4" />
            <span>Cek Status Laporan</span>
          </button>
        </div>

        {/* 2 Stat Card Mini Mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0088cc] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">148 Lokasi</p>
              <p className="text-[10px] text-slate-500">Dipantau Relawan</p>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-rose-600 text-sm">24 Titik</p>
              <p className="text-[10px] text-rose-700">Perlu Dibersihkan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Peta Sebaran di Kiri & Panel Detail/Feed di Kanan (Desktop & Tablet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Peta Sebaran Sungai Musi */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Header Filter Peta */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSelectedZone('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                    selectedZone === 'all'
                      ? 'bg-[#0088cc] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Zona
                </button>
                <button
                  onClick={() => setSelectedZone('ulu')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs ${
                    selectedZone === 'ulu'
                      ? 'bg-[#0088cc] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Seberang Ulu
                </button>
                <button
                  onClick={() => setSelectedZone('ilir')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs ${
                    selectedZone === 'ilir'
                      ? 'bg-[#0088cc] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Seberang Ilir
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Peta Aktif
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] font-mono text-slate-400">1:25.000</span>
              </div>
            </div>

            {/* Wadah Peta Leaflet */}
            <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[500px]">
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

                {/* Buffer Sempadan Musi */}
                <Circle
                  center={[-2.99418, 104.76122]}
                  radius={120}
                  pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.15 }}
                />

                {/* Marker Laporan Warga */}
                {filteredReports.map((rep) => {
                  let color = '#10b981';
                  if (rep.estimated_severity === 'berat') color = '#ef4444';
                  if (rep.estimated_severity === 'sedang') color = '#f59e0b';

                  return (
                    <Marker
                      key={rep.id}
                      position={[rep.latitude, rep.longitude]}
                      icon={createCustomPin(color)}
                      eventHandlers={{
                        click: () => setSelectedReport(rep)
                      }}
                    >
                      <Popup>
                        <div className="p-1 text-xs space-y-1">
                          <p className="font-bold text-slate-900">{rep.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">#{rep.tracking_code}</p>
                          <p className="text-[10px] text-rose-600 font-semibold">{rep.address_landmark}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Legenda Tingkat Pencemaran di Kiri Bawah Peta */}
              <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold text-slate-700 pointer-events-auto">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Berat (TSS &gt; 100)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Sedang</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Ringan</span>
                </span>
              </div>
            </div>

            {/* Footer Peta: Sinkronisasi Sentinel-2B & Tombol Unduh GeoJSON */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Compass className="w-3.5 h-3.5 text-[#0088cc]" />
                <span>Sentinel-2B &bull; Sinkronisasi 8 menit lalu via DLH Palembang</span>
              </div>

              <button
                onClick={() => alert('Mengunduh Berkas Spasial GeoJSON DAS Musi Resmi...')}
                className="flex items-center gap-1 text-[#0088cc] hover:text-[#0077b3] font-semibold transition self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh GeoJSON DAS Musi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Detail Laporan Terpilih & Feed Laporan Terbaru */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* 1. Card Detail Laporan Terpilih */}
          {selectedReport && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {/* Header Badge Tiket */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-[#0088cc] border border-sky-200">
                  #{selectedReport.tracking_code}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Terverifikasi DLH</span>
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    🔴 Tercemar Berat
                  </span>
                </div>
              </div>

              {/* Konten Foto + Info Ringkas */}
              <div className="flex gap-3">
                <img
                  src={selectedReport.photo_url}
                  alt={selectedReport.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                    {selectedReport.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedReport.address_landmark}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              {/* Timestamp & Koordinat */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">Hari ini, 08:42 WIB</span>
                </div>
                <div className="flex items-center justify-end gap-1 truncate text-slate-700 font-bold">
                  <Compass className="w-3 h-3 text-[#0088cc] shrink-0" />
                  <span className="truncate">{selectedReport.latitude}, {selectedReport.longitude}</span>
                </div>
              </div>

              {/* 2 Tombol Aksi Warga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleValidate}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs ${
                    hasValidated
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{hasValidated ? 'Tervalidasi' : 'Bantu Validasi'} ({validationsCount})</span>
                </button>

                <a
                  href="https://wa.me/6281178902211"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Petugas</span>
                </a>
              </div>
            </div>
          )}

          {/* 2. Feed Laporan Warga Terbaru */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Laporan Warga Terbaru</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  12 Menit Lalu
                </span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('track')}
                className="text-xs font-semibold text-[#0088cc] hover:underline flex items-center gap-1"
              >
                <span>Lihat Arsip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List 3 Tiket Terbaru */}
            <div className="space-y-2.5">
              {reports.slice(0, 3).map((rep, idx) => {
                let borderBar = 'bg-amber-500';
                let badgeText = 'Sedang';
                let badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                if (rep.estimated_severity === 'berat') {
                  borderBar = 'bg-rose-500';
                  badgeText = 'Berat';
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                }
                if (rep.estimated_severity === 'ringan') {
                  borderBar = 'bg-emerald-500';
                  badgeText = 'Ringan';
                  badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                }

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-slate-50/70 transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className={`w-1 h-10 rounded-full ${borderBar} shrink-0 mt-0.5`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[10px] text-slate-400">
                            #{rep.tracking_code}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeClass}`}>
                            {badgeText}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs truncate mt-0.5 group-hover:text-[#0088cc] transition">
                          {rep.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {rep.district} &bull; {idx === 0 ? '1 Jam lalu' : idx === 1 ? '3 Jam lalu' : '5 Jam lalu'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                      Valid ({idx === 0 ? 18 : idx === 1 ? 31 : 56}) &rsaquo;
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

