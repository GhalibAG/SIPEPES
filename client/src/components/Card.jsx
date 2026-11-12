import React from 'react';

/**
 * Card Component - SIPEPES v2.0
 * Latar putih, rounded-3xl (24px), shadow-lembut, border-garis.
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl border border-garis p-5 sm:p-7 shadow-lembut transition-all duration-200 ease-halus ${
        hoverable ? 'hover:-translate-y-0.5 hover:shadow-angkat cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

