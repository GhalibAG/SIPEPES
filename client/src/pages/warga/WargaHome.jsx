import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  Filter,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin } from '../../context/AdminContext';
import PartnerLogo from '../../components/PartnerLogo';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';

// Fix ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generator Pin Tetesan Air SVG Sesuai Standar Desain v2.0
const createDropPinIcon = (severity, isSelected = false) => {
  const colorMap = {
    berat: '#D93A40',
    sedang: '#FFA63D',
    ringan: '#22B573'
  };
  const color = colorMap[severity] || colorMap.sedang;
  const size = isSelected ? 44 : 36;

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

// Komponen Pembantu untuk Menggeser Peta Mulus
function MapController({ targetCenter }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, 15, { duration: 1.2 });
    }
  }, [targetCenter, map]);
  return null;
}

export default function WargaHome() {
  const { reports } = useAdmin();

  // State Filter (FR-7)
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'berat' | 'sedang' | 'ringan'
  const [districtFilter, setDistrictFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [mapTargetCenter, setMapTargetCenter] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pusat Peta: Sekitar Sungai Musi / Jembatan Ampera Palembang
  const centerMusi = [-2.9912, 104.7635];

  // Daftar Kecamatan Kota Palembang di Sepanjang DAS Musi
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

  // FR-6: Hanya laporan berstatus VALID yang ditampilkan di peta & daftar publik
  const validReports = useMemo(() => {
    return (reports || []).filter(r => r.status === 'terverifikasi' || r.status === 'valid');
  }, [reports]);

  // Terapkan Filter Tanggal, Tingkat, dan Kecamatan (FR-7)
  const filteredReports = useMemo(() => {
    return validReports.filter(rep => {
      // Filter Tingkat
      if (severityFilter !== 'all') {
        const repSev = (rep.estimated_severity || rep.severity || '').toLowerCase();
        if (repSev !== severityFilter) return false;
      }

      // Filter Kecamatan
      if (districtFilter !== 'all' && districtFilter !== 'Semua Kecamatan') {
        const repDist = (rep.district || '').toLowerCase();
        if (!repDist.includes(districtFilter.toLowerCase())) return false;
      }

      // Filter Tanggal
      if (startDate) {
        const repDate = new Date(rep.created_at || rep.date);
        const filterStart = new Date(startDate);
        if (repDate < filterStart) return false;
      }
      if (endDate) {
        const repDate = new Date(rep.created_at || rep.date);
        const filterEnd = new Date(endDate);
        filterEnd.setHours(23, 59, 59, 999);
        if (repDate > filterEnd) return false;
      }

      return true;
    });
  }, [validReports, severityFilter, districtFilter, startDate, endDate]);

  const handleResetFilter = () => {
    setSeverityFilter('all');
    setDistrictFilter('all');
    setStartDate('');
    setEndDate('');
    setSelectedReportId(null);
  };

  const handleSelectReport = (rep) => {
    setSelectedReportId(rep.id);
    if (rep.latitude && rep.longitude) {
      setMapTargetCenter([rep.latitude, rep.longitude]);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ========================================================
          1. HERO SECTION (Gradasi Biru Musi ke Toska)
         ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-musi-600 via-musi-700 to-toska-400 text-white p-6 sm:p-8 lg:p-10 shadow-lembut overflow-hidden">
        {/* Hiasan Gelombang SVG Halus di Latar Belakang */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path d="M0,150 C200,220 350,80 500,150 C650,220 800,80 1000,150 L1000,300 L0,300 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Kolom Kiri: Teks Ajakan Utama */}
          <div className="lg:col-span-7 space-y-4">
            {/* Pil Pengelola Komunitas */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 select-none">
              <PartnerLogo size={30} />
              <span>Program GG River Care &bull; Green Generation Palembang</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Sungai kotor? Laporkan saja.
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-medium">
              Bantu kami memetakan pencemaran di sepanjang aliran Sungai Musi. Laporanmu langsung diverifikasi tim relawan Green Generation Palembang untuk advokasi pembersihan.
            </p>

            {/* Tombol Aksi */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/lapor">
                <Button variant="ajakan" size="lg" className="shadow-lg">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Laporkan Pencemaran</span>
                </Button>
              </Link>

              <Link to="/lacak">
                <Button variant="garis" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Search className="w-4 h-4" />
                  <span>Lacak Laporan</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: 3 Langkah Ringkas Melapor (≥ 768px) */}
          <div className="hidden md:block lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3.5 text-xs text-white">
              <span className="font-bold uppercase tracking-wider block text-white/80 text-xs">
                3 Langkah Mudah Menjaga Musi
              </span>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-ceria-400 text-ink flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Ambil Foto Bukti</p>
                  <p className="text-white/80 leading-snug mt-0.5">Potret tumpahan minyak, sampah, atau busa di sempadan sungai.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-ceria-400 text-ink flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Tandai Titik Lokasi</p>
                  <p className="text-white/80 leading-snug mt-0.5">Gunakan GPS ponselmu atau geser pin tepat ke lokasi kejadian.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-ceria-400 text-ink flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Terbit di Peta Publik</p>
                  <p className="text-white/80 leading-snug mt-0.5">Diverifikasi relawan GG River Care &amp; masuk data advokasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FILTER BAR (FR-7: Tanggal, Tingkat, Kecamatan)
         ======================================================== */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-garis">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-musi-100 text-musi-600 flex items-center justify-center">
              <Filter className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-ink">
                Peta Sebaran Laporan Valid
              </h2>
              <p className="text-xs text-ink-muted">
                Menampilkan <strong className="text-ink font-bold tabular-nums">{filteredReports.length}</strong> titik pencemaran yang telah terverifikasi.
              </p>
            </div>
          </div>

          {(severityFilter !== 'all' || districtFilter !== 'all' || startDate || endDate) && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-musi-600 hover:text-musi-800 transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hapus Filter</span>
            </button>
          )}
        </div>

        {/* Kontrol Filter Multi-Dimensi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Filter Tingkat Dugaan (Chip) */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Tingkat Dugaan
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'berat', label: 'Berat' },
                { id: 'sedang', label: 'Sedang' },
                { id: 'ringan', label: 'Ringan' }
              ].map((lvl) => {
                const isActive = severityFilter === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSeverityFilter(lvl.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none border ${
                      isActive
                        ? 'bg-musi-600 text-white border-musi-600 shadow-xs'
                        : 'bg-white text-ink-soft border-garis hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Kecamatan */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Kecamatan
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-garis rounded-2xl text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:border-musi-600 focus:ring-4 focus:ring-musi-100 transition"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Filter Rentang Tanggal */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2 space-y-0">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-garis rounded-2xl text-xs font-semibold text-ink focus:outline-none focus:border-musi-600 focus:ring-4 focus:ring-musi-100 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-garis rounded-2xl text-xs font-semibold text-ink focus:outline-none focus:border-musi-600 focus:ring-4 focus:ring-musi-100 transition"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================
          3. PETA INTERAKTIF & DAFTAR LAPORAN (2 Kolom di Desktop)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Daftar Laporan Terbaru (360px di desktop) */}
        <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Daftar Laporan Terverifikasi
            </span>
            <span className="text-xs font-bold text-musi-600 tabular-nums">
              {filteredReports.length} Laporan
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <EmptyState
              title="Belum Ada Laporan Valid"
              description="Tidak ditemukan laporan terverifikasi yang cocok dengan kriteria filter yang kamu pasang."
              actionLabel="Atur Ulang Filter"
              onAction={handleResetFilter}
            />
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredReports.map((rep) => {
                const isSelected = selectedReportId === rep.id;
                const severity = (rep.estimated_severity || rep.severity || 'sedang').toLowerCase();
                const formattedDate = rep.created_at
                  ? new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '10 Nov 2026';

                return (
                  <div
                    key={rep.id}
                    onClick={() => handleSelectReport(rep)}
                    className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all duration-150 ease-halus cursor-pointer flex gap-3.5 items-start ${
                      isSelected
                        ? 'border-musi-600 ring-4 ring-musi-100 shadow-md scale-[1.01]'
                        : 'border-garis hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Thumbnail Foto */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-garis">
                      <img
                        src={rep.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'}
                        alt={rep.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Informasi Laporan */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <Badge type="tingkat" value={severity} size="md" />
                        <span className="text-xs font-semibold text-ink-muted">
                          {formattedDate}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-ink truncate mt-1">
                        {rep.title}
                      </h3>

                      <p className="text-xs text-ink-soft flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-musi-600 shrink-0" />
                        <span className="truncate">{rep.district || rep.address_landmark}</span>
                      </p>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-ink-muted tabular-nums">
                          {rep.tracking_code || 'SPP-202611-XXXX'}
                        </span>
                        <span className="text-xs font-bold text-musi-600 inline-flex items-center gap-0.5">
                          <span>Buka Peta</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Wadah Peta Leaflet (Minimal 620px di desktop, 300px di HP) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white rounded-3xl border border-garis p-2 sm:p-2.5 shadow-lembut relative overflow-hidden">
            <div className="h-[320px] sm:h-[440px] lg:h-[620px] w-full rounded-2xl overflow-hidden relative">
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

                <MapController targetCenter={mapTargetCenter} />

                {filteredReports.map((rep) => {
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
                        click: () => {
                          setSelectedReportId(rep.id);
                        }
                      }}
                    >
                      <Popup className="custom-leaflet-popup">
                        <div className="w-60 overflow-hidden font-sans">
                          {/* Foto Popup */}
                          <div className="h-28 w-full bg-slate-100 overflow-hidden relative">
                            <img
                              src={rep.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'}
                              alt={rep.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge type="tingkat" value={severity} size="md" />
                            </div>
                          </div>

                          {/* Isi Popup */}
                          <div className="p-3.5 space-y-2">
                            <h4 className="text-xs font-bold text-ink leading-snug">
                              {rep.title}
                            </h4>

                            <div className="text-xs text-ink-soft space-y-1">
                              <p className="flex items-center gap-1 text-ink-muted">
                                <MapPin className="w-3 h-3 text-musi-600 shrink-0" />
                                <span className="truncate">{rep.district} &bull; {rep.address_landmark}</span>
                              </p>
                              <p className="flex items-center gap-1 text-ink-muted">
                                <Calendar className="w-3 h-3 text-ink-muted shrink-0" />
                                <span>{rep.created_at ? new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '10 Nov 2026'}</span>
                              </p>
                            </div>

                            {/* Tombol Buka di Google Maps */}
                            <a
                              href={gmapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-full bg-musi-100 hover:bg-musi-600 text-musi-800 hover:text-white text-xs font-bold transition mt-1"
                            >
                              <span>Buka di Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Legenda Tingkat Dugaan di Sudut Kiri Bawah Peta */}
              <div className="absolute left-3 bottom-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 border border-garis shadow-lembut flex items-center gap-3 text-xs font-bold select-none">
                <span className="flex items-center gap-1.5 text-tingkat-berat-tx">
                  <span className="w-2.5 h-2.5 rounded-full bg-tingkat-berat"></span>
                  <span>Berat</span>
                </span>
                <span className="flex items-center gap-1.5 text-tingkat-sedang-tx">
                  <span className="w-2.5 h-2.5 rounded-full bg-tingkat-sedang"></span>
                  <span>Sedang</span>
                </span>
                <span className="flex items-center gap-1.5 text-tingkat-ringan-tx">
                  <span className="w-2.5 h-2.5 rounded-full bg-tingkat-ringan"></span>
                  <span>Ringan</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
