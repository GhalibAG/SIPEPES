import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Camera, 
  Search, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  Navigation,
  Loader2
} from 'lucide-react';

// Fallback mock data placed strictly for the catch block fallback mechanism
const fallbackStats = {
  total_locations: 148,
  active_incidents: 24
};

const fallbackReports = [
  {
    id: 1,
    tracking_code: 'SPP-202611-0012',
    title: 'Tumpahan Limbah Oli Bekas Motor Ketek',
    description: 'Lapisan residu hidrokarbon meluas 40m dari bibir tambatan tongkang getek. Tercium bau pekat uap minyak di sekitar dermaga.',
    photo_url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600',
    latitude: -2.99841,
    longitude: 104.76729,
    pollution_type: 'Minyak',
    estimated_severity: 'berat',
    status: 'Terverifikasi DLH',
    created_at: 'Hari ini, 08:42 WIB',
    zone: 'Seberang Ulu I',
    validations: 42
  },
  {
    id: 2,
    tracking_code: 'SPP-202611-0015',
    title: 'Timbunan Debu Batubara & Tongkang',
    description: 'Debu batubara mencemari dermaga kecil warga akibat aktivitas bongkar muat tanpa pelindung jaring.',
    photo_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    latitude: -2.98500,
    longitude: 104.75000,
    pollution_type: 'Limbah Padat',
    estimated_severity: 'sedang',
    status: 'Sedang',
    created_at: '1 jam lalu',
    zone: 'Seberang Ulu II',
    validations: 18
  },
  {
    id: 3,
    tracking_code: 'SPP-202611-0008',
    title: 'Sampah Plastik Menumpuk di Tepian',
    description: 'Plastik rumah tangga menumpuk di bawah tiang jembatan wisata Benteng Kuto Besak.',
    photo_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
    latitude: -2.99000,
    longitude: 104.77000,
    pollution_type: 'Sampah',
    estimated_severity: 'ringan',
    status: 'Valid',
    created_at: '3 jam lalu',
    zone: 'Bukit Kecil',
    validations: 31
  },
  {
    id: 4,
    tracking_code: 'SPP-202611-0010',
    title: 'Limbah Cair Industri Kimia',
    description: 'Pembuangan air limbah berwarna keruh pekat langsung ke alur sekunder Sungai Musi.',
    photo_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=600',
    latitude: -2.97500,
    longitude: 104.78500,
    pollution_type: 'Limbah Cair',
    estimated_severity: 'berat',
    status: 'Dalam Penanganan',
    created_at: '5 jam lalu',
    zone: 'Seberang Ilir',
    validations: 56
  }
];

