import React from 'react';
import { AlertCircle, CheckCircle2, Clock, XCircle, Flame, AlertTriangle, ShieldCheck } from 'lucide-react';

// Sesuai docs/DESIGN_SYSTEM.md Bagian B: Indikator Tingkat Pencemaran
export function SeverityBadge({ severity, className = '' }) {
  switch (severity) {
    case 'berat':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Tercemar Berat
        </span>
      );
    case 'sedang':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Tercemar Sedang
        </span>
      );
    case 'ringan':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Tercemar Ringan
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 ${className}`}>
          {severity || '-'}
        </span>
      );
  }
}

// Sesuai docs/DESIGN_SYSTEM.md Bagian C: Status Alur Laporan
export function StatusBadge({ status, className = '' }) {
  switch (status) {
    case 'menunggu':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 ${className}`}>
          <Clock className="w-3 h-3 text-yellow-600" />
          Menunggu Verifikasi
        </span>
      );
    case 'valid':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-blue-600" />
          Terverifikasi (Valid)
        </span>
      );
    case 'ditolak':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <XCircle className="w-3 h-3 text-slate-500" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 ${className}`}>
          {status}
        </span>
      );
  }
}

// Label Tipe Pencemaran
export function PollutionTypeBadge({ type, className = '' }) {
  const map = {
    sampah_domestik: { label: 'Sampah Domestik', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    limbah_industri: { label: 'Limbah Industri', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    minyak_oli: { label: 'Minyak / Oli', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    lainnya: { label: 'Lainnya', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  };

  const item = map[type] || { label: type, color: 'bg-slate-50 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${item.color} ${className}`}>
      {item.label}
    </span>
  );
}

