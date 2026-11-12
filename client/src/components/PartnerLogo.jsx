import React from 'react';
import ggpLogo from '../assets/logo-ggp.png';

/**
 * PartnerLogo Component - SIPEPES v2.0
 * Wadah putih bersudut 14px dengan padding 3px dan garis tipis garis.
 * Ukuran: 30, 36, 40, 64 px.
 */
export default function PartnerLogo({
  size = 40,
  className = '',
  withLabel = false,
  labelPosition = 'right'
}) {
  const sizeClasses = {
    30: 'w-[30px] h-[30px] p-[2px] rounded-[10px]',
    36: 'w-[36px] h-[36px] p-[3px] rounded-[12px]',
    40: 'w-[40px] h-[40px] p-[3px] rounded-[14px]',
    64: 'w-[64px] h-[64px] p-[4px] rounded-[18px]'
  };

  const container = (
    <div
      className={`bg-white shadow-[0_0_0_1px_#ECE6D9] inline-flex items-center justify-center shrink-0 overflow-hidden ${
        sizeClasses[size] || sizeClasses[40]
      } ${className}`}
    >
      <img
        src={ggpLogo}
        alt="Logo Green Generation Sumatera Selatan"
        className="w-full h-full object-contain rounded-[8px]"
      />
    </div>
  );

  if (!withLabel) return container;

  return (
    <div className="inline-flex items-center gap-3">
      {container}
      <div className="text-left">
        <span className="block text-xs font-bold text-ink leading-tight">
          Green Generation Palembang
        </span>
        <span className="block text-xs font-semibold text-ink-muted">
          Program GG River Care
        </span>
      </div>
    </div>
  );
}

