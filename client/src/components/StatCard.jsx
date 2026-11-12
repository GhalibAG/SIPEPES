import React from 'react';

/**
 * StatCard Component - SIPEPES v2.0
 * Varian latar: 'musi' | 'ceria' | 'toska' | 'abu' | 'putih'
 */
export default function StatCard({
  variant = 'musi',
  label,
  value,
  description,
  icon: Icon,
  className = ''
}) {
  const variantStyles = {
    musi: 'bg-musi-100 border-musi-100 text-musi-800',
    ceria: 'bg-ceria-100 border-ceria-100 text-ceria-800',
    toska: 'bg-toska-100 border-toska-100 text-toska-800',
    abu: 'bg-abu-100 border-abu-100 text-ink-soft',
    putih: 'bg-white border-garis shadow-lembut text-ink-soft'
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 ease-halus ${variantStyles[variant] || variantStyles.musi} ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shrink-0 text-current shadow-2xs">
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="text-3xl sm:text-4xl font-bold text-ink tracking-tight tabular-nums mt-2">
        {value}
      </div>

      {description && (
        <div className="text-xs font-medium text-ink-soft mt-1.5 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
}

