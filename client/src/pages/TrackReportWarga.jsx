import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Share2, 
  Loader2, 
  MapPin,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';

// Fallback dummy object for catch block offline preview
const fallbackReportData = {
  tracking_code: 'SPP-202611-0012',
  title: 'Dermaga 7 Ulu, Seberang Ulu I',
  description: 'Dilihat: Tumpahan oli hitam mencemari tepian dermaga',
  photo_url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600',
  latitude: -2.997421,
  longitude: 104.768132,
  district: 'Seberang Ulu I',
  estimated_severity: 'berat',
  status: 'valid', // 'menunggu' | 'valid' | 'ditolak'
  rejection_reason: '',
  created_at: '14 Nov 2026, 08:42 WIB'
};

const fallbackNearbyReports = [
  {
    tracking_code: 'SPP-202611-0008',
    title: 'Jembatan Ampera - Sempadan Ulu',
    description: 'Limbah oli dan sampah plastik menumpuk pada tiang jembatan.',
    estimated_severity: 'berat',
    status: 'Tindak Lanjut Lapangan (DLH)',
    distance: '800m terdekat'
  },
  {
    tracking_code: 'SPP-202611-0015',
    title: 'Kampung Kapitan, Ilir Barat I',
    description: 'Sedimentasi buangan detergen dan bau anyir di bantaran rawa.',
    estimated_severity: 'sedang',
    status: 'Verifikasi Valid Posko',
    distance: '1.2km terdekat'
  }
];

