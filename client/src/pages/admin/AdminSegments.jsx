import React, { useState } from 'react';
import { FolderTree, Plus, MapPin, Search, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSegments() {
  const { riverSegments, reports } = useAdmin();
  const [segments, setSegments] = useState(riverSegments);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Bukit Kecil');
  const [lat, setLat] = useState('-2.9912000');
  const [lng, setLng] = useState('104.7615000');
  const [desc, setDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSeg = {
      id: `seg-${Date.now()}`,
      name,
      district,
      default_lat: parseFloat(lat),
      default_lng: parseFloat(lng),
      description: desc
    };

    setSegments([...segments, newSeg]);
    setName('');
    setDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-river-600" />
            Master Data Segmen Sungai Musi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelompokan zonasi pemantauan titik rawan pencemaran (Acuan: docs/ERD_SCHEMA.md)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-river-600 hover:bg-river-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Segmen Baru'}</span>
        </button>
      </div>

      {/* Form Tambah Segmen (Jika dibuka) */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Form Tambah Segmen Aliran Sungai
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Segmen Zona</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Contoh: Kawasan Pulau Kemaro - Sungai Gerong"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-river-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan Cakupan</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                placeholder="Contoh: Kalidoni"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-river-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Titik Acuan Lintang (Latitude)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl font-mono border border-slate-300 focus:ring-2 focus:ring-river-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Titik Acuan Bujur (Longitude)</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl font-mono border border-slate-300 focus:ring-2 focus:ring-river-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Keterangan / Kerentanan Titik</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Contoh: Rawan buangan sampah industri dan pasar tradisional..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-river-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-eco-600 hover:bg-eco-700"
            >
              Simpan Segmen
            </button>
          </div>
        </form>
      )}

      {/* Tabel Segmen */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Segmen</th>
                <th className="py-3.5 px-4">Kecamatan</th>
                <th className="py-3.5 px-4">Koordinat Acuan</th>
                <th className="py-3.5 px-4">Keterangan Titik</th>
                <th className="py-3.5 px-4 text-center">Jumlah Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {segments.map((seg) => {
                const count = reports.filter(r => r.district === seg.district).length;
                return (
                  <tr key={seg.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      🌊 {seg.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Kec. {seg.district}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {seg.default_lat.toFixed(6)}, {seg.default_lng.toFixed(6)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs">
                      {seg.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-river-50 text-river-700 border border-river-100">
                        {count} Laporan
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
