import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Toast from '../../components/Toast';

export default function WargaTrack() {
  const { reports } = useAdmin();
  const { kode: paramKode } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(paramKode || '');
  const [activeCode, setActiveCode] = useState(paramKode || '');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sinkronisasi dengan URL param jika berubah
  useEffect(() => {
    if (paramKode) {
      setInputCode(paramKode);
      setActiveCode(paramKode);
    }
  }, [paramKode]);

  // Pencarian Laporan yang Tepat (Tanpa Fallback ke Laporan Lain)
  const normalizedSearch = activeCode.trim().toUpperCase();
  const foundReport = normalizedSearch
    ? (reports || []).find(
        r => (r.tracking_code && r.tracking_code.toUpperCase() === normalizedSearch) ||
             (r.id && r.id.toUpperCase() === normalizedSearch)
      )
    : null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim());
      navigate(`/lacak/${encodeURIComponent(inputCode.trim())}`, { replace: true });
    }
  };

  const handleCopyCode = () => {
    if (foundReport?.tracking_code && navigator.clipboard) {
      navigator.clipboard.writeText(foundReport.tracking_code);
      setCopied(true);
      setToastMessage('Kode tiket berhasil disalin ke papan klip');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWa = () => {
    if (foundReport?.tracking_code) {
      const shareUrl = `${window.location.origin}/lacak/${foundReport.tracking_code}`;
      const text = `Pantau status laporan pencemaran #${foundReport.tracking_code} di SIPEPES GG River Care: ${shareUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Header Halaman */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Lacak Status Laporan Pencemaran
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
          Pantau transparansi tindak lanjut laporanmu yang sedang ditangani relawan Green Generation Palembang (Program GG River Care).
        </p>
      </div>

      {/* Form Input Pencarian Kode Tiket (FR-4) */}
      <Card className="p-3 sm:p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Masukkan kode tiket (contoh: SPP-202611-0012)"
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-garis rounded-full text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:border-musi-600 focus:bg-white focus:ring-4 focus:ring-musi-100 transition uppercase tracking-wider"
            />
          </div>

          <Button type="submit" variant="utama" size="md" className="w-full sm:w-auto shrink-0">
            <span>Cek Status</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </Card>

      {/* ========================================================
          KONDISI 1: KODE TIDAK DITEMUKAN (TIDAK BOLEH NAMPILKAN LAPORAN LAIN)
         ======================================================== */}
      {activeCode && !foundReport && (
        <Card className="text-center p-8 sm:p-12 space-y-4 border-tingkat-berat-bg">
          <div className="w-16 h-16 rounded-full bg-tingkat-berat-bg text-tingkat-berat-tx flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-ink">
              Kode Tiket Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              Tidak ada data laporan dengan kode <strong className="font-mono text-ink">{activeCode}</strong>. Pastikan kode yang kamu masukkan sudah benar dan sesuai format.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/lapor">
              <Button variant="ajakan" size="md">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Buat Laporan Baru</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* ========================================================
          KONDISI 2: LAPORAN DITEMUKAN
         ======================================================== */}
      {foundReport && (
        <div className="space-y-6 animate-fade-in">

          {/* Kartu Status & Kode Tiket */}
          <Card className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-garis">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Kode Tiket Laporan
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-ink font-mono tracking-wider tabular-nums flex items-center gap-2">
                  <span>{foundReport.tracking_code}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded-lg hover:bg-slate-100 text-ink-muted hover:text-ink transition cursor-pointer"
                    title="Salin kode"
                  >
                    {copied ? <Check className="w-4 h-4 text-toska-800" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Lencana Status Besar */}
              <div>
                <Badge
                  type="status"
                  value={foundReport.status === 'terverifikasi' ? 'valid' : foundReport.status}
                  size="lg"
                />
              </div>
            </div>

            {/* Linimasa 2 Tahap Komunitas Mandiri */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Linimasa Proses Verifikasi
              </span>

              <div className="space-y-4 pl-2 border-l-2 border-garis ml-3">
                {/* Tahap 1: Laporan Diterima */}
                <div className="relative pl-6">
                  <div className="absolute -left-[19px] top-0 w-8 h-8 rounded-full bg-toska-100 text-toska-800 flex items-center justify-center border-2 border-white shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink">
                      Laporan Diterima Sistem
                    </h4>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {foundReport.created_at
                        ? new Date(foundReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '10 Nov 2026, 14:22 WIB'}
                    </p>
                    <p className="text-xs text-ink-soft mt-1">
                      Data dan foto bukti tersimpan aman di sistem komunitas GG River Care.
                    </p>
                  </div>
                </div>

                {/* Tahap 2: Peninjauan Relawan */}
                <div className="relative pl-6 pt-2">
                  {foundReport.status === 'menunggu' && (
                    <>
                      <div className="absolute -left-[19px] top-2 w-8 h-8 rounded-full bg-ceria-100 text-ceria-800 flex items-center justify-center border-2 border-white shadow-xs">
                        <Clock className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink">
                          Dalam Antrean Verifikasi
                        </h4>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          Tim relawan GG River Care sedang memeriksa foto bukti dan koordinat sempadanmu.
                        </p>
                      </div>
                    </>
                  )}

                  {(foundReport.status === 'valid' || foundReport.status === 'terverifikasi') && (
                    <>
                      <div className="absolute -left-[19px] top-2 w-8 h-8 rounded-full bg-musi-100 text-musi-600 flex items-center justify-center border-2 border-white shadow-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-bold text-ink">
                            Laporan Diverifikasi &amp; Terbit di Peta
                          </h4>
                          <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                            Laporanmu telah dinyatakan valid dan saat ini sudah tampil di peta sebaran publik untuk bahan advokasi komunitas.
                          </p>
                        </div>
                        <Link to="/">
                          <Button variant="lembut" size="sm">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Lihat di Peta Sebaran</span>
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}

                  {foundReport.status === 'ditolak' && (
                    <>
                      <div className="absolute -left-[19px] top-2 w-8 h-8 rounded-full bg-tingkat-berat-bg text-tingkat-berat-tx flex items-center justify-center border-2 border-white shadow-xs">
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-ink">
                            Laporan Ditolak
                          </h4>
                          <p className="text-xs text-ink-soft mt-1">
                            Laporan tidak dapat diterbitkan ke peta publik setelah ditinjau oleh tim relawan.
                          </p>
                        </div>

                        {/* Kotak Alasan Penolakan Resmi dari Admin */}
                        <div className="p-4 rounded-2xl bg-tingkat-berat-bg border border-tingkat-berat-tx/20 space-y-1">
                          <span className="text-xs font-bold text-tingkat-berat-tx uppercase tracking-wider block">
                            Alasan Penolakan:
                          </span>
                          <p className="text-xs text-tingkat-berat-tx leading-relaxed font-semibold">
                            "{foundReport.rejection_reason || 'Foto bukti tidak memuat indikasi pencemaran air sempadan Sungai Musi yang jelas atau berada di luar batas wilayah pemantauan.'}"
                          </p>
                        </div>

                        <Link to="/lapor">
                          <Button variant="ajakan" size="sm">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Buat Laporan Baru</span>
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Bagikan */}
            <div className="pt-3 border-t border-garis flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleShareWa}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-ink text-xs font-semibold border border-garis transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bagikan Status</span>
              </button>
            </div>
          </Card>

          {/* Rangkuman Detail Laporan yang Dilacak */}
          <Card className="p-5 sm:p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
              Detail Laporan yang Dikirimkan
            </span>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-garis">
                <img
                  src={foundReport.photo_url || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'}
                  alt={foundReport.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    type="tingkat"
                    value={(foundReport.estimated_severity || foundReport.severity || 'sedang').toLowerCase()}
                    size="md"
                  />
                  <span className="text-xs font-bold text-ink-muted">
                    {foundReport.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink">
                  {foundReport.title}
                </h3>

                <p className="text-xs text-ink-soft leading-relaxed">
                  {foundReport.description}
                </p>

                <div className="pt-2 text-xs text-ink-muted flex items-center gap-1 border-t border-garis/60">
                  <MapPin className="w-3.5 h-3.5 text-musi-600 shrink-0" />
                  <span className="truncate">{foundReport.district} &bull; {foundReport.address_landmark}</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      )}
    </div>
  );
}
