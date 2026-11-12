import React from 'react';

/**
 * Badge Component - SIPEPES v2.0
 * Tipe:
 * - 'tingkat': 'berat' | 'sedang' | 'ringan'
 * - 'status': 'menunggu' | 'valid' | 'ditolak'
 */
export default function Badge({
  type = 'status',
  value = 'menunggu',
  size = 'md',
  dot = true,
  children,
  className = ''
}) {
  const sizeStyles = {
    md: 'h-7 px-3 text-xs',
    lg: 'h-8.5 px-3.5 text-sm font-bold'
  };

  const tingkatStyles = {
    berat: 'bg-tingkat-berat-bg text-tingkat-berat-tx',
    sedang: 'bg-tingkat-sedang-bg text-tingkat-sedang-tx',
    ringan: 'bg-tingkat-ringan-bg text-tingkat-ringan-tx'
  };

  const statusStyles = {
    menunggu: 'bg-ceria-100 text-ceria-800',
    valid: 'bg-musi-100 text-musi-800',
    ditolak: 'bg-abu-100 text-ink-soft'
  };

  const defaultLabels = {
    berat: 'Tingkat Berat',
    sedang: 'Tingkat Sedang',
    ringan: 'Tingkat Ringan',
    menunggu: 'Menunggu Verifikasi',
    valid: 'Valid',
    ditolak: 'Ditolak'
  };

  const activeStyle = type === 'tingkat' 
    ? (tingkatStyles[value] || tingkatStyles.sedang)
    : (statusStyles[value] || statusStyles.menunggu);

  const displayLabel = children || defaultLabels[value] || value;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full select-none ${sizeStyles[size] || sizeStyles.md} ${activeStyle} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}

