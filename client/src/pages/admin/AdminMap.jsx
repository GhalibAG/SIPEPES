import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Printer,
  Maximize2,
  Navigation,
  ExternalLink,
  Phone,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Compass
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
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="
      background-color: ${color};
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

export default function AdminMap({ onNavigate }) {
  const { reports, setSelectedReportId } = useAdmin();
  const [filterType, setFilterType] = useState('all');
  const [layerReports, setLayerReports] = useState(true);
  const [layerDAS, setLayerDAS] = useState(true);
  const [layerFactory, setLayerFactory] = useState(true);
  const [selectedPin, setSelectedPin] = useState(reports[0]);
  const [copied, setCopied] = useState(false);

  // Koordinat Jembatan Ampera sebagai titik pusat (0 KM)
  const centerMusi = [-2.9912, 104.7635];

  const handleCopyCoord = () => {
    navigator.clipboard.writeText(`${selectedPin.latitude}, ${selectedPin.longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDetail = (id) => {
    setSelectedReportId(id);
    if (onNavigate) onNavigate('verify');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Geoportal DAS Musi Sesuai Desain Figma */}
      <div className="space-y-3">
        {/* Baris 1: Icon & Judul Geoportal (Teks memecah 2 baris ke bawah sesuai desain) */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0088cc] flex items-center justify-center shrink-0 border border-sky-200 shadow-sm mt-0.5">
            <Compass className="w-5 h-5 text-[#0088cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                Geoportal DAS Musi
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                104 Insiden
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Pemantauan Kualitas Air &amp; Sempadan<br />
              Sungai 2026
            </p>
          </div>
        </div>

        {/* Baris 2: Filter Pills Bar Memanjang Sendiri di Bawah Judul Sesuai Desain */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setLayerReports(!layerReports)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm ${
              layerReports ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-sky-400"></span>
            <span>Laporan</span>
          </button>

          <button
            onClick={() => setLayerDAS(!layerDAS)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm ${
              layerDAS ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
            <span>DAS</span>
          </button>

          <button
            onClick={() => setLayerFactory(!layerFactory)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm ${
              layerFactory ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-amber-400"></span>
            <span>Limbah Pabrik</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            onClick={() => setFilterType(filterType === 'berat' ? 'all' : 'berat')}
            className={`px-2.5 py-1.5 rounded-lg font-bold border transition shadow-sm ${
              filterType === 'berat'
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            Berat (24)
          </button>

          <button
            onClick={() => setFilterType(filterType === 'sedang' ? 'all' : 'sedang')}
            className={`px-2.5 py-1.5 rounded-lg font-bold border transition shadow-sm ${
              filterType === 'sedang'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            Sedang (52)
          </button>

          <button
            onClick={() => setFilterType(filterType === 'ringan' ? 'all' : 'ringan')}
            className={`px-2.5 py-1.5 rounded-lg font-bold border transition shadow-sm ${
              filterType === 'ringan'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            Ringan (28)
          </button>

          <button
            onClick={() => window.open('https://maps.google.com/?q=-2.9912,104.7635', '_blank')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm ml-auto sm:ml-0"
          >
            <Navigation className="w-3.5 h-3.5 text-[#0088cc]" />
            <span>Ampera (0 KM)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            title="Cetak Peta"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            onClick={() => alert('Mode Fullscreen Peta')}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Container Interaktif */}
      <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <MapContainer
          center={centerMusi}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Buffer Radius Sempadan 100m di sekitar Titik Utama */}
          <Circle
            center={[-2.99418, 104.76122]}
            radius={100}
            pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.15 }}
          />

          {/* Pins Laporan */}
          {reports.map((rep) => {
            let color = '#10b981';
            if (rep.estimated_severity === 'berat') color = '#ef4444';
            if (rep.estimated_severity === 'sedang') color = '#f59e0b';

            return (
              <Marker
                key={rep.id}
                position={[rep.latitude, rep.longitude]}
                icon={createCustomIcon(color)}
                eventHandlers={{
                  click: () => setSelectedPin(rep)
                }}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{rep.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">#{rep.tracking_code}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Card: Klaster DAS Terpadat (Realtime) */}
        <div className="absolute top-4 left-4 z-20 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl space-y-3 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#0088cc]">📶</span>
              <h3 className="font-bold text-slate-900 text-xs">Klaster DAS Terpadat</h3>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-50 text-[#0088cc]">
              Realtime
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-[11px]">Seberang Ulu I</p>
                <p className="text-[10px] text-slate-400">Ceceran solar &amp; oli kapal ketek</p>
              </div>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                34
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-[11px]">Tangga Buntung</p>
                <p className="text-[10px] text-slate-400">Limbah plastik &amp; sedimentasi Sekanak</p>
              </div>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                28
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-[11px]">Kertapati &amp; Ogan</p>
                <p className="text-[10px] text-slate-400">Limbah batubara dermaga stasiun</p>
              </div>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                18
              </span>
            </div>
          </div>

          {/* Mutu Air Box */}
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">MUTU AIR (IKA)</span>
              <p className="font-black text-rose-700 text-xs">48.2 (Cemar Sedang)</p>
            </div>
            <span className="text-rose-500 font-bold text-sm">📉</span>
          </div>

          {/* Baris Patroli */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <p className="font-bold text-slate-800 text-[10px] leading-tight">Patroli DLH Unit 02</p>
                <p className="text-[9px] text-slate-400">Hilir Sekanak</p>
              </div>
            </div>
            <button
              onClick={() => alert('Menghubungi Posko DLH Unit 02: (0711) 352-101')}
              className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0088cc] hover:bg-sky-100 font-bold text-[10px] transition"
            >
              Hubungi
            </button>
          </div>
        </div>

        {/* Floating Card: Pop-up Detail Tiket Terpilih */}
        {selectedPin && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden pointer-events-auto animate-fade-in">
            <div className="relative">
              <img
                src={selectedPin.photo_url}
                alt={selectedPin.title}
                className="w-full h-28 object-cover"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] px-2 py-0.5 rounded">
                  #{selectedPin.tracking_code}
                </span>
                <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Berat
                </span>
              </div>
            </div>

            <div className="p-3.5 space-y-2 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{selectedPin.title}</h4>
                <p className="text-[10px] text-slate-500">{selectedPin.address_landmark}</p>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>{selectedPin.latitude}°, {selectedPin.longitude}°</span>
                <span className="font-bold text-rose-600">&plusmn; 45 m&sup2;</span>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                {selectedPin.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleDetail(selectedPin.id)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <span>Detail Berkas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleCopyCoord}
                  title="Salin Koordinat"
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Right: Koordinat & Legenda Spasial 1:15.000 */}
        <div className="absolute bottom-4 right-4 z-20 space-y-2 pointer-events-auto">
          {/* Koordinat & Elevasi */}
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl border border-slate-200 shadow-md text-[10px] font-mono text-slate-600 text-right">
            -2.99281, 104.76402 &bull; Elevasi: 4m
          </div>

          {/* Legenda Spasial */}
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl w-52 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-[10px]">
              <span className="font-bold text-slate-800">Legenda Spasial</span>
              <span className="font-mono text-slate-400">1:15.000</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Tercemar Berat
                </span>
                <strong className="font-mono text-slate-900">24</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Tercemar Sedang
                </span>
                <strong className="font-mono text-slate-900">52</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Tercemar Ringan
                </span>
                <strong className="font-mono text-slate-900">28</strong>
              </div>

              <div className="pt-1 border-t border-slate-100 space-y-1 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-600 rounded"></div>
                  <span>Buffer Sempadan (100m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-sky-300 rounded"></div>
                  <span>Alur Palung Musi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
