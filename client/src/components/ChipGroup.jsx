import React from 'react';
import { Check } from 'lucide-react';

/**
 * ChipGroup Component - SIPEPES v2.0
 * Digunakan untuk:
 * - Kategori/Jenis Limbah
 * - Tingkat Dugaan (Ringan, Sedang, Berat)
 * - Kondisi Lokasi
 */
export default function ChipGroup({
  options = [],
  value,
  onChange,
  className = ''
}) {
  return (
    <div className={`flex flex-wrap gap-2.5 sm:gap-3 ${className}`}>
      {options.map((opt) => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const optDesc = typeof opt === 'object' ? opt.desc : null;
        const isSelected = value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange(optValue)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ease-halus border cursor-pointer select-none ${
              isSelected
                ? 'bg-musi-600 text-white border-musi-600 shadow-lembut scale-[1.02]'
                : 'bg-white text-ink border-garis hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
            <span>{optLabel}</span>
            {optDesc && (
              <span className={`text-xs font-normal opacity-80 ${isSelected ? 'text-white' : 'text-ink-muted'}`}>
                ({optDesc})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

