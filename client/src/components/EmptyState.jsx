import React from 'react';
import Button from './Button';

/**
 * EmptyState Component - SIPEPES v2.0
 */
export default function EmptyState({
  title = 'Belum Ada Data',
  description = 'Saat ini belum ada data laporan yang cocok dengan filter yang kamu pilih.',
  actionLabel,
  onAction,
  icon: Icon
}) {
  return (
    <div className="bg-white rounded-3xl border border-garis p-8 sm:p-12 text-center max-w-lg mx-auto shadow-lembut">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-musi-100 text-musi-600 flex items-center justify-center mx-auto mb-4">
        {Icon ? (
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
        ) : (
          <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-ink-soft mt-1.5 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="utama" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

