import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Filter, Layers, Eye, ShieldCheck, Waves } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SeverityBadge, StatusBadge } from '../../components/common/Badges';

// Custom Pin Marker Droplet SVG
const createCustomPin = (severity, isPending) => {
  const colorMap = {
    berat: '#DC2626',
    sedang: '#D97706',
    ringan: '#059669',
  };
  const color = colorMap[severity] || '#0284C7';

  return L.divIcon({
    className: 'custom-admin-pin',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${isPending ? '3px dashed #F59E0B' : '2.5px solid white'};
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        cursor: pointer;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

export default function AdminMap() {
  const { reports, riverSegments, openVerifyModal } = useAdmin();
  const [mapSeverity, setMapSeverity] = useState('all');
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // Pusat Peta Palembang (Jembatan Ampera - Sungai Musi)
  const defaultCenter = [-2.9909, 104.7565];

  const mapReports = reports.filter((r) => {
    const matchSev = mapSeverity === 'all' || r.estimated_severity === mapSeverity;
    const matchPending = showPendingOnly ? r.status === 'menunggu' : true;
    return matchSev && matchPending;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Waves className="w-6 h-6 text-river-600" />
            Peta Pemantauan Titik Pencemaran Sungai Musi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Informasi Geografis (GIS) pemetaan sebaran limbah dan pencemaran air
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Berat
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Ringan
          </div>
        </div>
      </div>

      {/* Map Container with Floating Filter Controls (Layar 4 Figma) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Floating Filter Card */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-lg text-xs space-y-2.5 max-w-xs">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-river-600" /> Filter Titik Peta
            </span>
            <span className="text-[11px] font-mono bg-river-100 text-river-800 px-1.5 py-0.5 rounded">
              {mapReports.length} Titik
            </span>
          </div>

          <div>
            <select
              value={mapSeverity}
              onChange={(e) => setMapSeverity(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-river-500"
            >
              <option value="all">Semua Tingkat Keparahan</option>
              <option value="berat">🔴 Tercemar Berat</option>
              <option value="sedang">🟡 Tercemar Sedang</option>
              <option value="ringan">🟢 Tercemar Ringan</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showPendingOnly}
              onChange={(e) => setShowPendingOnly(e.target.checked)}
              className="rounded text-river-600 focus:ring-river-500"
            />
            <span>Hanya tampilkan laporan menunggu</span>
          </label>
        </div>

        {/* Leaflet Map Full Canvas */}
        <div className="h-[620px] w-full">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Markers */}
            {mapReports.map((report) => {
              const pos = [report.latitude, report.longitude];
              const isPending = report.status === 'menunggu';

              return (
                <Marker
                  key={report.id}
                  position={pos}
                  icon={createCustomPin(report.estimated_severity, isPending)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 max-w-xs text-xs space-y-2">
                      <div className="relative rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={report.photo_url}
                          alt={report.title}
                          className="w-full h-28 object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5">
                          <SeverityBadge severity={report.estimated_severity} />
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">
                          {report.tracking_code}
                        </span>
                        <h4 className="font-bold text-slate-900 line-clamp-2">
                          {report.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Kec. {report.district} ({report.address_landmark})</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <StatusBadge status={report.status} />
                        <button
                          onClick={() => openVerifyModal(report)}
                          className="px-2.5 py-1 bg-river-600 hover:bg-river-700 text-white font-bold rounded-md text-[11px] transition"
                        >
                          Tinjau
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