export default function TrackReportWarga() {
  const [searchCode, setSearchCode] = useState('');
  const [report, setReport] = useState(null);
  const [nearbyReports, setNearbyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle Axios Search Request
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    const cleanCode = searchCode.trim();

    try {
      const response = await axios.get(`http://localhost:5000/api/v1/reports/track/${cleanCode}`);
      if (response && response.data && response.data.data) {
        setReport(response.data.data);
        setNearbyReports(response.data.data.nearby || fallbackNearbyReports);
      } else {
        setReport(fallbackReportData);
        setNearbyReports(fallbackNearbyReports);
      }
    } catch (error) {
      console.warn('Backend server offline. Utilizing fallback mock data in catch block for tracking.', error);
      // Fallback mock data in catch block
      setReport({
        ...fallbackReportData,
        tracking_code: cleanCode.toUpperCase()
      });
      setNearbyReports(fallbackNearbyReports);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* HEADER & CENTRALIZED SEARCH CONTAINER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Laporan
        </h1>
        <p className="text-slate-600 text-sm">
          Pantau perkembangan laporan pencemaran Sungai Musi secara mudah.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="relative flex items-center pt-2">
          <div className="absolute left-4 text-river-600">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Masukkan Nomor Laporan (Contoh: #SPP-202611-0012)"
            className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-24 py-3.5 text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-river-500"
          />
          {searchCode && (
            <button
              type="button"
              onClick={() => setSearchCode('')}
              className="absolute right-28 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 bg-river-600 hover:bg-river-700 font-medium rounded-lg text-white px-5 py-2.5 text-sm shadow-sm transition cursor-pointer"
          >
            Cek Laporan
          </button>
        </form>

        <p className="text-xs text-slate-400">
          Contoh nomor laporan: <span className="font-mono font-semibold text-slate-600">#SPP-202611-0012</span> • <span className="font-mono font-semibold text-slate-600">#SPP-202611-0015</span>
        </p>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 text-river-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Memverifikasi nomor tiket di database DLH...</p>
        </div>
      )}

      {/* INITIAL STATE BEFORE SEARCH */}
      {!hasSearched && !isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-river-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Masukkan Nomor Tiket Di Atas</h3>
          <p className="text-xs text-slate-500">
            Ketik nomor laporan yang Anda miliki untuk melihat status verifikasi, petugas penanggung jawab, serta posisi titik di peta.
          </p>
        </div>
      )}

      {/* REPORT RESULT CONTAINER (DESKTOP SPLIT & MOBILE STACK) */}
      {hasSearched && !isLoading && report && (
        <div className="space-y-6">
          
          {/* PRIMARY REPORT INFO BLOCK & TIMELINE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
            
            {/* Top Bar inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <span className="font-mono font-bold text-river-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 text-sm w-fit">
                #{report.tracking_code}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide w-fit ${getSeverityBadge(report.estimated_severity)}`}>
                Limbah {report.estimated_severity}
              </span>
            </div>

            {/* Content Overview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4 h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img 
                  src={report.photo_url} 
                  alt={report.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-8 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{report.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium pt-1">
                  <Clock className="w-3.5 h-3.5 text-river-600" />
                  <span>Waktu Lapor: {report.created_at}</span>
                </div>
              </div>
            </div>

            {/* STAGE-BASED STEPPER TIMELINE BLOCK */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Tahapan Penanganan:</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* STAGE 1: Laporan Diterima */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">1. Laporan Diterima</span>
                    <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Laporan masuk ke sistem pengawasan.</p>
                </div>

                {/* STAGE 2: Dicek Petugas */}
                <div className={`p-4 rounded-xl border shadow-xs space-y-2 ${
                  report.status === 'ditolak' ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">2. Dicek Petugas</span>
                    {report.status === 'ditolak' ? (
                      <span className="flex items-center space-x-1 text-red-700 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Ditolak</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {report.status === 'ditolak' 
                      ? (report.rejection_reason || 'Foto atau lokasi tidak valid / duplikat laporan.') 
                      : 'Foto dan lokasi telah diverifikasi tim posko.'}
                  </p>
                </div>

                {/* STAGE 3: Tindak Lanjut Lapangan */}
                <div className={`p-4 rounded-xl border shadow-xs space-y-2 ${
                  report.status === 'valid' ? 'bg-sky-50/60 border-sky-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">3. Tindak Lanjut Lapangan</span>
                    <span className="flex items-center space-x-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      <RefreshCcw className="w-3 h-3 animate-spin text-amber-800" />
                      <span>Proses</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Sedang dikerjakan oleh tim DLH Kota Palembang.</p>
                </div>

              </div>
            </div>

            {/* Action Buttons at Foot of Card Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href={`https://wa.me/?text=Halo%20Petugas%20DLH,%20saya%20ingin%20menanyakan%20status%20laporan%20${report.tracking_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Petugas</span>
              </a>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'SIPEPES Laporan', url: window.location.href });
                  } else {
                    alert(`Tautan laporan ${report.tracking_code} berhasil disalin ke clipboard!`);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              >
                <Share2 className="w-4 h-4 text-river-600" />
                <span>Bagikan ke Warga</span>
              </button>
            </div>

          </div>

          {/* MINI MAP PANEL: VERIFIKASI TITIK LOKASI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-river-600" />
                <h3 className="font-bold text-slate-900 text-base">VERIFIKASI TITIK LOKASI</h3>
              </div>
              <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-200 w-fit">
                {report.latitude || -2.997421}, {report.longitude || 104.768132}
              </div>
            </div>

            {/* Leaflet Map */}
            <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
              <MapContainer 
                center={[report.latitude || -2.997421, report.longitude || 104.768132]} 
                zoom={14} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[report.latitude || -2.997421, report.longitude || 104.768132]}>
                  <Popup>
                    <div className="p-1 space-y-1 max-w-[180px]">
                      <p className="font-bold text-xs text-slate-900">{report.title}</p>
                      <p className="text-[10px] font-mono text-slate-500">#{report.tracking_code}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center justify-between text-xs text-river-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-river-600 shrink-0" />
                <span>Transparansi Pengawasan SIPEPES: Laporan dipantau publik secara real-time demi percepatan pemulihan air baku Sungai Musi oleh DLH & relawan Green Generation.</span>
              </div>
            </div>
          </div>

          {/* BOTTOM HORIZONTAL LIST BLOCK: Laporan Lain di Sekitar Lokasi Ini */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Laporan Lain di Sekitar Lokasi Ini</h3>
              <span className="text-xs text-slate-400">Diperbarui baru saja</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyReports.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-river-700">{item.tracking_code}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getSeverityBadge(item.estimated_severity)}`}>
                      {item.estimated_severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500 font-medium">
                    <span>{item.status}</span>
                    <span className="text-river-600 font-bold">{item.distance || '800m terdekat'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}