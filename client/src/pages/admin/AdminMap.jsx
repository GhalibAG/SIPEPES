import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Filter,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Droplets,
  Calendar,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

// Fix ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Marker Pin Tetesan Air SVG
const createDropPinIcon = (severity, isSelected = false) => {
  const colorMap = { berat: '#D93A40', sedang: '#FFA63D', ringan: '#22B573' };
  const color = colorMap[severity] || colorMap.sedang;
  const size = isSelected ? 42 : 36;

  return L.divIcon({
    className: 'custom-drop-pin',
    html: `
      <div style="width:${size}px; height:${size}px; transform:translate(-50%, -100%); filter:drop-shadow(0 4px 6px rgba(18,33,63,0.3));">
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none">
          <path d="M18 2C18 2 6 15.5 6 23C6 29.6 11.4 35 18 35C24.6 35 30 29.6 30 23C30 15.5 18 2 18 2Z" fill="${color}" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="18" cy="22" r="4.5" fill="#FFFFFF"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

function MapController({ targetCenter }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, 15, { duration: 1.2 });
    }
  }, [targetCenter, map]);
  return null;
}

export default function AdminMap() {
  const { reports, setSelectedReportId } = useAdmin();
  const navigate = useNavigate();

  const [severityFilter, setSeverityFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedReportId, setSelectedReportLocal] = useState(null);
  const [targetCenter, setTargetCenter] = useState(null);

  const centerMusi = [-2.9912, 104.7635];

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

  // Peta Admin menampilkan laporan valid (bisa ditambah opsi melihat semua status)
  const validReports = useMemo(() => {
    return (reports || []).filter(r => r.status === 'valid' || r.status === 'terverifikasi');
  }, [reports]);

  const filteredReports = useMemo(() => {
    return validReports.filter(rep => {
      if (severityFilter !== 'all') {
        const sev = (rep.estimated_severity || rep.severity || '').toLowerCase();
        if (sev !== severityFilter) return false;
      }
      if (districtFilter !== 'all' && districtFilter !== 'Semua Kecamatan') {
        if (!(rep.district || '').toLowerCase().includes(districtFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [validReports, severityFilter, districtFilter]);

  // Statistik Sebaran Titik per Kecamatan
  const districtCounts = useMemo(() => {
    const counts = {};
    validReports.forEach(r => {
      const d = r.district || 'Lainnya';
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [validReports]);

  const handleSelectReport = (rep) => {
    setSelectedReportLocal(rep.id);
    if (rep.latitude && rep.longitude) {
      setTargetCenter([rep.latitude, rep.longitude]);
    }
  };

  const handleNavigateDetail = (id) => {
    setSelectedReportId(id);
    navigate(`/admin/laporan/${id}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Peta Sebaran Laporan Valid
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Visualisasi geospasial titik pencemaran sempadan Sungai Musi yang telah terverifikasi.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-musi-100 text-musi-800 text-xs font-bold self-start sm:self-auto">
          <Droplets className="w-3.5 h-3.5 text-musi-600" />
          <span>{filteredReports.length} Titik Terbit</span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mr-1">
              Tingkat:
            </span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'berat', label: 'Berat' },
              { id: 'sedang', label: 'Sedang' },
              { id: 'ringan', label: 'Ringan' }
            ].map(lvl => {
              const isActive = severityFilter === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeverityFilter(lvl.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer select-none border ${
                    isActive
                      ? 'bg-musi-600 text-white border-musi-600 shadow-xs'
                      : 'bg-white text-ink-muted border-garis hover:bg-slate-50'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-10 px-3.5 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-musi-600"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {(severityFilter !== 'all' || districtFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSeverityFilter('all');
                  setDistrictFilter('all');
                }}
                className="p-2 text-ink-muted hover:text-ink cursor-pointer"
                title="Reset filter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: Peta Utama & Panel Sebaran Kecamatan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Wadah Peta (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-garis p-2 sm:p-2.5 shadow-lembut relative overflow-hidden">
          <div className="h-[440px] sm:h-[560px] lg:h-[620px] w-full rounded-2xl overflow-hidden relative">
            <MapContainer
              center={centerMusi}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController targetCenter={targetCenter} />

              {filteredReports.map(rep => {
                const lat = rep.latitude || -2.9912;
                const lng = rep.longitude || 104.7635;
                const severity = (rep.estimated_severity || rep.severity || 'sedang').toLowerCase();
                const isSelected = selectedReportId === rep.id;
                const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                return (
                  <Marker
                    key={rep.id}
                    position={[lat, lng]}
                    icon={createDropPinIcon(severity, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedReportLocal(rep.id)
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="w-64 overflow-hidden font-sans">
                        <div className="h-28 w-full bg-slate-900 overflow-hidden relative">
                          <img
                            src={rep.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'}
                            alt={rep.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge type="tingkat" value={severity} size="md" />
                          </div>
                        </div>

                        <div className="p-3.5 space-y-2.5 text-xs">
                          <div>
                            <span className="font-mono text-xs font-bold text-musi-600 block">
                              {rep.tracking_code}
                            </span>
                            <h4 className="font-bold text-ink leading-snug">
                              {rep.title}
                            </h4>
                          </div>

                          <div className="space-y-1 text-ink-soft text-xs">
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-musi-600 shrink-0" />
                              <span className="truncate">{rep.district} &bull; {rep.address_landmark}</span>
                            </p>
                            <p className="flex items-center gap-1 text-ink-muted">
                              <Calendar className="w-3 h-3 text-ink-muted shrink-0" />
                              <span>{rep.created_at ? new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Nov 2026'}</span>
                            </p>
                          </div>

                          <div className="pt-2 border-t border-garis flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleNavigateDetail(rep.id)}
                              className="w-full py-1.5 px-3 rounded-full bg-ungu-600 hover:bg-ungu-800 text-white font-bold text-xs transition cursor-pointer"
                            >
                              Buka Detail Verifikasi
                            </button>

                            <a
                              href={gmapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 text-ink-muted hover:text-ink text-xs font-semibold transition"
                            >
                              <span>Buka di Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Legenda Tingkat */}
            <div className="absolute left-3 bottom-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 border border-garis shadow-lembut flex items-center gap-3 text-xs font-bold select-none">
              <span className="flex items-center gap-1.5 text-tingkat-berat-tx">
                <span className="w-2.5 h-2.5 rounded-full bg-tingkat-berat" />
                <span>Berat</span>
              </span>
              <span className="flex items-center gap-1.5 text-tingkat-sedang-tx">
                <span className="w-2.5 h-2.5 rounded-full bg-tingkat-sedang" />
                <span>Sedang</span>
              </span>
              <span className="flex items-center gap-1.5 text-tingkat-ringan-tx">
                <span className="w-2.5 h-2.5 rounded-full bg-tingkat-ringan" />
                <span>Ringan</span>
              </span>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Rekapitulasi per Kecamatan (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4 bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
              Sebaran per Kecamatan ({districtCounts.length})
            </span>

            <div className="space-y-2">
              {districtCounts.map(([distName, count]) => (
                <div
                  key={distName}
                  onClick={() => setDistrictFilter(distName)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-musi-100 hover:text-musi-800 transition cursor-pointer text-xs font-semibold select-none"
                >
                  <span className="truncate">{distName}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-garis text-ink font-bold tabular-nums">
                    {count} Titik
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