export default function DashboardWarga({ onNavigateToReport, onNavigateToTrack }) {
  // 1. Empty Initial States
  const [stats, setStats] = useState({ total_locations: 0, active_incidents: 0 });
  const [reports, setReports] = useState([]);
  const [selectedZone, setSelectedZone] = useState('Semua Wilayah');
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend API with fallback in catch block
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, reportsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/stats/summary'),
          axios.get('http://localhost:5000/api/v1/reports')
        ]);

        if (statsRes.data) setStats(statsRes.data);
        if (reportsRes.data && Array.isArray(reportsRes.data)) {
          setReports(reportsRes.data);
          if (reportsRes.data.length > 0) {
            setSelectedReport(reportsRes.data[0]);
          }
        }
      } catch (err) {
        console.warn('Backend server offline. Utilizing fallback mock data in catch block.', err);
        // 2. Keep Mock Data strictly in the catch block
        setStats(fallbackStats);
        setReports(fallbackReports);
        setSelectedReport(fallbackReports[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter reports based on selected zone
  const filteredReports = selectedZone === 'Semua Wilayah' 
    ? reports 
    : reports.filter(r => r.zone === selectedZone || (selectedZone === 'Seberang Ilir' && r.zone === 'Bukit Kecil'));

  // Severity badge styling helper
  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'berat':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'sedang':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'ringan':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* =========================================================
          HERO INTRODUCTION & CTA BUTTONS GRID
          ========================================================= */}
      <div className="space-y-4">
        {/* Community Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-river-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-river-600 animate-pulse"></span>
          Gerakan Jaga Sungai Musi
        </div>

        {/* Hero Header Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pantau & Laporkan Pencemaran
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-3xl">
            Wadah resmi warga Palembang melaporkan timbulan sampah liar, tumpahan minyak, & limbah air di sepanjang aliran Sungai Musi.
          </p>
        </div>

        {/* Primary Call-To-Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigateToReport && onNavigateToReport()}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-river-600 hover:bg-river-700 text-white font-semibold text-sm shadow-md transition-all transform active:scale-[0.99]"
          >
            <Camera className="w-5 h-5" />
            <span>Lapor Pencemaran Sekarang</span>
          </button>

          <button
            onClick={() => onNavigateToTrack && onNavigateToTrack()}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-sky-50 hover:bg-sky-100 text-river-700 border border-sky-200 font-semibold text-sm shadow-xs transition-all transform active:scale-[0.99]"
          >
            <Search className="w-5 h-5 text-river-600" />
            <span>Cek Status Laporan</span>
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Card 1: Total Locations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-river-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.total_locations} Lokasi</div>
              <div className="text-xs text-slate-500 font-medium">Dipantau Relawan & Sensor</div>
            </div>
          </div>

          {/* Card 2: Active Incidents */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.active_incidents} Titik</div>
              <div className="text-xs text-slate-500 font-medium">Perlu Dibersihkan & Verifikasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SYNCHRONIZED LOADING / DATA MAPPING VIEWPORT
          ========================================================= */}
      {loading && reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 text-river-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Memuat data sebaran dan laporan warga...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Peta Sebaran Interaktif (Leaflet Map & Zone Toggles) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-river-600" />
                <h2 className="font-bold text-slate-900 text-base">Peta Sebaran Pencemaran</h2>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>{reports.filter(r => r.estimated_severity === 'berat').length} Titik Kritis Aktif</span>
              </div>
            </div>

            {/* Horizontal Zone Toggles */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['Semua Wilayah', 'Seberang Ulu I', 'Seberang Ulu II', 'Bukit Kecil'].map((zone) => {
                const isActive = selectedZone === zone;
                return (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-river-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {zone}
                  </button>
                );
              })}
            </div>

            {/* Leaflet Map Container */}
            <div className="h-[380px] sm:h-[480px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
              <MapContainer 
                center={[-2.990, 104.760]} 
                zoom={13} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredReports.map((report) => (
                  <Marker 
                    key={report.id}
                    position={[report.latitude, report.longitude]}
                    eventHandlers={{
                      click: () => setSelectedReport(report),
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 max-w-[200px]">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getSeverityBadge(report.estimated_severity)}`}>
                          {report.estimated_severity}
                        </span>
                        <p className="font-bold text-xs text-slate-900">{report.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 px-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span>Berat</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Sedang</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Ringan</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Sinkronisasi DLH Palembang</span>
            </div>
          </div>

          {/* RIGHT PANEL: Active Incident Card & Scrollable Report List */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Selected Active Incident Card Detail */}
            {selectedReport && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-sky-50 border-b border-l border-sky-100 rounded-bl-xl text-[11px] font-mono font-semibold text-river-700">
                  {selectedReport.tracking_code}
                </div>

                <div className="flex items-center justify-between pr-24">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getSeverityBadge(selectedReport.estimated_severity)}`}>
                    Tercemar {selectedReport.estimated_severity}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {selectedReport.status}
                  </span>
                </div>

                {/* Incident Image */}
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img 
                    src={selectedReport.photo_url} 
                    alt={selectedReport.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base">{selectedReport.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-river-600" />
                    <span>{selectedReport.zone || 'Dermaga Musi Palembang'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Meta details & Coordinates in Monospace */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>{selectedReport.created_at}</span>
                  </div>
                  <div className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                    {selectedReport.latitude?.toFixed(4)}, {selectedReport.longitude?.toFixed(4)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button 
                    onClick={() => alert(`Terima kasih! Validasi laporan ${selectedReport.tracking_code} berhasil ditambahkan.`)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bantu Validasi ({selectedReport.validations || 42})</span>
                  </button>
                  <a 
                    href={`https://wa.me/?text=Halo%20DLH%20Palembang,%20saya%20ingin%20melaporkan%20terkait%20${selectedReport.tracking_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Petugas</span>
                  </a>
                </div>
              </div>
            )}

            {/* Scrollable Latest Reports Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-bold text-slate-900 text-base">Laporan Warga Terbaru</h3>
                </div>
                <button 
                  onClick={() => onNavigateToTrack && onNavigateToTrack()}
                  className="text-xs font-semibold text-river-600 hover:text-river-700 flex items-center space-x-1"
                >
                  <span>Lihat Arsip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* List of reports */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredReports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <div 
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-3.5 ${
                        isSelected 
                          ? 'border-river-600 bg-sky-50/50 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img 
                        src={report.photo_url} 
                        alt={report.title} 
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getSeverityBadge(report.estimated_severity)}`}>
                            {report.estimated_severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{report.created_at}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">{report.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{report.zone || 'Palembang'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}