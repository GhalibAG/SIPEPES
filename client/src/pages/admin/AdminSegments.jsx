import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Search,
  Plus,
  MapPin,
  ExternalLink,
  RotateCcw,
  Check,
  Copy,
  Layers,
  Tag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Toast from '../../components/Toast';

export default function AdminSegments() {
  const { sempadanList } = useAdmin();

  const [activeTab, setActiveTab] = useState('points'); // 'points' | 'waste_types'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Master Jenis Limbah (Sesuai Skema Database PostgreSQL enum)
  const wasteTypes = [
    {
      code: 'minyak_oli',
      label: 'Limbah Minyak & B3',
      priority: 'Tingkat Berat',
      desc: 'Tumpahan oli pelumas mesin ketek, minyak kapal jukung, dan bahan kimia berbahaya.',
      actionNote: 'Prioritas pembersihan segera dan isolasi permukaan air sempadan.'
    },
    {
      code: 'sampah_domestik',
      label: 'Sampah Plastik & Domestik',
      priority: 'Tingkat Sedang',
      desc: 'Timbulan kantong kresek, botol plastik, styrofoam, dan sampah rumah tangga.',
      actionNote: 'Pembersihan gotong royong berkala bersama relawan warga.'
    },
    {
      code: 'limbah_industri',
      label: 'Limbah Industri & Pabrik',
      priority: 'Tingkat Berat',
      desc: 'Buangan limbah cair berwarna gelap berbusa dari kawasan industri atau pabrik.',
      actionNote: 'Dokumentasi untuk bahan audiensi advokasi kebijakan lingkungan.'
    },
    {
      code: 'lainnya',
      label: 'Gulma & Eceng Gondok',
      priority: 'Tingkat Ringan',
      desc: 'Tumpukan eceng gondok liar yang menutupi alur sempadan sungai.',
      actionNote: 'Pemantauan alur pelayaran perahu warga.'
    }
  ];

  const filteredPoints = useMemo(() => {
    return (sempadanList || []).filter(p => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (p.nama || '').toLowerCase().includes(q);
        const matchWilayah = (p.wilayah || '').toLowerCase().includes(q);
        const matchKode = (p.kode || '').toLowerCase().includes(q);
        if (!matchName && !matchWilayah && !matchKode) return false;
      }
      return true;
    });
  }, [sempadanList, searchTerm]);

  const handleCopyCoord = (coord, code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(coord);
      setCopiedCode(code);
      setToastMessage(`Koordinat pos ${code} berhasil disalin`);
      setTimeout(() => setCopiedCode(''), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Header Banner Data Master */}
      <Card className="p-6 sm:p-8 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ungu-100 text-ungu-800 text-xs font-bold">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Data Master &bull; Referensi Geospasial</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Data Master Wilayah &amp; Jenis Limbah
            </h1>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
              Basis data referensi titik pantau sempadan Sungai Musi dan kategori jenis pencemaran air untuk relawan GG River Care.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('points')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'points'
                  ? 'bg-ink text-white shadow-xs'
                  : 'bg-slate-50 text-ink-muted hover:bg-slate-100'
              }`}
            >
              Titik Sempadan ({sempadanList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('waste_types')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'waste_types'
                  ? 'bg-ink text-white shadow-xs'
                  : 'bg-slate-50 text-ink-muted hover:bg-slate-100'
              }`}
            >
              Jenis Limbah ({wasteTypes.length})
            </button>
          </div>
        </div>
      </Card>

      {/* ========================================================
          TAB 1: DAFTAR TITIK SEMPADAN MUSI
         ======================================================== */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pos sempadan, dermaga, atau kode..."
                className="w-full h-10 pl-10 pr-3.5 bg-slate-50 border border-garis rounded-full text-xs font-semibold text-ink focus:outline-none focus:bg-white focus:border-ungu-600 transition"
              />
            </div>
          </Card>

          {/* Tabel Titik Sempadan */}
          <Card className="p-0 overflow-hidden bg-white shadow-lembut">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-garis text-ink-muted uppercase font-bold text-xs select-none">
                    <th className="py-3.5 px-4">Kode Pos</th>
                    <th className="py-3.5 px-4">Nama Pos Sempadan</th>
                    <th className="py-3.5 px-4">Wilayah / Kecamatan</th>
                    <th className="py-3.5 px-4">Tim Relawan Pemantau</th>
                    <th className="py-3.5 px-4 text-right">Koordinat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-garis">
                  {filteredPoints.map((p) => {
                    const isCopied = copiedCode === p.kode;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-ungu-800 whitespace-nowrap">
                          {p.kode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-ink">
                          {p.nama}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-ink-soft">
                          {p.wilayah}
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted">
                          {p.regu_patroli || 'Relawan GG River Care'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs text-ink-muted whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleCopyCoord(p.koordinat, p.kode)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Salin koordinat"
                          >
                            <span>{p.koordinat}</span>
                            {isCopied ? <Check className="w-3 h-3 text-toska-800" /> : <Copy className="w-3 h-3 text-ink-muted" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================
          TAB 2: MASTER JENIS LIMBAH
         ======================================================== */}
      {activeTab === 'waste_types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {wasteTypes.map((wt) => (
            <Card key={wt.code} className="p-5 sm:p-6 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-ink">
                    {wt.code}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-ink">
                    {wt.label}
                  </h3>
                </div>
                <span className="text-xs font-bold text-tingkat-berat-tx">
                  {wt.priority}
                </span>
              </div>

              <p className="text-xs text-ink-soft leading-relaxed">
                {wt.desc}
              </p>

              <div className="pt-2 border-t border-garis text-xs text-ink-muted flex items-start gap-1.5">
                <span className="font-bold text-ink shrink-0">Tindakan:</span>
                <span>{wt.actionNote}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
